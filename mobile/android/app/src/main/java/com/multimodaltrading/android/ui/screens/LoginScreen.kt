package com.multimodaltrading.android.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import com.multimodaltrading.android.viewmodels.AuthViewModel

@Composable
fun LoginScreen(
    authViewModel: AuthViewModel,
    onLoginSuccess: () -> Unit
) {
    val isLoading by authViewModel.isLoading.collectAsState()
    val error by authViewModel.error.collectAsState()
    val isAuthenticated by authViewModel.isAuthenticated.collectAsState()
    
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var showWalletOptions by remember { mutableStateOf(false) }
    
    // Check if user is authenticated
    LaunchedEffect(isAuthenticated) {
        if (isAuthenticated) {
            onLoginSuccess()
        }
    }
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Logo and Header
        Spacer(modifier = Modifier.height(48.dp))
        
        Icon(
            imageVector = androidx.compose.material.icons.Icons.Filled.Analytics,
            contentDescription = "Logo",
            modifier = Modifier.size(64.dp),
            tint = MaterialTheme.colorScheme.primary
        )
        
        Text(
            text = "Multimodal Trading Interface",
            style = MaterialTheme.typography.headlineMedium
        )
        
        Text(
            text = "The first multimodal platform for trading on Solana",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        
        Spacer(modifier = Modifier.height(32.dp))
        
        // Connect Wallet Button
        Button(
            onClick = { showWalletOptions = true },
            modifier = Modifier.fillMaxWidth()
        ) {
            Icon(
                imageVector = androidx.compose.material.icons.Icons.Filled.AccountBalanceWallet,
                contentDescription = "Wallet",
                modifier = Modifier.size(24.dp)
            )
            Spacer(modifier = Modifier.width(8.dp))
            Text("Connect Wallet")
        }
        
        // Or Divider
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Divider(modifier = Modifier.weight(1f))
            Text(
                text = "or",
                modifier = Modifier.padding(horizontal = 16.dp),
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Divider(modifier = Modifier.weight(1f))
        }
        
        // Email Login Form
        OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            label = { Text("Email") },
            modifier = Modifier.fillMaxWidth(),
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email)
        )
        
        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            label = { Text("Password") },
            modifier = Modifier.fillMaxWidth(),
            visualTransformation = PasswordVisualTransformation(),
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password)
        )
        
        Button(
            onClick = { authViewModel.login(email, password) },
            modifier = Modifier.fillMaxWidth(),
            enabled = !isLoading && email.isNotEmpty() && password.isNotEmpty()
        ) {
            if (isLoading) {
                CircularProgressIndicator(
                    modifier = Modifier.size(24.dp),
                    color = MaterialTheme.colorScheme.onPrimary
                )
            } else {
                Text("Sign In")
            }
        }
        
        // Error Message
        if (error != null) {
            Text(
                text = error ?: "",
                color = MaterialTheme.colorScheme.error,
                style = MaterialTheme.typography.bodySmall
            )
        }
        
        Spacer(modifier = Modifier.weight(1f))
        
        // Demo Mode
        TextButton(
            onClick = { authViewModel.demoLogin() }
        ) {
            Text("Try Demo Mode")
        }
        
        Text(
            text = "By continuing, you agree to our Terms of Service and Privacy Policy",
            style = MaterialTheme.typography.bodySmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
    
    // Wallet Options Dialog
    if (showWalletOptions) {
        AlertDialog(
            onDismissRequest = { showWalletOptions = false },
            title = { Text("Connect Wallet") },
            text = {
                Column {
                    Text("Choose a wallet to connect")
                    Spacer(modifier = Modifier.height(16.dp))
                    
                    Button(
                        onClick = {
                            authViewModel.connectWallet("phantom")
                            showWalletOptions = false
                        },
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("Phantom")
                    }
                    
                    Button(
                        onClick = {
                            authViewModel.connectWallet("solflare")
                            showWalletOptions = false
                        },
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("Solflare")
                    }
                    
                    Button(
                        onClick = {
                            authViewModel.connectWallet("backpack")
                            showWalletOptions = false
                        },
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("Backpack")
                    }
                }
            },
            confirmButton = {
                TextButton(
                    onClick = { showWalletOptions = false }
                ) {
                    Text("Cancel")
                }
            }
        )
    }
}
