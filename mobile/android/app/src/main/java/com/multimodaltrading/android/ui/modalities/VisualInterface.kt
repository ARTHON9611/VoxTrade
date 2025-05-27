package com.multimodaltrading.android.ui.modalities

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.multimodaltrading.android.ui.components.ChartView
import com.multimodaltrading.android.ui.components.OrderBookView
import com.multimodaltrading.android.ui.components.SwapFormView
import com.multimodaltrading.android.ui.components.WalletView
import com.multimodaltrading.android.viewmodels.TradingViewModel

@Composable
fun VisualInterface(
    tradingViewModel: TradingViewModel
) {
    val scrollState = rememberScrollState()
    var selectedSymbol by remember { mutableStateOf("SOL/USDC") }
    var timeframe by remember { mutableStateOf("1h") }
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
            .padding(16.dp)
    ) {
        // Market Overview
        MarketOverview(
            selectedSymbol = selectedSymbol,
            onSymbolSelected = { selectedSymbol = it }
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        // Main Content
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Left Column - Chart and Market Data
            Column(
                modifier = Modifier.weight(2f),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Chart
                ChartView(
                    symbol = selectedSymbol,
                    timeframe = timeframe,
                    onTimeframeChange = { timeframe = it }
                )
                
                // Order Book and Recent Trades
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    // Order Book
                    OrderBookView(
                        symbol = selectedSymbol,
                        modifier = Modifier.weight(1f)
                    )
                    
                    // Recent Trades
                    RecentTradesView(
                        tradingViewModel = tradingViewModel,
                        modifier = Modifier.weight(1f)
                    )
                }
            }
            
            // Right Column - Trading Form and Wallet
            Column(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                SwapFormView(tradingViewModel = tradingViewModel)
                
                WalletView(tradingViewModel = tradingViewModel)
            }
        }
    }
}

@Composable
fun MarketOverview(
    selectedSymbol: String,
    onSymbolSelected: (String) -> Unit
) {
    val markets = listOf(
        MarketItem("SOL/USDC", "103.42", "+2.5%", "1.2M", true),
        MarketItem("BTC/USDC", "62,145.78", "-0.8%", "5.7M", false),
        MarketItem("ETH/USDC", "3,421.56", "+1.2%", "3.4M", true)
    )
    
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        markets.forEach { market ->
            MarketCard(
                market = market,
                isSelected = market.symbol == selectedSymbol,
                onClick = { onSymbolSelected(market.symbol) }
            )
        }
    }
}

@Composable
fun MarketCard(
    market: MarketItem,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .width(200.dp)
            .padding(4.dp),
        onClick = onClick,
        colors = CardDefaults.cardColors(
            containerColor = if (isSelected) MaterialTheme.colorScheme.surfaceVariant else MaterialTheme.colorScheme.surface
        )
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = market.symbol,
                    style = MaterialTheme.typography.titleMedium
                )
                
                Surface(
                    color = if (market.isPositive) MaterialTheme.colorScheme.primaryContainer else MaterialTheme.colorScheme.errorContainer,
                    shape = MaterialTheme.shapes.small
                ) {
                    Text(
                        text = market.change,
                        style = MaterialTheme.typography.labelSmall,
                        color = if (market.isPositive) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.error,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                    )
                }
            }
            
            Text(
                text = "$${market.price}",
                style = MaterialTheme.typography.headlineSmall,
                modifier = Modifier.padding(vertical = 8.dp)
            )
            
            Text(
                text = "Vol: $${market.volume}",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

@Composable
fun RecentTradesView(
    tradingViewModel: TradingViewModel,
    modifier: Modifier = Modifier
) {
    val recentTrades by tradingViewModel.recentTrades.collectAsState()
    
    Card(
        modifier = modifier
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = "Recent Trades",
                style = MaterialTheme.typography.titleMedium,
                modifier = Modifier.padding(bottom = 8.dp)
            )
            
            recentTrades.forEach { trade ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(
                        text = if (trade.type == "buy") "Buy" else "Sell",
                        color = if (trade.type == "buy") MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.error,
                        style = MaterialTheme.typography.bodySmall
                    )
                    
                    Text(
                        text = trade.price,
                        style = MaterialTheme.typography.bodySmall
                    )
                    
                    Text(
                        text = trade.amount,
                        style = MaterialTheme.typography.bodySmall
                    )
                    
                    Text(
                        text = trade.timeAgo,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                
                Divider(modifier = Modifier.padding(vertical = 4.dp))
            }
        }
    }
}

data class MarketItem(
    val symbol: String,
    val price: String,
    val change: String,
    val volume: String,
    val isPositive: Boolean
)
