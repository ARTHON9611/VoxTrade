package com.multimodaltrading.android.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.multimodaltrading.android.viewmodels.TradingViewModel

@Composable
fun ChartView(
    symbol: String,
    timeframe: String,
    onTimeframeChange: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    var chartData by remember { mutableStateOf<List<CandleStick>>(emptyList()) }
    
    // Load chart data when symbol or timeframe changes
    LaunchedEffect(symbol, timeframe) {
        chartData = generateMockChartData(symbol, timeframe)
    }
    
    Card(
        modifier = modifier
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            // Chart Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    Text(
                        text = symbol,
                        style = MaterialTheme.typography.titleMedium
                    )
                    
                    Row(
                        verticalAlignment = androidx.compose.ui.Alignment.CenterVertically
                    ) {
                        Text(
                            text = "$103.42",
                            style = MaterialTheme.typography.headlineSmall
                        )
                        
                        Spacer(modifier = Modifier.width(8.dp))
                        
                        Surface(
                            color = MaterialTheme.colorScheme.primaryContainer,
                            shape = MaterialTheme.shapes.small
                        ) {
                            Text(
                                text = "+2.5%",
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.primary,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                            )
                        }
                    }
                }
                
                // Timeframe Selector
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    TimeframeButton("1H", "1h", timeframe, onTimeframeChange)
                    TimeframeButton("1D", "1d", timeframe, onTimeframeChange)
                    TimeframeButton("1W", "1w", timeframe, onTimeframeChange)
                    TimeframeButton("1M", "1m", timeframe, onTimeframeChange)
                }
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Chart
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp)
            ) {
                // In a real implementation, this would use a charting library
                // For demo purposes, we'll just show a placeholder
                Text(
                    text = "Chart visualization for $symbol ($timeframe)",
                    modifier = Modifier.align(androidx.compose.ui.Alignment.Center)
                )
            }
        }
    }
}

@Composable
fun TimeframeButton(
    label: String,
    value: String,
    selectedTimeframe: String,
    onTimeframeChange: (String) -> Unit
) {
    val isSelected = selectedTimeframe == value
    
    Button(
        onClick = { onTimeframeChange(value) },
        colors = ButtonDefaults.buttonColors(
            containerColor = if (isSelected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surfaceVariant,
            contentColor = if (isSelected) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurfaceVariant
        ),
        modifier = Modifier.height(36.dp),
        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp)
    ) {
        Text(label, style = MaterialTheme.typography.labelMedium)
    }
}

// Generate mock chart data
private fun generateMockChartData(symbol: String, timeframe: String): List<CandleStick> {
    val basePrice = when (symbol) {
        "SOL/USDC" -> 103.42
        "BTC/USDC" -> 62145.78
        "ETH/USDC" -> 3421.56
        else -> 100.0
    }
    
    val volatility = when (timeframe) {
        "1h" -> 0.5
        "1d" -> 1.0
        "1w" -> 2.0
        "1m" -> 3.0
        else -> 0.5
    }
    
    val count = when (timeframe) {
        "1h" -> 30
        "1d" -> 48
        "1w" -> 42
        "1m" -> 30
        else -> 30
    }
    
    return List(count) { i ->
        val randomFactor = (-volatility..volatility).random()
        val trendFactor = i * 0.02
        val sineWave = kotlin.math.sin(i.toDouble() / (count / 3)) * (volatility / 2)
        
        val open = basePrice + randomFactor + trendFactor + sineWave
        val close = open + (-volatility/2..volatility/2).random()
        val high = maxOf(open, close) + (0.0..volatility/4).random()
        val low = minOf(open, close) - (0.0..volatility/4).random()
        
        CandleStick(
            timestamp = System.currentTimeMillis() - (count - i) * 60000,
            open = open,
            high = high,
            low = low,
            close = close
        )
    }
}

// Helper extension for random doubles
private fun ClosedRange<Double>.random() =
    kotlin.random.Random.nextDouble(start, endInclusive)

// Candlestick data class
data class CandleStick(
    val timestamp: Long,
    val open: Double,
    val high: Double,
    val low: Double,
    val close: Double
)
