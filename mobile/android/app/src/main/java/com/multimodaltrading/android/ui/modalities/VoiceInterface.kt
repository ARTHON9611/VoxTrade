package com.multimodaltrading.android.ui.modalities

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.Stop
import androidx.compose.ui.graphics.Color
import com.multimodaltrading.android.viewmodels.TradingViewModel

@Composable
fun VoiceInterface(
    tradingViewModel: TradingViewModel
) {
    val scrollState = rememberScrollState()
    var isListening by remember { mutableStateOf(false) }
    var transcript by remember { mutableStateOf("") }
    var status by remember { mutableStateOf(VoiceStatus.IDLE) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Voice Interface Header
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.padding(vertical = 32.dp)
        ) {
            Icon(
                imageVector = Icons.Default.Mic,
                contentDescription = "Voice Icon",
                modifier = Modifier.size(64.dp),
                tint = MaterialTheme.colorScheme.primary
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Text(
                text = "Voice Trading Assistant",
                style = MaterialTheme.typography.headlineMedium
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Text(
                text = "Tap the microphone to start speaking your trading commands",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(horizontal = 32.dp)
            )
        }
        
        // Microphone Button
        Button(
            onClick = {
                if (isListening) {
                    stopListening()
                } else {
                    startListening()
                }
                isListening = !isListening
            },
            modifier = Modifier
                .size(80.dp),
            shape = MaterialTheme.shapes.extraLarge,
            colors = ButtonDefaults.buttonColors(
                containerColor = if (isListening) Color.Red else MaterialTheme.colorScheme.primary
            )
        ) {
            Icon(
                imageVector = if (isListening) Icons.Default.Stop else Icons.Default.Mic,
                contentDescription = if (isListening) "Stop Listening" else "Start Listening",
                modifier = Modifier.size(32.dp)
            )
        }
        
        Spacer(modifier = Modifier.height(24.dp))
        
        // Status and Transcript
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.padding(horizontal = 16.dp)
        ) {
            Text(
                text = getStatusText(status),
                style = MaterialTheme.typography.titleMedium,
                color = getStatusColor(status)
            )
            
            if (transcript.isNotEmpty()) {
                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 16.dp),
                    color = MaterialTheme.colorScheme.surfaceVariant,
                    shape = MaterialTheme.shapes.medium
                ) {
                    Text(
                        text = "\"$transcript\"",
                        style = MaterialTheme.typography.bodyMedium,
                        modifier = Modifier.padding(16.dp)
                    )
                }
            }
            
            if (errorMessage != null) {
                Text(
                    text = errorMessage ?: "",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.error,
                    modifier = Modifier.padding(vertical = 8.dp)
                )
            }
        }
        
        Spacer(modifier = Modifier.height(32.dp))
        
        // Example Commands
        Surface(
            modifier = Modifier.fillMaxWidth(),
            color = MaterialTheme.colorScheme.surfaceVariant,
            shape = MaterialTheme.shapes.medium
        ) {
            Column(
                modifier = Modifier.padding(16.dp)
            ) {
                Text(
                    text = "Example Commands:",
                    style = MaterialTheme.typography.titleMedium,
                    modifier = Modifier.padding(bottom = 8.dp)
                )
                
                CommandExample("Buy 0.5 SOL", "Place a buy order")
                CommandExample("Sell 10 USDC", "Place a sell order")
                CommandExample("Swap 1 SOL to USDC", "Execute a token swap")
                CommandExample("Check price of SOL", "Get current price")
                CommandExample("Check my balance", "View your wallet balance")
            }
        }
    }
}

@Composable
fun CommandExample(
    command: String,
    description: String
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        verticalAlignment = Alignment.Top
    ) {
        Text(
            text = command,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.primary,
            modifier = Modifier.width(150.dp)
        )
        
        Text(
            text = description,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}

// Helper functions
private fun startListening() {
    // In a real implementation, this would use SpeechRecognizer
    // For demo purposes, we'll just simulate listening
}

private fun stopListening() {
    // In a real implementation, this would stop SpeechRecognizer
    // For demo purposes, we'll just simulate stopping
}

private fun getStatusText(status: VoiceStatus): String {
    return when (status) {
        VoiceStatus.IDLE -> "Ready to listen"
        VoiceStatus.LISTENING -> "Listening..."
        VoiceStatus.PROCESSING -> "Processing command..."
        VoiceStatus.ERROR -> "Error"
        VoiceStatus.SUCCESS -> "Command recognized"
    }
}

private fun getStatusColor(status: VoiceStatus): Color {
    return when (status) {
        VoiceStatus.IDLE -> Color.Gray
        VoiceStatus.LISTENING -> Color.Blue
        VoiceStatus.PROCESSING -> Color(0xFFF57C00) // Orange
        VoiceStatus.ERROR -> Color.Red
        VoiceStatus.SUCCESS -> Color.Green
    }
}

enum class VoiceStatus {
    IDLE,
    LISTENING,
    PROCESSING,
    ERROR,
    SUCCESS
}
