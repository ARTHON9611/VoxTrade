package com.multimodaltrading.android.viewmodels

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import com.multimodaltrading.android.models.Transaction
import com.multimodaltrading.android.models.Trade
import com.multimodaltrading.android.models.TradingResult

class TradingViewModel : ViewModel() {
    // State flows
    private val _balances = MutableStateFlow<Map<String, String>>(emptyMap())
    val balances: StateFlow<Map<String, String>> = _balances.asStateFlow()
    
    private val _orderHistory = MutableStateFlow<List<Transaction>>(emptyList())
    val orderHistory: StateFlow<List<Transaction>> = _orderHistory.asStateFlow()
    
    private val _recentTrades = MutableStateFlow<List<Trade>>(emptyList())
    val recentTrades: StateFlow<List<Trade>> = _recentTrades.asStateFlow()
    
    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()
    
    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error.asStateFlow()
    
    init {
        // Initialize with mock data
        setupMockData()
    }
    
    // MARK: - Data Loading
    
    fun loadBalances() {
        _isLoading.value = true
        _error.value = null
        
        // In a real implementation, this would call the API
        // For demo purposes, we'll use mock data
        
        // Simulate network delay
        android.os.Handler(android.os.Looper.getMainLooper()).postDelayed({
            _isLoading.value = false
            // Mock data already set in init
        }, 500)
    }
    
    fun loadOrderHistory() {
        _isLoading.value = true
        _error.value = null
        
        // In a real implementation, this would call the API
        // For demo purposes, we'll use mock data
        
        // Simulate network delay
        android.os.Handler(android.os.Looper.getMainLooper()).postDelayed({
            _isLoading.value = false
            // Mock data already set in init
        }, 500)
    }
    
    // MARK: - Trading Operations
    
    fun executeBuy(amount: String, token: String): TradingResult {
        // In a real implementation, this would call the API
        // For demo purposes, we'll simulate a successful trade
        
        // Add to order history
        val transaction = Transaction(
            id = java.util.UUID.randomUUID().toString(),
            type = "buy",
            token = token,
            amount = amount,
            toToken = null,
            toAmount = null,
            timestamp = formatDate(java.util.Date())
        )
        
        val currentHistory = _orderHistory.value.toMutableList()
        currentHistory.add(0, transaction)
        _orderHistory.value = currentHistory
        
        // Update balances
        val amountValue = amount.toDoubleOrNull() ?: 0.0
        val currentBalances = _balances.value.toMutableMap()
        
        val currentBalance = currentBalances[token]?.toDoubleOrNull() ?: 0.0
        currentBalances[token] = String.format("%.6f", currentBalance + amountValue)
        
        // If buying with USDC, deduct USDC
        val price = getPrice(token).toDoubleOrNull() ?: 0.0
        val usdcAmount = amountValue * price
        val currentUSDC = currentBalances["USDC"]?.toDoubleOrNull() ?: 0.0
        currentBalances["USDC"] = String.format("%.6f", currentUSDC - usdcAmount)
        
        _balances.value = currentBalances
        
        return TradingResult(success = true, error = null)
    }
    
    fun executeSell(amount: String, token: String): TradingResult {
        // In a real implementation, this would call the API
        // For demo purposes, we'll simulate a successful trade
        
        // Add to order history
        val transaction = Transaction(
            id = java.util.UUID.randomUUID().toString(),
            type = "sell",
            token = token,
            amount = amount,
            toToken = null,
            toAmount = null,
            timestamp = formatDate(java.util.Date())
        )
        
        val currentHistory = _orderHistory.value.toMutableList()
        currentHistory.add(0, transaction)
        _orderHistory.value = currentHistory
        
        // Update balances
        val amountValue = amount.toDoubleOrNull() ?: 0.0
        val currentBalances = _balances.value.toMutableMap()
        
        val currentBalance = currentBalances[token]?.toDoubleOrNull() ?: 0.0
        currentBalances[token] = String.format("%.6f", currentBalance - amountValue)
        
        // If selling for USDC, add USDC
        val price = getPrice(token).toDoubleOrNull() ?: 0.0
        val usdcAmount = amountValue * price
        val currentUSDC = currentBalances["USDC"]?.toDoubleOrNull() ?: 0.0
        currentBalances["USDC"] = String.format("%.6f", currentUSDC + usdcAmount)
        
        _balances.value = currentBalances
        
        return TradingResult(success = true, error = null)
    }
    
