package com.multimodaltrading.android.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.multimodaltrading.android.models.ModalityType
import com.multimodaltrading.android.ui.modalities.TextInterface
import com.multimodaltrading.android.ui.modalities.VisualInterface
import com.multimodaltrading.android.ui.modalities.VoiceInterface
import com.multimodaltrading.android.viewmodels.AuthViewModel
import com.multimodaltrading.android.viewmodels.ModalityViewModel
import com.multimodaltrading.android.viewmodels.TradingViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TradingDashboardScreen(
    tradingViewModel: TradingViewModel,
    modalityViewModel: ModalityViewModel,
    authViewModel: AuthViewModel,
    onLogout: () -> Unit
) {
    val currentModality by modalityViewModel.currentModality.collectAsState()
    
    // Load data when screen appears
    LaunchedEffect(Unit) {
        modalityViewModel.detectPreferredModality()
        tradingViewModel.loadBalances()
        tradingViewModel.loadOrderHistory()
    }
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Multimodal Trading Interface") },
                actions = {
                    Button(
                        onClick = {
                            if (authViewModel.isAuthenticated.value) {
                                authViewModel.disconnect()
                                onLogout()
                            }
                        }
                    ) {
                        Text(if (authViewModel.isAuthenticated.value) "Disconnect" else "Connect")
                    }
                }
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            // Modality Selector
            ModalitySelector(
                currentModality = currentModality,
                onModalitySelected = { modalityViewModel.switchModality(it) }
            )
            
            // Main Content based on selected modality
            Box(modifier = Modifier.weight(1f)) {
                when (currentModality) {
                    ModalityType.VISUAL -> VisualInterface(tradingViewModel = tradingViewModel)
                    ModalityType.VOICE -> VoiceInterface(tradingViewModel = tradingViewModel)
                    ModalityType.TEXT -> TextInterface(tradingViewModel = tradingViewModel)
                }
            }
        }
    }
}

@Composable
fun ModalitySelector(
    currentModality: ModalityType,
    onModalitySelected: (ModalityType) -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(8.dp),
        horizontalArrangement = Arrangement.SpaceEvenly
    ) {
        ModalityButton(
            text = "Visual",
            selected = currentModality == ModalityType.VISUAL,
            onClick = { onModalitySelected(ModalityType.VISUAL) }
        )
        
        ModalityButton(
            text = "Voice",
            selected = currentModality == ModalityType.VOICE,
            onClick = { onModalitySelected(ModalityType.VOICE) }
        )
        
        ModalityButton(
            text = "Text",
            selected = currentModality == ModalityType.TEXT,
            onClick = { onModalitySelected(ModalityType.TEXT) }
        )
    }
}

@Composable
fun ModalityButton(
    text: String,
    selected: Boolean,
    onClick: () -> Unit
) {
    Button(
        onClick = onClick,
        colors = ButtonDefaults.buttonColors(
            containerColor = if (selected) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surfaceVariant,
            contentColor = if (selected) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurfaceVariant
        )
    ) {
        Text(text)
    }
}
