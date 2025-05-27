import SwiftUI

struct OrderBookView: View {
    @State private var bids: [OrderBookEntry] = []
    @State private var asks: [OrderBookEntry] = []
    @State private var isLoading: Bool = true
    let symbol: String
    
    var body: some View {
        VStack(spacing: 12) {
            Text("Order Book")
                .font(.headline)
                .frame(maxWidth: .infinity, alignment: .leading)
            
            if isLoading {
                ProgressView()
                    .frame(maxWidth: .infinity, minHeight: 100)
            } else {
                HStack(alignment: .top, spacing: 16) {
                    // Bids (Buy Orders)
                    VStack(spacing: 8) {
                        HStack {
                            Text("Price")
                                .font(.caption)
                                .foregroundColor(.gray)
                            
                            Spacer()
                            
                            Text("Amount")
                                .font(.caption)
                                .foregroundColor(.gray)
                        }
                        
                        ForEach(bids) { bid in
                            HStack {
                                Text(bid.price)
                                    .font(.caption)
                                    .foregroundColor(.green)
                                
                                Spacer()
                                
                                Text(bid.amount)
                                    .font(.caption)
                            }
                        }
                    }
                    .frame(maxWidth: .infinity)
                    
                    // Asks (Sell Orders)
                    VStack(spacing: 8) {
                        HStack {
                            Text("Price")
                                .font(.caption)
                                .foregroundColor(.gray)
                            
                            Spacer()
                            
                            Text("Amount")
                                .font(.caption)
                                .foregroundColor(.gray)
                        }
                        
                        ForEach(asks) { ask in
                            HStack {
                                Text(ask.price)
                                    .font(.caption)
                                    .foregroundColor(.red)
                                
                                Spacer()
                                
                                Text(ask.amount)
                                    .font(.caption)
                            }
                        }
                    }
                    .frame(maxWidth: .infinity)
                }
            }
        }
        .padding()
        .onAppear {
            loadOrderBook()
        }
        .onChange(of: symbol) { _ in
            loadOrderBook()
        }
    }
    
    // Load Order Book
    private func loadOrderBook() {
        isLoading = true
        
        // In a real implementation, this would call the API
        // For demo purposes, we'll generate mock data
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            // Generate mock order book data
            let basePrice = 103.42
            var mockBids: [OrderBookEntry] = []
            var mockAsks: [OrderBookEntry] = []
            
            // Generate bids (buy orders) slightly below base price
            for i in 0..<5 {
                let price = (basePrice - (Double(i) * 0.02) - (Double.random(in: 0...0.01))).formatted(.number.precision(.fractionLength(2)))
                let amount = (Double.random(in: 0.5...10.0)).formatted(.number.precision(.fractionLength(2)))
                mockBids.append(OrderBookEntry(id: UUID(), price: price, amount: amount))
            }
            
            // Generate asks (sell orders) slightly above base price
            for i in 0..<5 {
                let price = (basePrice + (Double(i) * 0.02) + (Double.random(in: 0...0.01))).formatted(.number.precision(.fractionLength(2)))
                let amount = (Double.random(in: 0.5...10.0)).formatted(.number.precision(.fractionLength(2)))
                mockAsks.append(OrderBookEntry(id: UUID(), price: price, amount: amount))
            }
            
            // Sort bids in descending order (highest price first)
            mockBids.sort { Double($0.price)! > Double($1.price)! }
            
            // Sort asks in ascending order (lowest price first)
            mockAsks.sort { Double($0.price)! < Double($1.price)! }
            
            self.bids = mockBids
            self.asks = mockAsks
            self.isLoading = false
        }
    }
}

// Order Book Entry Model
struct OrderBookEntry: Identifiable {
    let id: UUID
    let price: String
    let amount: String
}

struct OrderBookView_Previews: PreviewProvider {
    static var previews: some View {
        OrderBookView(symbol: "SOL/USDC")
            .previewLayout(.sizeThatFits)
            .padding()
    }
}
