// Android implementation for the Multimodal Trading Interface

package com.multimodaltrading.android

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.lifecycle.ViewModelProvider
import com.multimodaltrading.android.ui.MainScreen
import com.multimodaltrading.android.ui.theme.MultimodalTradingTheme
import com.multimodaltrading.android.viewmodels.AuthViewModel
import com.multimodaltrading.android.viewmodels.ModalityViewModel
import com.multimodaltrading.android.viewmodels.TradingViewModel

class MainActivity : ComponentActivity() {
    // View models
    private lateinit var authViewModel: AuthViewModel
    private lateinit var tradingViewModel: TradingViewModel
    private lateinit var modalityViewModel: ModalityViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Initialize view models
        authViewModel = ViewModelProvider(this)[AuthViewModel::class.java]
        tradingViewModel = ViewModelProvider(this)[TradingViewModel::class.java]
        modalityViewModel = ViewModelProvider(this)[ModalityViewModel::class.java]
        
        setContent {
            MultimodalTradingTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    MainScreen(
                        authViewModel = authViewModel,
                        tradingViewModel = tradingViewModel,
                        modalityViewModel = modalityViewModel
                    )
                }
            }
        }
    }
}
