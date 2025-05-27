import SwiftUI

struct WalletView: View {
    @EnvironmentObject private var tradingViewModel: TradingViewModel
    @EnvironmentObject private var authViewModel: AuthViewModel
    
    var body: some View {
        VStack(spacing: 16) {
            Text("Wallet")
                .font(.headline)
                .frame(maxWidth: .infinity, alignment: .leading)
            
            if !authViewModel.isAuthenticated {
                // Not connected state
                VStack(spacing: 12) {
                    Image(systemName: "wallet.pass")
                        .font(.system(size: 36))
                        .foregroundColor(.gray)
                        .padding(.bottom, 8)
                    
                    Text("Connect your wallet to view your balance and transactions")
                        .font(.subheadline)
                        .foregroundColor(.gray)
                        .multilineTextAlignment(.center)
                    
                    Button(action: {
                        authViewModel.connect()
                    }) {
                        Text("Connect Wallet")
                            .font(.headline)
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color(hex: "4F46E5"))
                            .cornerRadius(12)
                    }
                }
                .padding()
            } else {
                // Connected state - show balances
                VStack(spacing: 16) {
                    // Token balances
                    ForEach(tradingViewModel.balances.sorted(by: { $0.key < $1.key }), id: \.key) { token, balance in
                        HStack {
                            // Token icon
                            ZStack {
                                Circle()
                                    .fill(tokenColor(token))
                                    .frame(width: 36, height: 36)
                                
                                Text(String(token.prefix(1)))
                                    .font(.system(size: 16, weight: .bold))
                                    .foregroundColor(.white)
                            }
                            
                            Text(token)
                                .font(.headline)
                            
                            Spacer()
                            
                            Text(balance)
                                .font(.headline)
                        }
                        .padding(.vertical, 4)
                    }
                    
                    Divider()
                        .padding(.vertical, 8)
                    
                    // Recent transactions
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Recent Transactions")
                            .font(.subheadline)
                            .fontWeight(.medium)
                        
                        if tradingViewModel.orderHistory.isEmpty {
                            Text("No recent transactions")
                                .font(.subheadline)
                                .foregroundColor(.gray)
                                .padding(.vertical, 8)
                        } else {
                            ForEach(tradingViewModel.orderHistory.prefix(5)) { transaction in
                                VStack(spacing: 4) {
                                    HStack {
                                        Text(formatTransactionType(transaction))
                                            .font(.subheadline)
                                        
                                        Spacer()
                                        
                                        Text(transaction.timestamp)
                                            .font(.caption)
                                            .foregroundColor(.gray)
                                    }
                                    
                                    Divider()
                                }
                            }
                        }
                    }
                }
            }
        }
        .padding()
        .onAppear {
            if authViewModel.isAuthenticated {
                tradingViewModel.loadBalances()
                tradingViewModel.loadOrderHistory()
            }
        }
    }
    
    // Format transaction type
    private func formatTransactionType(_ transaction: Transaction) -> String {
        switch transaction.type {
        case "swap":
            return "Swap \(transaction.amount) \(transaction.token) to \(transaction.toAmount) \(transaction.toToken)"
        case "buy":
            return "Buy \(transaction.amount) \(transaction.token)"
        case "sell":
            return "Sell \(transaction.amount) \(transaction.token)"
        default:
            return "\(transaction.type.capitalized) \(transaction.amount) \(transaction.token)"
        }
    }
    
    // Get token color
    private func tokenColor(_ token: String) -> Color {
        switch token {
        case "SOL":
            return Color.blue
        case "USDC":
            return Color.green
        case "USDT":
            return Color(hex: "26A17B")
        default:
            return Color.gray
        }
    }
}

struct WalletView_Previews: PreviewProvider {
    static var previews: some View {
        WalletView()
            .environmentObject(TradingViewModel())
            .environmentObject(AuthViewModel())
            .previewLayout(.sizeThatFits)
            .padding()
    }
}
