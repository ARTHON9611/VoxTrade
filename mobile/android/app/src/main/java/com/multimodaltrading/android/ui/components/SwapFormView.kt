package com.multimodaltrading.android.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.multimodaltrading.android.viewmodels.TradingViewModel

@Composable
fun SwapFormView(
    tradingViewModel: TradingViewModel,
    modifier: Modifier = Modifier
) {
    var fromToken by remember { mutableStateOf("SOL") }
    var toToken by remember { mutableStateOf("USDC") }
    var amount by remember { mutableStateOf("") }
    var slippage by remember { mutableStateOf("0.5") }
    var isLoading by remember { mutableStateOf(false) }
    var quote by remember { mutableStateOf<SwapQuote?>(null) }
    var error by remember { mutableStateOf<String?>(null) }
    
    // Available tokens
    val tokens = listOf("SOL", "USDC", "USDT")
    
    // Slippage options
    val slippageOptions = listOf("0.1", "0.5", "1.0", "2.0")
    
    // Get quote when inputs change
    LaunchedEffect(fromToken, toToken, amount, slippage) {
        if (amount.isNotEmpty() && amount.toDoubleOrNull() != null && amount.toDouble() > 0) {
            getQuote(fromToken, toToken, amount, slippage) { newQuote ->
                quote = newQuote
            }
        } else {
            quote = null
        }
    }
    
    Card(
        modifier = modifier
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = "Swap",
                style = MaterialTheme.typography.titleMedium,
                modifier = Modifier.padding(bottom = 16.dp)
            )
            
            // From Token
            Column(
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = "From",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                
                Spacer(modifier = Modifier.height(8.dp))
                
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    color = MaterialTheme.colorScheme.surfaceVariant,
                    shape = MaterialTheme.shapes.medium
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        OutlinedTextField(
                            value = amount,
                            onValueChange = { amount = it },
                            modifier = Modifier.weight(1f),
                            placeholder = { Text("0.0") },
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                            singleLine = true
                        )
                        
                        Spacer(modifier = Modifier.width(8.dp))
                        
                        // Token Selector
                        var expanded by remember { mutableStateOf(false) }
                        
                        Box {
                            Button(
                                onClick = { expanded = true }
                            ) {
                                Text(fromToken)
                            }
                            
                            DropdownMenu(
                                expanded = expanded,
                                onDismissRequest = { expanded = false }
                            ) {
                                tokens.forEach { token ->
                                    if (token != toToken) {
                                        DropdownMenuItem(
                                            text = { Text(token) },
                                            onClick = {
                                                fromToken = token
                                                expanded = false
                                            }
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Swap Button
            Button(
                onClick = {
                    val temp = fromToken
                    fromToken = toToken
                    toToken = temp
                    amount = ""
                    quote = null
                },
                modifier = Modifier.align(Alignment.CenterHorizontally)
            ) {
                Text("↑↓")
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // To Token
            Column(
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = "To",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                
                Spacer(modifier = Modifier.height(8.dp))
                
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    color = MaterialTheme.colorScheme.surfaceVariant,
                    shape = MaterialTheme.shapes.medium
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = quote?.toAmount ?: "0.0",
                            style = MaterialTheme.typography.bodyLarge,
                            modifier = Modifier.weight(1f)
                        )
                        
                        Spacer(modifier = Modifier.width(8.dp))
                        
                        // Token Selector
                        var expanded by remember { mutableStateOf(false) }
                        
                        Box {
                            Button(
                                onClick = { expanded = true }
                            ) {
                                Text(toToken)
                            }
                            
                            DropdownMenu(
                                expanded = expanded,
                                onDismissRequest = { expanded = false }
                            ) {
                                tokens.forEach { token ->
                                    if (token != fromToken) {
                                        DropdownMenuItem(
                                            text = { Text(token) },
                                            onClick = {
                                                toToken = token
                                                expanded = false
                                            }
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Slippage Tolerance
            Column(
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = "Slippage Tolerance",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                
                Spacer(modifier = Modifier.height(8.dp))
                
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    slippageOptions.forEach { option ->
                        Button(
                            onClick = { slippage = option },
                            colors = ButtonDefaults.buttonColors(
                                containerColor = if (slippage == option) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surfaceVariant,
                                contentColor = if (slippage == option) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        ) {
                            Text("${option}%")
                        }
                    }
                }
            }
            
            // Quote Details
            if (quote != null && amount.isNotEmpty()) {
                Spacer(modifier = Modifier.height(16.dp))
                
                Surface(
                    modifier = Modifier.fillMaxWidth(),
                    color = MaterialTheme.colorScheme.surfaceVariant,
                    shape = MaterialTheme.shapes.medium
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                text = "Rate",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            
                            Text(
                                text = "1 ${quote!!.fromToken} = ${quote!!.rate} ${quote!!.toToken}",
                                style = MaterialTheme.typography.bodySmall
                            )
                        }
                        
                        Spacer(modifier = Modifier.height(8.dp))
                        
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                text = "Fee",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            
                            Text(
                                text = quote!!.fee,
                                style = MaterialTheme.typography.bodySmall
                            )
                        }
                        
                        Spacer(modifier = Modifier.height(8.dp))
                        
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                text = "Min. Received",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            
                            Text(
                                text = "${quote!!.minAmount} ${quote!!.toToken}",
                                style = MaterialTheme.typography.bodySmall
                            )
                        }
                    }
                }
            }
            
            // Error Message
            if (error != null) {
                Spacer(modifier = Modifier.height(8.dp))
                
                Text(
                    text = error ?: "",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.error
                )
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Swap Button
            Button(
                onClick = {
                    executeSwap(tradingViewModel, fromToken, toToken, amount, slippage)
                },
                modifier = Modifier.fillMaxWidth(),
                enabled = canSwap(amount, isLoading)
            ) {
                if (isLoading) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(24.dp),
                        color = MaterialTheme.colorScheme.onPrimary
                    )
                } else {
                    Text("Swap")
                }
            }
        }
    }
}

// Get quote for swap
private fun getQuote(
    fromToken: String,
    toToken: String,
    amount: String,
    slippage: String,
    onQuoteReceived: (SwapQuote) -> Unit
) {
    // In a real implementation, this would call the API
    // For demo purposes, we'll generate mock data
    
    val rate = when {
        fromToken == "SOL" && toToken == "USDC" -> 103.42
        fromToken == "USDC" && toToken == "SOL" -> 1.0 / 103.42
        fromToken == "SOL" && toToken == "USDT" -> 103.38
        fromToken == "USDT" && toToken == "SOL" -> 1.0 / 103.38
        fromToken == "USDC" && toToken == "USDT" -> 0.9996
        fromToken == "USDT" && toToken == "USDC" -> 1.0004
        else -> 1.0
    }
    
    val fromAmount = amount.toDoubleOrNull() ?: 0.0
    val toAmount = fromAmount * rate
    val slippageValue = slippage.toDoubleOrNull() ?: 0.5
    val minAmount = toAmount * (1.0 - slippageValue / 100.0)
    
    val quote = SwapQuote(
        fromToken = fromToken,
        toToken = toToken,
        fromAmount = amount,
        toAmount = String.format("%.6f", toAmount),
        minAmount = String.format("%.6f", minAmount),
        rate = String.format("%.6f", rate),
        slippage = slippage,
        fee = "0.3%",
        expiresAt = System.currentTimeMillis() + 30000
    )
    
    onQuoteReceived(quote)
}

// Execute swap
private fun executeSwap(
    tradingViewModel: TradingViewModel,
    fromToken: String,
    toToken: String,
    amount: String,
    slippage: String
) {
    // In a real implementation, this would call the API
    // For demo purposes, we'll just simulate a successful swap
    tradingViewModel.executeSwap(amount, fromToken, toToken)
}

// Can swap if amount is valid and not loading
private fun canSwap(amount: String, isLoading: Boolean): Boolean {
    val amountValue = amount.toDoubleOrNull()
    return !isLoading && amountValue != null && amountValue > 0
}

// Swap Quote data class
data class SwapQuote(
    val fromToken: String,
    val toToken: String,
    val fromAmount: String,
    val toAmount: String,
    val minAmount: String,
    val rate: String,
    val slippage: String,
    val fee: String,
    val expiresAt: Long
)
