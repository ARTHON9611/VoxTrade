package com.multimodaltrading.android.viewmodels

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class AuthViewModel : ViewModel() {
    // State flows
    private val _isAuthenticated = MutableStateFlow(false)
    val isAuthenticated: StateFlow<Boolean> = _isAuthenticated.asStateFlow()
    
    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()
    
    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error.asStateFlow()
    
    private val _user = MutableStateFlow<com.multimodaltrading.android.models.User?>(null)
    val user: StateFlow<com.multimodaltrading.android.models.User?> = _user.asStateFlow()
    
    // Check authentication status
    fun checkAuth() {
        // In a real implementation, this would check for stored credentials
        // For demo purposes, we'll just return false
        _isAuthenticated.value = false
    }
    
    // Login with email and password
    fun login(email: String, password: String) {
        _isLoading.value = true
        _error.value = null
        
        // In a real implementation, this would call the API
        // For demo purposes, we'll simulate a successful login
        
        // Simulate network delay
        android.os.Handler(android.os.Looper.getMainLooper()).postDelayed({
            _isLoading.value = false
            
            if (email.isNotEmpty() && password.isNotEmpty()) {
                _isAuthenticated.value = true
                _user.value = com.multimodaltrading.android.models.User(
                    id = "1",
                    email = email,
                    name = "Demo User"
                )
            } else {
                _error.value = "Invalid email or password"
            }
        }, 1000)
    }
    
    // Connect wallet
    fun connectWallet(walletType: String) {
        _isLoading.value = true
        _error.value = null
        
        // In a real implementation, this would connect to the wallet
        // For demo purposes, we'll simulate a successful connection
        
        // Simulate network delay
        android.os.Handler(android.os.Looper.getMainLooper()).postDelayed({
            _isLoading.value = false
            _isAuthenticated.value = true
            _user.value = com.multimodaltrading.android.models.User(
                id = "wallet_${walletType}_1",
                email = null,
                name = "${walletType.capitalize()} User"
            )
        }, 1000)
    }
    
    // Demo login
    fun demoLogin() {
        _isLoading.value = true
        _error.value = null
        
        // Simulate network delay
        android.os.Handler(android.os.Looper.getMainLooper()).postDelayed({
            _isLoading.value = false
            _isAuthenticated.value = true
            _user.value = com.multimodaltrading.android.models.User(
                id = "demo_1",
                email = "demo@example.com",
                name = "Demo User"
            )
        }, 500)
    }
    
    // Connect (general method)
    fun connect() {
        // In a real implementation, this would show wallet options
        // For demo purposes, we'll just use the demo login
        demoLogin()
    }
    
    // Disconnect
    fun disconnect() {
        _isAuthenticated.value = false
        _user.value = null
    }
    
    // Extension function to capitalize first letter
    private fun String.capitalize(): String {
        return this.replaceFirstChar { if (it.isLowerCase()) it.titlecase() else it.toString() }
    }
}
