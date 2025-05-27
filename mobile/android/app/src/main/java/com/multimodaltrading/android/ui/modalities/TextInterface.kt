package com.multimodaltrading.android.ui.modalities

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import com.multimodaltrading.android.viewmodels.TradingViewModel

@Composable
fun TextInterface(
    tradingViewModel: TradingViewModel
) {
    var commandInput by remember { mutableStateOf("") }
    var commandHistory by remember { mutableStateOf(listOf<CommandHistoryItem>()) }
    var status by remember { mutableStateOf(CommandStatus.IDLE) }
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        // Command Terminal Output
        Surface(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth(),
            color = Color.Black,
            shape = MaterialTheme.shapes.medium
        ) {
            val scrollState = rememberScrollState()
            
            Column(
                modifier = Modifier
                    .padding(16.dp)
                    .verticalScroll(scrollState)
            ) {
                // Welcome message
                if (commandHistory.isEmpty()) {
                    Text(
                        text = "Welcome to the Multimodal Trading Interface Command Terminal",
                        style = MaterialTheme.typography.bodyMedium,
                        fontFamily = FontFamily.Monospace,
                        color = Color.Gray
                    )
                    
                    Text(
                        text = "Type /help to see available commands",
                        style = MaterialTheme.typography.bodyMedium,
                        fontFamily = FontFamily.Monospace,
                        color = Color.Gray
                    )
                    
                    Divider(
                        color = Color.Gray.copy(alpha = 0.3f),
                        modifier = Modifier.padding(vertical = 8.dp)
                    )
                }
                
                // Command history
                commandHistory.forEach { item ->
                    Text(
                        text = item.text,
                        style = MaterialTheme.typography.bodyMedium,
                        fontFamily = FontFamily.Monospace,
                        color = item.color,
                        modifier = Modifier.padding(vertical = 2.dp)
                    )
                }
                
                // Auto-scroll to bottom when new commands are added
                LaunchedEffect(commandHistory.size) {
                    scrollState.animateScrollTo(scrollState.maxValue)
                }
            }
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        // Command Input
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            OutlinedTextField(
                value = commandInput,
                onValueChange = { commandInput = it },
                modifier = Modifier.weight(1f),
                placeholder = { Text("Type a command (e.g., /buy 0.5 SOL)") },
                singleLine = true,
                colors = TextFieldDefaults.outlinedTextFieldColors(
                    focusedBorderColor = MaterialTheme.colorScheme.primary,
                    unfocusedBorderColor = MaterialTheme.colorScheme.outline
                )
            )
            
            Spacer(modifier = Modifier.width(8.dp))
            
            Button(
                onClick = {
                    if (commandInput.isNotEmpty()) {
                        processCommand(commandInput, tradingViewModel) { text, color ->
                            commandHistory = commandHistory + CommandHistoryItem(text, color)
                        }
                        commandInput = ""
                    }
                },
                enabled = commandInput.isNotEmpty()
            ) {
                Text("Send")
            }
        }
    }
}

// Process command
private fun processCommand(
    command: String,
    tradingViewModel: TradingViewModel,
    addToOutput: (String, Color) -> Unit
) {
    // Add command to history
    addToOutput("> $command", Color.Green)
    
    // Process command
    when {
        command.startsWith("/help") -> {
            showHelpCommand(addToOutput)
        }
        command.startsWith("/buy") -> {
            processBuyCommand(command, tradingViewModel, addToOutput)
        }
        command.startsWith("/sell") -> {
            processSellCommand(command, tradingViewModel, addToOutput)
        }
        command.startsWith("/swap") -> {
            processSwapCommand(command, tradingViewModel, addToOutput)
        }
        command.startsWith("/price") -> {
            processPriceCommand(command, tradingViewModel, addToOutput)
        }
        command.startsWith("/balance") -> {
            processBalanceCommand(command, tradingViewModel, addToOutput)
        }
        command.startsWith("/history") -> {
            processHistoryCommand(command, tradingViewModel, addToOutput)
        }
        else -> {
            addToOutput("Unknown command: $command. Type /help to see available commands.", Color.Yellow)
        }
    }
}

// Show Help Command
private fun showHelpCommand(addToOutput: (String, Color) -> Unit) {
    addToOutput("Available commands:", Color.White)
    addToOutput("  /buy [amount] [token] - Place a buy order", Color.White)
    addToOutput("  /sell [amount] [token] - Place a sell order", Color.White)
    addToOutput("  /swap [amount] [fromToken] [toToken] - Execute a token swap", Color.White)
    addToOutput("  /price [token] - Get current price of a token", Color.White)
    addToOutput("  /balance - View your wallet balance", Color.White)
    addToOutput("  /history - View your transaction history", Color.White)
    addToOutput("  /help - Show this help message", Color.White)
}