    fun executeSwap(amount: String, fromToken: String, toToken: String): TradingResult {
        // In a real implementation, this would call the API
        // For demo purposes, we'll simulate a successful swap
        
        // Calculate to amount
        val fromPrice = getPrice(fromToken).toDoubleOrNull() ?: 0.0
        val toPrice = getPrice(toToken).toDoubleOrNull() ?: 0.0
        val fromAmount = amount.toDoubleOrNull() ?: 0.0
        val toAmount = fromAmount * (fromPrice / toPrice)
        
        // Add to order history
        val transaction = Transaction(
            id = java.util.UUID.randomUUID().toString(),
            type = "swap",
            token = fromToken,
            amount = amount,
            toToken = toToken,
            toAmount = String.format("%.6f", toAmount),
            timestamp = formatDate(java.util.Date())
        )
        
        val currentHistory = _orderHistory.value.toMutableList()
        currentHistory.add(0, transaction)
        _orderHistory.value = currentHistory
        
        // Update balances
        val currentBalances = _balances.value.toMutableMap()
        
        val currentFromBalance = currentBalances[fromToken]?.toDoubleOrNull() ?: 0.0
        currentBalances[fromToken] = String.format("%.6f", currentFromBalance - fromAmount)
        
        val currentToBalance = currentBalances[toToken]?.toDoubleOrNull() ?: 0.0
        currentBalances[toToken] = String.format("%.6f", currentToBalance + toAmount)
        
        _balances.value = currentBalances
        
        return TradingResult(success = true, error = null)
    }
    
    // MARK: - Helper Methods
    
    fun getPrice(token: String): String {
        // In a real implementation, this would call the API
        // For demo purposes, we'll return mock prices
        
        return when (token.uppercase()) {
            "SOL" -> "103.42"
            "BTC" -> "62145.78"
            "ETH" -> "3421.56"
            "USDC" -> "1.00"
            "USDT" -> "1.00"
            else -> "0.00"
        }
    }
    
    fun getBalances(): Map<String, String> {
        return _balances.value
    }
    
    fun getOrderHistory(): List<Transaction> {
        return _orderHistory.value
    }
    
    // MARK: - Mock Data Setup
    
    private fun setupMockData() {
        // Mock balances
        _balances.value = mapOf(
            "SOL" to "2.5",
            "USDC" to "500.00",
            "USDT" to "250.00",
            "BTC" to "0.005",
            "ETH" to "0.1"
        )
        
        // Mock order history
        _orderHistory.value = listOf(
            Transaction(
                id = "1",
                type = "buy",
                token = "SOL",
                amount = "1.0",
                toToken = null,
                toAmount = null,
                timestamp = "2025-05-25 14:30"
            ),
            Transaction(
                id = "2",
                type = "swap",
                token = "USDC",
                amount = "100.0",
                toToken = "SOL",
                toAmount = "0.97",
                timestamp = "2025-05-24 10:15"
            ),
            Transaction(
                id = "3",
                type = "sell",
                token = "ETH",
                amount = "0.05",
                toToken = null,
                toAmount = null,
                timestamp = "2025-05-23 16:45"
            )
        )
        
        // Mock recent trades
        _recentTrades.value = listOf(
            Trade(
                id = "1",
                type = "buy",
                price = "103.42",
                amount = "0.5",
                timeAgo = "2m ago"
            ),
            Trade(
                id = "2",
                type = "sell",
                price = "103.38",
                amount = "1.2",
                timeAgo = "3m ago"
            ),
            Trade(
                id = "3",
                type = "buy",
                price = "103.35",
                amount = "0.8",
                timeAgo = "5m ago"
            ),
            Trade(
                id = "4",
                type = "sell",
                price = "103.30",
                amount = "2.5",
                timeAgo = "7m ago"
            ),
            Trade(
                id = "5",
                type = "buy",
                price = "103.25",
                amount = "1.0",
                timeAgo = "10m ago"
            )
        )
    }
    
    // Format date
    private fun formatDate(date: java.util.Date): String {
        val formatter = java.text.SimpleDateFormat("yyyy-MM-dd HH:mm", java.util.Locale.getDefault())
        return formatter.format(date)
    }
}
