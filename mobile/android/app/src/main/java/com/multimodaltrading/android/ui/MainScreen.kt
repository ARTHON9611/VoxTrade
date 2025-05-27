package com.multimodaltrading.android.ui

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.multimodaltrading.android.ui.screens.LoginScreen
import com.multimodaltrading.android.ui.screens.TradingDashboardScreen
import com.multimodaltrading.android.viewmodels.AuthViewModel
import com.multimodaltrading.android.viewmodels.ModalityViewModel
import com.multimodaltrading.android.viewmodels.TradingViewModel

@Composable
fun MainScreen(
    authViewModel: AuthViewModel,
    tradingViewModel: TradingViewModel,
    modalityViewModel: ModalityViewModel
) {
    val navController = rememberNavController()
    val isAuthenticated by authViewModel.isAuthenticated.collectAsState()
    
    // Check authentication status on launch
    LaunchedEffect(Unit) {
        authViewModel.checkAuth()
    }
    
    NavHost(
        navController = navController,
        startDestination = if (isAuthenticated) "dashboard" else "login"
    ) {
        composable("login") {
            LoginScreen(
                authViewModel = authViewModel,
                onLoginSuccess = {
                    navController.navigate("dashboard") {
                        popUpTo("login") { inclusive = true }
                    }
                }
            )
        }
        
        composable("dashboard") {
            TradingDashboardScreen(
                tradingViewModel = tradingViewModel,
                modalityViewModel = modalityViewModel,
                authViewModel = authViewModel,
                onLogout = {
                    navController.navigate("login") {
                        popUpTo("dashboard") { inclusive = true }
                    }
                }
            )
        }
    }
}