// Process Buy Command
private fun processBuyCommand(
    command: String,
    tradingViewModel: TradingViewModel,
    addToOutput: (String, Color) -> Unit
) {
    addToOutput("Processing buy order...", Color.Blue)
    
    val components = command.split(" ")
    if (components.size >= 3) {
        val amount = components[1]
        val token = components[2]
        
        val result = tradingViewModel.executeBuy(amount, token)
        
        if (result.success) {
            addToOutput("Buy order executed: $amount $token", Color.Green)
        } else {
            addToOutput("Error: ${result.error ?: "Unknown error"}", Color.Red)
        }
    } else {
        addToOutput("Invalid buy command format. Use: /buy [amount] [token]", Color.Red)
    }
}

// Process Sell Command
private fun processSellCommand(
    command: String,
    tradingViewModel: TradingViewModel,
    addToOutput: (String, Color) -> Unit
) {
    addToOutput("Processing sell order...", Color.Blue)
    
    val components = command.split(" ")
    if (components.size >= 3) {
        val amount = components[1]
        val token = components[2]
        
        val result = tradingViewModel.executeSell(amount, token)
        
        if (result.success) {
            addToOutput("Sell order executed: $amount $token", Color.Green)
        } else {
            addToOutput("Error: ${result.error ?: "Unknown error"}", Color.Red)
        }
    } else {
        addToOutput("Invalid sell command format. Use: /sell [amount] [token]", Color.Red)
    }
}

// Process Swap Command
private fun processSwapCommand(
    command: String,
    tradingViewModel: TradingViewModel,
    addToOutput: (String, Color) -> Unit
) {
    addToOutput("Processing swap...", Color.Blue)
    
    val components = command.split(" ")
    if (components.size >= 4) {
        val amount = components[1]
        val fromToken = components[2]
        val toToken = components[3]
        
        val result = tradingViewModel.executeSwap(amount, fromToken, toToken)
        
        if (result.success) {
            addToOutput("Swap executed: $amount $fromToken to $toToken", Color.Green)
        } else {
            addToOutput("Error: ${result.error ?: "Unknown error"}", Color.Red)
        }
    } else {
        addToOutput("Invalid swap command format. Use: /swap [amount] [fromToken] [toToken]", Color.Red)
    }
}

// Process Price Command
private fun processPriceCommand(
    command: String,
    tradingViewModel: TradingViewModel,
    addToOutput: (String, Color) -> Unit
) {
    addToOutput("Fetching price...", Color.Blue)
    
    val components = command.split(" ")
    if (components.size >= 2) {
        val token = components[1]
        
        val price = tradingViewModel.getPrice(token)
        
        addToOutput("Current price of $token: $price", Color.Green)
    } else {
        addToOutput("Invalid price command format. Use: /price [token]", Color.Red)
    }
}

// Process Balance Command
private fun processBalanceCommand(
    command: String,
    tradingViewModel: TradingViewModel,
    addToOutput: (String, Color) -> Unit
) {
    addToOutput("Fetching balance...", Color.Blue)
    
    val balances = tradingViewModel.getBalances()
    
    addToOutput("Your wallet balances:", Color.Green)
    balances.forEach { (token, amount) ->
        addToOutput("  $token: $amount", Color.White)
    }
}

// Process History Command
private fun processHistoryCommand(
    command: String,
    tradingViewModel: TradingViewModel,
    addToOutput: (String, Color) -> Unit
) {
    addToOutput("Fetching transaction history...", Color.Blue)
    
    val history = tradingViewModel.getOrderHistory()
    
    addToOutput("Your transaction history:", Color.Green)
    history.forEach { transaction ->
        val typeStr = when {
            transaction.type == "swap" && transaction.toToken != null -> 
                "Swap ${transaction.amount} ${transaction.token} to ${transaction.toAmount} ${transaction.toToken}"
            else -> "${transaction.type.capitalize()} ${transaction.amount} ${transaction.token}"
        }
        addToOutput("  $typeStr at ${transaction.timestamp}", Color.White)
    }
}

// Command History Item
data class CommandHistoryItem(
    val text: String,
    val color: Color
)

// Command Status
enum class CommandStatus {
    IDLE,
    PROCESSING,
    SUCCESS,
    ERROR
}

// Extension function to capitalize first letter
fun String.capitalize(): String {
    return this.replaceFirstChar { if (it.isLowerCase()) it.titlecase() else it.toString() }
}
