package com.multimodaltrading.android.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.multimodaltrading.android.viewmodels.AuthViewModel
import com.multimodaltrading.android.viewmodels.TradingViewModel

@Composable
fun WalletView(
    tradingViewModel: TradingViewModel,
    modifier: Modifier = Modifier,
    authViewModel: AuthViewModel = androidx.lifecycle.viewmodel.compose.viewModel()
) {
    val isAuthenticated by authViewModel.isAuthenticated.collectAsState()
    val balances by tradingViewModel.balances.collectAsState()
    val orderHistory by tradingViewModel.orderHistory.collectAsState()
    
    Card(
        modifier = modifier
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = "Wallet",
                style = MaterialTheme.typography.titleMedium,
                modifier = Modifier.padding(bottom = 16.dp)
            )
            
            if (!isAuthenticated) {
                // Not connected state
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalAlignment = androidx.compose.ui.Alignment.CenterHorizontally
                ) {
                    Icon(
                        imageVector = androidx.compose.material.icons.Icons.Filled.AccountBalanceWallet,
                        contentDescription = "Wallet",
                        modifier = Modifier.size(48.dp),
                        tint = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    
                    Spacer(modifier = Modifier.height(16.dp))
                    
                    Text(
                        text = "Connect your wallet to view your balance and transactions",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(horizontal = 16.dp)
                    )
                    
                    Spacer(modifier = Modifier.height(16.dp))
                    
                    Button(
                        onClick = { authViewModel.connect() }
                    ) {
                        Text("Connect Wallet")
                    }
                }
            } else {
                // Connected state - show balances
                Column(
                    modifier = Modifier.fillMaxWidth()
                ) {
                    // Token balances
                    balances.entries.sortedBy { it.key }.forEach { (token, balance) ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 8.dp),
                            verticalAlignment = androidx.compose.ui.Alignment.CenterVertically
                        ) {
                            // Token icon
                            Surface(
                                modifier = Modifier.size(36.dp),
                                shape = MaterialTheme.shapes.extraLarge,
                                color = getTokenColor(token)
                            ) {
                                Box(
                                    contentAlignment = androidx.compose.ui.Alignment.Center
                                ) {
                                    Text(
                                        text = token.first().toString(),
                                        style = MaterialTheme.typography.titleMedium,
                                        color = MaterialTheme.colorScheme.onPrimary
                                    )
                                }
                            }
                            
                            Spacer(modifier = Modifier.width(16.dp))
                            
                            Text(
                                text = token,
                                style = MaterialTheme.typography.titleMedium
                            )
                            
                            Spacer(modifier = Modifier.weight(1f))
                            
                            Text(
                                text = balance,
                                style = MaterialTheme.typography.titleMedium
                            )
                        }
                    }
                    
                    Divider(modifier = Modifier.padding(vertical = 16.dp))
                    
                    // Recent transactions
                    Text(
                        text = "Recent Transactions",
                        style = MaterialTheme.typography.titleSmall,
                        modifier = Modifier.padding(bottom = 8.dp)
                    )
                    
                    if (orderHistory.isEmpty()) {
                        Text(
                            text = "No recent transactions",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.padding(vertical = 8.dp)
                        )
                    } else {
                        orderHistory.take(5).forEach { transaction ->
                            Column(
                                modifier = Modifier.padding(vertical = 8.dp)
                            ) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text(
                                        text = formatTransactionType(transaction),
                                        style = MaterialTheme.typography.bodyMedium
                                    )
                                    
                                    Text(
                                        text = transaction.timestamp,
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                                
                                Divider(modifier = Modifier.padding(top = 8.dp))
                            }
                        }
                    }
                }
            }
        }
    }
}

// Format transaction type
private fun formatTransactionType(transaction: com.multimodaltrading.android.models.Transaction): String {
    return when {
        transaction.type == "swap" && transaction.toToken != null -> 
            "Swap ${transaction.amount} ${transaction.token} to ${transaction.toAmount} ${transaction.toToken}"
        else -> "${transaction.type.capitalize()} ${transaction.amount} ${transaction.token}"
    }
}

// Get token color
private fun getTokenColor(token: String): androidx.compose.ui.graphics.Color {
    return when (token) {
        "SOL" -> androidx.compose.ui.graphics.Color.Blue
        "USDC" -> androidx.compose.ui.graphics.Color.Green
        "USDT" -> androidx.compose.ui.graphics.Color(0xFF26A17B)
        else -> androidx.compose.ui.graphics.Color.Gray
    }
}

// Extension function to capitalize first letter
private fun String.capitalize(): String {
    return this.replaceFirstChar { if (it.isLowerCase()) it.titlecase() else it.toString() }
}
