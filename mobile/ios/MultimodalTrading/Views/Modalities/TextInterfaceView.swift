import SwiftUI

struct TextInterfaceView: View {
    @EnvironmentObject private var tradingViewModel: TradingViewModel
    @State private var commandInput: String = ""
    @State private var commandHistory: [CommandHistoryItem] = []
    @State private var status: CommandStatus = .idle
    
    var body: some View {
        VStack(spacing: 0) {
            // Command Terminal Output
            ScrollViewReader { scrollView in
                ScrollView {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Welcome to the Multimodal Trading Interface Command Terminal")
                            .font(.system(.subheadline, design: .monospaced))
                            .foregroundColor(.gray)
                        
                        Text("Type /help to see available commands")
                            .font(.system(.subheadline, design: .monospaced))
                            .foregroundColor(.gray)
                        
                        Divider()
                            .padding(.vertical, 8)
                        
                        ForEach(commandHistory) { item in
                            Text(item.text)
                                .font(.system(.subheadline, design: .monospaced))
                                .foregroundColor(item.color)
                                .padding(.vertical, 2)
                                .id(item.id)
                        }
                    }
                    .padding()
                    .frame(maxWidth: .infinity, alignment: .leading)
                }
                .background(Color.black)
                .cornerRadius(8)
                .onChange(of: commandHistory) { _ in
                    if let lastItem = commandHistory.last {
                        scrollView.scrollTo(lastItem.id, anchor: .bottom)
                    }
                }
            }
            
            // Command Input
            HStack {
                TextField("Type a command (e.g., /buy 0.5 SOL)", text: $commandInput)
                    .font(.system(.body, design: .monospaced))
                    .padding()
                    .background(Color(UIColor.systemGray6))
                    .cornerRadius(8)
                    .autocapitalization(.none)
                    .disableAutocorrection(true)
                
                Button(action: {
                    processCommand()
                }) {
                    Image(systemName: "arrow.up.circle.fill")
                        .font(.title2)
                        .foregroundColor(Color(hex: "4F46E5"))
                }
                .disabled(commandInput.isEmpty)
            }
            .padding()
        }
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: Color.black.opacity(0.05), radius: 10, x: 0, y: 5)
        .onAppear {
            // Add welcome message
            addToOutput("Welcome to the Multimodal Trading Interface Command Terminal", color: .gray)
            addToOutput("Type /help to see available commands", color: .gray)
        }
    }
    
    // Process Command
    private func processCommand() {
        guard !commandInput.isEmpty else { return }
        
        // Add command to history
        addToOutput("> \(commandInput)", color: .green)
        
        // Process command
        let command = commandInput
        commandInput = ""
        
        if command.starts(with: "/help") {
            showHelpCommand()
        } else if command.starts(with: "/buy") {
            processBuyCommand(command)
        } else if command.starts(with: "/sell") {
            processSellCommand(command)
        } else if command.starts(with: "/swap") {
            processSwapCommand(command)
        } else if command.starts(with: "/price") {
            processPriceCommand(command)
        } else if command.starts(with: "/balance") {
            processBalanceCommand(command)
        } else if command.starts(with: "/history") {
            processHistoryCommand(command)
        } else {
            addToOutput("Unknown command: \(command). Type /help to see available commands.", color: .yellow)
        }
    }
    
    // Show Help Command
    private func showHelpCommand() {
        addToOutput("Available commands:", color: .white)
        addToOutput("  /buy [amount] [token] - Place a buy order", color: .white)
        addToOutput("  /sell [amount] [token] - Place a sell order", color: .white)
        addToOutput("  /swap [amount] [fromToken] [toToken] - Execute a token swap", color: .white)
        addToOutput("  /price [token] - Get current price of a token", color: .white)
        addToOutput("  /balance - View your wallet balance", color: .white)
        addToOutput("  /history - View your transaction history", color: .white)
        addToOutput("  /help - Show this help message", color: .white)
    }
    
    // Process Buy Command
    private func processBuyCommand(_ command: String) {
        addToOutput("Processing buy order...", color: .blue)
        status = .processing
        
        // In a real implementation, this would call the API
        // For demo purposes, we'll just simulate processing
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            let components = command.split(separator: " ")
            if components.count >= 3 {
                let amount = String(components[1])
                let token = String(components[2])
                
                tradingViewModel.executeBuy(amount: amount, token: token)
                
                addToOutput("Buy order executed: \(amount) \(token)", color: .green)
                status = .success
            } else {
                addToOutput("Invalid buy command format. Use: /buy [amount] [token]", color: .red)
                status = .error
            }
        }
    }
    
    // Process Sell Command
    private func processSellCommand(_ command: String) {
        addToOutput("Processing sell order...", color: .blue)
        status = .processing
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            let components = command.split(separator: " ")
            if components.count >= 3 {
                let amount = String(components[1])
                let token = String(components[2])
                
                tradingViewModel.executeSell(amount: amount, token: token)
                
                addToOutput("Sell order executed: \(amount) \(token)", color: .green)
                status = .success
            } else {
                addToOutput("Invalid sell command format. Use: /sell [amount] [token]", color: .red)
                status = .error
            }
        }
    }
    
    // Process Swap Command
    private func processSwapCommand(_ command: String) {
        addToOutput("Processing swap...", color: .blue)
        status = .processing
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            let components = command.split(separator: " ")
            if components.count >= 4 {
                let amount = String(components[1])
                let fromToken = String(components[2])
                let toToken = String(components[3])
                
                tradingViewModel.executeSwap(amount: amount, fromToken: fromToken, toToken: toToken)
                
                addToOutput("Swap executed: \(amount) \(fromToken) to \(toToken)", color: .green)
                status = .success
            } else {
                addToOutput("Invalid swap command format. Use: /swap [amount] [fromToken] [toToken]", color: .red)
                status = .error
            }
        }
    }
    
    // Process Price Command
    private func processPriceCommand(_ command: String) {
        addToOutput("Fetching price...", color: .blue)
        status = .processing
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            let components = command.split(separator: " ")
            if components.count >= 2 {
                let token = String(components[1])
                
                let price = tradingViewModel.getPrice(token: token)
                
                addToOutput("Current price of \(token): $\(price)", color: .green)
                status = .success
            } else {
                addToOutput("Invalid price command format. Use: /price [token]", color: .red)
                status = .error
            }
        }
    }
    
    // Process Balance Command
    private func processBalanceCommand(_ command: String) {
        addToOutput("Fetching balance...", color: .blue)
        status = .processing
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            let balances = tradingViewModel.getBalances()
            
            addToOutput("Your wallet balances:", color: .green)
            for (token, amount) in balances {
                addToOutput("  \(token): \(amount)", color: .white)
            }
            
            status = .success
        }
    }
    
    // Process History Command
    private func processHistoryCommand(_ command: String) {
        addToOutput("Fetching transaction history...", color: .blue)
        status = .processing
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            let history = tradingViewModel.getOrderHistory()
            
            addToOutput("Your transaction history:", color: .green)
            for transaction in history {
                addToOutput("  \(transaction.type): \(transaction.amount) \(transaction.token) at \(transaction.timestamp)", color: .white)
            }
            
            status = .success
        }
    }
    
    // Add text to command output
    private func addToOutput(_ text: String, color: Color) {
        let item = CommandHistoryItem(text: text, color: color)
        commandHistory.append(item)
    }
}

// Command History Item
struct CommandHistoryItem: Identifiable {
    let id = UUID()
    let text: String
    let color: Color
}

// Command Status
enum CommandStatus {
    case idle
    case processing
    case success
    case error
}

struct TextInterfaceView_Previews: PreviewProvider {
    static var previews: some View {
        TextInterfaceView()
            .environmentObject(TradingViewModel())
    }
}
