package com.multimodaltrading.android.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.multimodaltrading.android.viewmodels.TradingViewModel

@Composable
fun OrderBookView(
    symbol: String,
    modifier: Modifier = Modifier
) {
    var bids by remember { mutableStateOf<List<OrderBookEntry>>(emptyList()) }
    var asks by remember { mutableStateOf<List<OrderBookEntry>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    
    // Load order book data when symbol changes
    LaunchedEffect(symbol) {
        isLoading = true
        val orderBookData = loadOrderBook(symbol)
        bids = orderBookData.first
        asks = orderBookData.second
        isLoading = false
    }
    
    Card(
        modifier = modifier
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = "Order Book",
                style = MaterialTheme.typography.titleMedium,
                modifier = Modifier.padding(bottom = 8.dp)
            )
            
            if (isLoading) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(100.dp),
                    contentAlignment = androidx.compose.ui.Alignment.Center
                ) {
                    CircularProgressIndicator()
                }
            } else {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    // Bids (Buy Orders)
                    Column(
                        modifier = Modifier.weight(1f)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                text = "Price",
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            
                            Text(
                                text = "Amount",
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                        
                        Spacer(modifier = Modifier.height(8.dp))
                        
                        bids.forEach { bid ->
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(
                                    text = bid.price,
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.primary
                                )
                                
                                Text(
                                    text = bid.amount,
                                    style = MaterialTheme.typography.bodySmall
                                )
                            }
                            
                            Spacer(modifier = Modifier.height(4.dp))
                        }
                    }
                    
                    // Asks (Sell Orders)
                    Column(
                        modifier = Modifier.weight(1f)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                text = "Price",
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            
                            Text(
                                text = "Amount",
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                        
                        Spacer(modifier = Modifier.height(8.dp))
                        
                        asks.forEach { ask ->
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text(
                                    text = ask.price,
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.error
                                )
                                
                                Text(
                                    text = ask.amount,
                                    style = MaterialTheme.typography.bodySmall
                                )
                            }
                            
                            Spacer(modifier = Modifier.height(4.dp))
                        }
                    }
                }
            }
        }
    }
}

// Load order book data
private fun loadOrderBook(symbol: String): Pair<List<OrderBookEntry>, List<OrderBookEntry>> {
    // In a real implementation, this would call the API
    // For demo purposes, we'll generate mock data
    
    val basePrice = when (symbol) {
        "SOL/USDC" -> 103.42
        "BTC/USDC" -> 62145.78
        "ETH/USDC" -> 3421.56
        else -> 100.0
    }
    
    val bids = List(5) { i ->
        val price = basePrice - (i * 0.02) - (Math.random() * 0.01)
        val amount = 0.5 + (Math.random() * 9.5)
        OrderBookEntry(
            price = String.format("%.2f", price),
            amount = String.format("%.2f", amount)
        )
    }.sortedByDescending { it.price.toDouble() }
    
    val asks = List(5) { i ->
        val price = basePrice + (i * 0.02) + (Math.random() * 0.01)
        val amount = 0.5 + (Math.random() * 9.5)
        OrderBookEntry(
            price = String.format("%.2f", price),
            amount = String.format("%.2f", amount)
        )
    }.sortedBy { it.price.toDouble() }
    
    return Pair(bids, asks)
}

// Order Book Entry data class
data class OrderBookEntry(
    val price: String,
    val amount: String
)
