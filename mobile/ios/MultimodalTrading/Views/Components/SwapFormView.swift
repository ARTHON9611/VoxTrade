import SwiftUI

struct SwapFormView: View {
    @EnvironmentObject private var tradingViewModel: TradingViewModel
    @State private var fromToken: String = "SOL"
    @State private var toToken: String = "USDC"
    @State private var amount: String = ""
    @State private var slippage: String = "0.5"
    @State private var isLoading: Bool = false
    @State private var quote: SwapQuote? = nil
    @State private var error: String? = nil
    
    // Available tokens
    private let tokens = ["SOL", "USDC", "USDT"]
    
    // Slippage options
    private let slippageOptions = ["0.1", "0.5", "1.0", "2.0"]
    
    var body: some View {
        VStack(spacing: 16) {
            Text("Swap")
                .font(.headline)
                .frame(maxWidth: .infinity, alignment: .leading)
            
            // From Token
            VStack(spacing: 8) {
                Text("From")
                    .font(.subheadline)
                    .foregroundColor(.gray)
                    .frame(maxWidth: .infinity, alignment: .leading)
                
                HStack {
                    TextField("0.0", text: $amount)
                        .font(.title3)
                        .keyboardType(.decimalPad)
                        .onChange(of: amount) { _ in
                            getQuote()
                        }
                    
                    Spacer()
                    
                    Menu {
                        ForEach(tokens, id: \.self) { token in
                            if token != toToken {
                                Button(token) {
                                    fromToken = token
                                    getQuote()
                                }
                            }
                        }
                    } label: {
                        HStack {
                            Text(fromToken)
                                .font(.headline)
                            
                            Image(systemName: "chevron.down")
                                .font(.caption)
                        }
                        .padding(.horizontal, 12)
                        .padding(.vertical, 8)
                        .background(Color.gray.opacity(0.1))
                        .cornerRadius(8)
                    }
                }
                .padding()
                .background(Color.gray.opacity(0.05))
                .cornerRadius(12)
            }
            
            // Swap Button
            Button(action: {
                // Swap from and to tokens
                let temp = fromToken
                fromToken = toToken
                toToken = temp
                amount = ""
                quote = nil
                getQuote()
            }) {
                Image(systemName: "arrow.up.arrow.down")
                    .font(.system(size: 16, weight: .bold))
                    .padding(8)
                    .background(Color(hex: "4F46E5"))
                    .foregroundColor(.white)
                    .cornerRadius(8)
            }
            .frame(maxWidth: .infinity, alignment: .center)
            
            // To Token
            VStack(spacing: 8) {
                Text("To")
                    .font(.subheadline)
                    .foregroundColor(.gray)
                    .frame(maxWidth: .infinity, alignment: .leading)
                
                HStack {
                    Text(quote?.toAmount ?? "0.0")
                        .font(.title3)
                        .foregroundColor(.gray)
                    
                    Spacer()
                    
                    Menu {
                        ForEach(tokens, id: \.self) { token in
                            if token != fromToken {
                                Button(token) {
                                    toToken = token
                                    getQuote()
                                }
                            }
                        }
                    } label: {
                        HStack {
                            Text(toToken)
                                .font(.headline)
                            
                            Image(systemName: "chevron.down")
                                .font(.caption)
                        }
                        .padding(.horizontal, 12)
                        .padding(.vertical, 8)
                        .background(Color.gray.opacity(0.1))
                        .cornerRadius(8)
                    }
                }
                .padding()
                .background(Color.gray.opacity(0.05))
                .cornerRadius(12)
            }
            
            // Slippage Tolerance
            VStack(spacing: 8) {
                Text("Slippage Tolerance")
                    .font(.subheadline)
                    .foregroundColor(.gray)
                    .frame(maxWidth: .infinity, alignment: .leading)
                
                HStack {
                    ForEach(slippageOptions, id: \.self) { option in
                        Button(action: {
                            slippage = option
                            getQuote()
                        }) {
                            Text("\(option)%")
                                .font(.caption)
                                .padding(.horizontal, 12)
                                .padding(.vertical, 6)
                                .background(slippage == option ? Color(hex: "4F46E5") : Color.gray.opacity(0.1))
                                .foregroundColor(slippage == option ? .white : .primary)
                                .cornerRadius(8)
                        }
                    }
                    
                    Spacer()
                }
            }
            
            // Quote Details
            if let quote = quote, !amount.isEmpty {
                VStack(spacing: 8) {
                    HStack {
                        Text("Rate")
                            .font(.caption)
                            .foregroundColor(.gray)
                        
                        Spacer()
                        
                        Text("1 \(fromToken) = \(quote.rate) \(toToken)")
                            .font(.caption)
                    }
                    
                    HStack {
                        Text("Fee")
                            .font(.caption)
                            .foregroundColor(.gray)
                        
                        Spacer()
                        
                        Text(quote.fee)
                            .font(.caption)
                    }
                    
                    HStack {
                        Text("Min. Received")
                            .font(.caption)
                            .foregroundColor(.gray)
                        
                        Spacer()
                        
                        Text("\(quote.minAmount) \(toToken)")
                            .font(.caption)
                    }
                }
                .padding()
                .background(Color.gray.opacity(0.05))
                .cornerRadius(12)
            }
            
            // Error Message
            if let error = error {
                Text(error)
                    .font(.caption)
                    .foregroundColor(.red)
                    .padding(.vertical, 4)
            }
            
            // Swap Button
            Button(action: {
                executeSwap()
            }) {
                if isLoading {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: .white))
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color(hex: "4F46E5").opacity(0.5))
                        .cornerRadius(12)
                } else {
                    Text("Swap")
                        .font(.headline)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(canSwap ? Color(hex: "4F46E5") : Color(hex: "4F46E5").opacity(0.5))
                        .cornerRadius(12)
                }
            }
            .disabled(!canSwap || isLoading)
        }
        .padding()
    }
    
    // Can swap if amount is valid and not loading
    private var canSwap: Bool {
        guard let amountValue = Double(amount), amountValue > 0 else { return false }
        return !isLoading && !amount.isEmpty
    }
    
    // Get quote for swap
    private func getQuote() {
        guard let amountValue = Double(amount), amountValue > 0 else {
            quote = nil
            return
        }
        
        isLoading = true
        error = nil
        
        // In a real implementation, this would call the API
        // For demo purposes, we'll generate mock data
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            // Generate mock quote
            let rate: Double
            if fromToken == "SOL" && toToken == "USDC" {
                rate = 103.42
            } else if fromToken == "USDC" && toToken == "SOL" {
                rate = 1 / 103.42
            } else if fromToken == "SOL" && toToken == "USDT" {
                rate = 103.38
            } else if fromToken == "USDT" && toToken == "SOL" {
                rate = 1 / 103.38
            } else if fromToken == "USDC" && toToken == "USDT" {
                rate = 0.9996
            } else if fromToken == "USDT" && toToken == "USDC" {
                rate = 1.0004
            } else {
                rate = 1.0
            }
            
            let toAmount = amountValue * rate
            let slippageValue = Double(slippage)! / 100.0
            let minAmount = toAmount * (1 - slippageValue)
            
            self.quote = SwapQuote(
                fromToken: fromToken,
                toToken: toToken,
                fromAmount: amount,
                toAmount: String(format: "%.6f", toAmount),
                minAmount: String(format: "%.6f", minAmount),
                rate: String(format: "%.6f", rate),
                slippage: slippage,
                fee: "0.3%",
                expiresAt: Date().addingTimeInterval(30)
            )
            
            self.isLoading = false
        }
    }
    
    // Execute swap
    private func executeSwap() {
        guard canSwap, let quote = quote else { return }
        
        isLoading = true
        error = nil
        
        // In a real implementation, this would call the API
        // For demo purposes, we'll simulate a delay
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            // Execute swap
            let result = tradingViewModel.executeSwap(
                amount: quote.fromAmount,
                fromToken: quote.fromToken,
                toToken: quote.toToken
            )
            
            if result.success {
                // Reset form
                self.amount = ""
                self.quote = nil
            } else {
                self.error = result.error ?? "Failed to execute swap"
            }
            
            self.isLoading = false
        }
    }
}

// Swap Quote Model
struct SwapQuote {
    let fromToken: String
    let toToken: String
    let fromAmount: String
    let toAmount: String
    let minAmount: String
    let rate: String
    let slippage: String
    let fee: String
    let expiresAt: Date
}

struct SwapFormView_Previews: PreviewProvider {
    static var previews: some View {
        SwapFormView()
            .environmentObject(TradingViewModel())
            .previewLayout(.sizeThatFits)
            .padding()
    }
}
