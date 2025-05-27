import SwiftUI

struct VisualInterfaceView: View {
    @EnvironmentObject private var tradingViewModel: TradingViewModel
    @State private var activeSymbol: String = "SOL/USDC"
    @State private var timeframe: String = "1h"
    
    // Market overview data
    private let marketOverview = [
        MarketOverviewItem(symbol: "SOL/USDC", price: "103.42", change: "+2.5%", volume: "1.2M", changeType: .positive),
        MarketOverviewItem(symbol: "BTC/USDC", price: "62,145.78", change: "-0.8%", volume: "5.7M", changeType: .negative),
        MarketOverviewItem(symbol: "ETH/USDC", price: "3,421.56", change: "+1.2%", volume: "3.4M", changeType: .positive)
    ]
    
    var body: some View {
        VStack(spacing: 16) {
            // Market Overview
            marketOverviewSection
            
            // Main Content
            HStack(alignment: .top, spacing: 16) {
                // Left Column - Chart and Market Data
                VStack(spacing: 16) {
                    // Chart
                    ChartView(symbol: activeSymbol, timeframe: timeframe, onTimeframeChange: { newTimeframe in
                        timeframe = newTimeframe
                    })
                    .frame(height: 300)
                    .background(Color.white)
                    .cornerRadius(12)
                    .shadow(color: Color.black.opacity(0.05), radius: 5, x: 0, y: 2)
                    
                    // Order Book and Recent Trades
                    HStack(alignment: .top, spacing: 16) {
                        OrderBookView(symbol: activeSymbol)
                            .frame(maxWidth: .infinity)
                            .background(Color.white)
                            .cornerRadius(12)
                            .shadow(color: Color.black.opacity(0.05), radius: 5, x: 0, y: 2)
                        
                        VStack {
                            Text("Recent Trades")
                                .font(.headline)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .padding(.bottom, 8)
                            
                            ForEach(tradingViewModel.recentTrades) { trade in
                                HStack {
                                    Text(trade.type == "buy" ? "Buy" : "Sell")
                                        .foregroundColor(trade.type == "buy" ? .green : .red)
                                        .font(.subheadline)
                                    
                                    Spacer()
                                    
                                    Text(trade.price)
                                        .font(.subheadline)
                                    
                                    Spacer()
                                    
                                    Text(trade.amount)
                                        .font(.subheadline)
                                    
                                    Spacer()
                                    
                                    Text(trade.timeAgo)
                                        .font(.subheadline)
                                        .foregroundColor(.gray)
                                }
                                .padding(.vertical, 4)
                                
                                Divider()
                            }
                        }
                        .frame(maxWidth: .infinity)
                        .background(Color.white)
                        .cornerRadius(12)
                        .shadow(color: Color.black.opacity(0.05), radius: 5, x: 0, y: 2)
                    }
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
                
                // Right Column - Trading Form and Wallet
                VStack(spacing: 16) {
                    SwapFormView()
                        .background(Color.white)
                        .cornerRadius(12)
                        .shadow(color: Color.black.opacity(0.05), radius: 5, x: 0, y: 2)
                    
                    WalletView()
                        .background(Color.white)
                        .cornerRadius(12)
                        .shadow(color: Color.black.opacity(0.05), radius: 5, x: 0, y: 2)
                }
                .frame(width: 320)
            }
        }
    }
    
    // Market Overview Section
    private var marketOverviewSection: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 12) {
                ForEach(marketOverview) { market in
                    Button(action: {
                        activeSymbol = market.symbol
                    }) {
                        VStack(alignment: .leading, spacing: 4) {
                            HStack {
                                Text(market.symbol)
                                    .font(.headline)
                                    .foregroundColor(.primary)
                                
                                Spacer()
                                
                                Text(market.change)
                                    .font(.caption)
                                    .fontWeight(.medium)
                                    .padding(.horizontal, 8)
                                    .padding(.vertical, 4)
                                    .background(market.changeType == .positive ? Color.green.opacity(0.1) : Color.red.opacity(0.1))
                                    .foregroundColor(market.changeType == .positive ? .green : .red)
                                    .cornerRadius(4)
                            }
                            
                            Text("$\(market.price)")
                                .font(.title2)
                                .fontWeight(.bold)
                                .foregroundColor(.primary)
                            
                            Text("Vol: $\(market.volume)")
                                .font(.caption)
                                .foregroundColor(.gray)
                        }
                        .padding()
                        .frame(width: 200, alignment: .leading)
                        .background(activeSymbol == market.symbol ? Color(hex: "F3F4F6") : Color.white)
                        .cornerRadius(12)
                        .shadow(color: Color.black.opacity(0.05), radius: 5, x: 0, y: 2)
                    }
                    .buttonStyle(PlainButtonStyle())
                }
            }
            .padding(.horizontal)
        }
    }
}

// Market Overview Item Model
struct MarketOverviewItem: Identifiable {
    let id = UUID()
    let symbol: String
    let price: String
    let change: String
    let volume: String
    let changeType: ChangeType
    
    enum ChangeType {
        case positive
        case negative
    }
}

struct VisualInterfaceView_Previews: PreviewProvider {
    static var previews: some View {
        VisualInterfaceView()
            .environmentObject(TradingViewModel())
    }
}
