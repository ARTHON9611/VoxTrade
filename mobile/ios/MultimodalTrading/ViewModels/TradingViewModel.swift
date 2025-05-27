import Foundation
import Combine

class TradingViewModel: ObservableObject {
    @Published var balances: [String: String] = [:]
    @Published var orderHistory: [Transaction] = []
    @Published var recentTrades: [Trade] = []
    @Published var isLoading: Bool = false
    @Published var error: String? = nil
    
    private var cancellables = Set<AnyCancellable>()
    
    init() {
        // Initialize with mock data
        setupMockData()
    }
    
    // MARK: - Data Loading
    
    func loadBalances() {
        isLoading = true
        error = nil
        
        // In a real implementation, this would call the API
        // For demo purposes, we'll use mock data
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) { [weak self] in
            self?.isLoading = false
            // Mock data already set in init
        }
    }
    
    func loadOrderHistory() {
        isLoading = true
        error = nil
        
        // In a real implementation, this would call the API
        // For demo purposes, we'll use mock data
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) { [weak self] in
            self?.isLoading = false
            // Mock data already set in init
        }
    }
    
    // MARK: - Trading Operations
    
    func executeBuy(amount: String, token: String) -> TradingResult {
        // In a real implementation, this would call the API
        // For demo purposes, we'll simulate a successful trade
        
        // Add to order history
        let transaction = Transaction(
            id: UUID().uuidString,
            type: "buy",
            token: token,
            amount: amount,
            toToken: nil,
            toAmount: nil,
            timestamp: formatDate(Date())
        )
        
        orderHistory.insert(transaction, at: 0)
        
        // Update balances
        if let amountValue = Double(amount) {
            let currentBalance = Double(balances[token] ?? "0") ?? 0
            balances[token] = String(format: "%.6f", currentBalance + amountValue)
            
            // If buying with USDC, deduct USDC
            let price = getPrice(token: token)
            let usdcAmount = amountValue * Double(price)
            let currentUSDC = Double(balances["USDC"] ?? "0") ?? 0
            balances["USDC"] = String(format: "%.6f", currentUSDC - usdcAmount)
        }
        
        return TradingResult(success: true, error: nil)
    }
    
    func executeSell(amount: String, token: String) -> TradingResult {
        // In a real implementation, this would call the API
        // For demo purposes, we'll simulate a successful trade
        
        // Add to order history
        let transaction = Transaction(
            id: UUID().uuidString,
            type: "sell",
            token: token,
            amount: amount,
            toToken: nil,
            toAmount: nil,
            timestamp: formatDate(Date())
        )
        
        orderHistory.insert(transaction, at: 0)
        
        // Update balances
        if let amountValue = Double(amount) {
            let currentBalance = Double(balances[token] ?? "0") ?? 0
            balances[token] = String(format: "%.6f", currentBalance - amountValue)
            
            // If selling for USDC, add USDC
            let price = getPrice(token: token)
            let usdcAmount = amountValue * Double(price)
            let currentUSDC = Double(balances["USDC"] ?? "0") ?? 0
            balances["USDC"] = String(format: "%.6f", currentUSDC + usdcAmount)
        }
        
        return TradingResult(success: true, error: nil)
    }
    
    func executeSwap(amount: String, fromToken: String, toToken: String) -> TradingResult {
        // In a real implementation, this would call the API
        // For demo purposes, we'll simulate a successful swap
        
        // Calculate to amount
        let fromPrice = getPrice(token: fromToken)
        let toPrice = getPrice(token: toToken)
        let fromAmount = Double(amount) ?? 0
        let toAmount = fromAmount * (Double(fromPrice) / Double(toPrice))
        
        // Add to order history
        let transaction = Transaction(
            id: UUID().uuidString,
            type: "swap",
            token: fromToken,
            amount: amount,
            toToken: toToken,
            toAmount: String(format: "%.6f", toAmount),
            timestamp: formatDate(Date())
        )
        
        orderHistory.insert(transaction, at: 0)
        
        // Update balances
        let currentFromBalance = Double(balances[fromToken] ?? "0") ?? 0
        balances[fromToken] = String(format: "%.6f", currentFromBalance - fromAmount)
        
        let currentToBalance = Double(balances[toToken] ?? "0") ?? 0
        balances[toToken] = String(format: "%.6f", currentToBalance + toAmount)
        
        return TradingResult(success: true, error: nil)
    }
    
    // MARK: - Voice Command Processing
    
    func processBuyCommand(_ command: String) {
        // Extract amount and token from command
        // Example: "Buy 0.5 SOL"
        let components = command.components(separatedBy: " ")
        if components.count >= 3 {
            let amount = components[1]
            let token = components[2].uppercased()
            
            _ = executeBuy(amount: amount, token: token)
        }
    }
    
    func processSellCommand(_ command: String) {
        // Extract amount and token from command
        // Example: "Sell 0.5 SOL"
        let components = command.components(separatedBy: " ")
        if components.count >= 3 {
            let amount = components[1]
            let token = components[2].uppercased()
            
            _ = executeSell(amount: amount, token: token)
        }
    }
    
    func processSwapCommand(_ command: String) {
        // Extract amount, from token, and to token from command
        // Example: "Swap 0.5 SOL to USDC"
        let components = command.components(separatedBy: " ")
        if components.count >= 5 && components[3].lowercased() == "to" {
            let amount = components[1]
            let fromToken = components[2].uppercased()
            let toToken = components[4].uppercased()
            
            _ = executeSwap(amount: amount, fromToken: fromToken, toToken: toToken)
        }
    }
    
    func processPriceCommand(_ command: String) {
        // Extract token from command
        // Example: "Check price of SOL"
        let components = command.components(separatedBy: " ")
        if components.count >= 4 && components[1].lowercased() == "price" && components[2].lowercased() == "of" {
            let token = components[3].uppercased()
            
            _ = getPrice(token: token)
        }
    }
    
    func processBalanceCommand(_ command: String) {
        // No extraction needed, just return balances
        // Example: "Check my balance"
        _ = getBalances()
    }
    
    // MARK: - Helper Methods
    
    func getPrice(token: String) -> String {
        // In a real implementation, this would call the API
        // For demo purposes, we'll return mock prices
        
        switch token.uppercased() {
        case "SOL":
            return "103.42"
        case "BTC":
            return "62145.78"
        case "ETH":
            return "3421.56"
        case "USDC":
            return "1.00"
        case "USDT":
            return "1.00"
        default:
            return "0.00"
        }
    }
    
    func getBalances() -> [String: String] {
        return balances
    }
    
    func getOrderHistory() -> [Transaction] {
        return orderHistory
    }
    
    // MARK: - Mock Data Setup
    
    private func setupMockData() {
        // Mock balances
        balances = [
            "SOL": "2.5",
            "USDC": "500.00",
            "USDT": "250.00",
            "BTC": "0.005",
            "ETH": "0.1"
        ]
        
        // Mock order history
        orderHistory = [
            Transaction(
                id: "1",
                type: "buy",
                token: "SOL",
                amount: "1.0",
                toToken: nil,
                toAmount: nil,
                timestamp: "2025-05-25 14:30"
            ),
            Transaction(
                id: "2",
                type: "swap",
                token: "USDC",
                amount: "100.0",
                toToken: "SOL",
                toAmount: "0.97",
                timestamp: "2025-05-24 10:15"
            ),
            Transaction(
                id: "3",
                type: "sell",
                token: "ETH",
                amount: "0.05",
                toToken: nil,
                toAmount: nil,
                timestamp: "2025-05-23 16:45"
            )
        ]
        
        // Mock recent trades
        recentTrades = [
            Trade(
                id: "1",
                type: "buy",
                price: "103.42",
                amount: "0.5",
                timeAgo: "2m ago"
            ),
            Trade(
                id: "2",
                type: "sell",
                price: "103.38",
                amount: "1.2",
                timeAgo: "3m ago"
            ),
            Trade(
                id: "3",
                type: "buy",
                price: "103.35",
                amount: "0.8",
                timeAgo: "5m ago"
            ),
            Trade(
                id: "4",
                type: "sell",
                price: "103.30",
                amount: "2.5",
                timeAgo: "7m ago"
            ),
            Trade(
                id: "5",
                type: "buy",
                price: "103.25",
                amount: "1.0",
                timeAgo: "10m ago"
            )
        ]
    }
    
    // Format date
    private func formatDate(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd HH:mm"
        return formatter.string(from: date)
    }
}

// MARK: - Models

struct Transaction: Identifiable {
    let id: String
    let type: String
    let token: String
    let amount: String
    let toToken: String?
    let toAmount: String?
    let timestamp: String
}

struct Trade: Identifiable {
    let id: String
    let type: String
    let price: String
    let amount: String
    let timeAgo: String
}

struct TradingResult {
    let success: Bool
    let error: String?
}
