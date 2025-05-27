import SwiftUI

struct LoginView: View {
    @EnvironmentObject private var authViewModel: AuthViewModel
    @State private var email: String = ""
    @State private var password: String = ""
    @State private var isShowingWalletOptions: Bool = false
    
    var body: some View {
        VStack(spacing: 24) {
            // Logo and Header
            VStack(spacing: 16) {
                Image(systemName: "chart.line.uptrend.xyaxis.circle.fill")
                    .font(.system(size: 64))
                    .foregroundColor(Color(hex: "4F46E5"))
                
                Text("Multimodal Trading Interface")
                    .font(.title)
                    .fontWeight(.bold)
                
                Text("The first multimodal platform for trading on Solana")
                    .font(.subheadline)
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal)
            }
            .padding(.top, 48)
            .padding(.bottom, 32)
            
            // Connect Wallet Button
            Button(action: {
                isShowingWalletOptions = true
            }) {
                HStack {
                    Image(systemName: "wallet.pass.fill")
                        .font(.headline)
                    
                    Text("Connect Wallet")
                        .font(.headline)
                }
                .frame(maxWidth: .infinity)
                .padding()
                .background(Color(hex: "4F46E5"))
                .foregroundColor(.white)
                .cornerRadius(12)
            }
            .padding(.horizontal, 24)
            
            // Or Divider
            HStack {
                Rectangle()
                    .fill(Color.gray.opacity(0.3))
                    .frame(height: 1)
                
                Text("or")
                    .font(.subheadline)
                    .foregroundColor(.gray)
                    .padding(.horizontal, 16)
                
                Rectangle()
                    .fill(Color.gray.opacity(0.3))
                    .frame(height: 1)
            }
            .padding(.horizontal, 24)
            .padding(.vertical, 8)
            
            // Email Login Form
            VStack(spacing: 16) {
                TextField("Email", text: $email)
                    .padding()
                    .background(Color.gray.opacity(0.1))
                    .cornerRadius(12)
                    .autocapitalization(.none)
                    .keyboardType(.emailAddress)
                
                SecureField("Password", text: $password)
                    .padding()
                    .background(Color.gray.opacity(0.1))
                    .cornerRadius(12)
                
                Button(action: {
                    authViewModel.login(email: email, password: password)
                }) {
                    if authViewModel.isLoading {
                        ProgressView()
                            .progressViewStyle(CircularProgressViewStyle(tint: .white))
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color(hex: "4F46E5").opacity(0.5))
                            .cornerRadius(12)
                    } else {
                        Text("Sign In")
                            .font(.headline)
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(Color(hex: "4F46E5"))
                            .cornerRadius(12)
                    }
                }
                .disabled(authViewModel.isLoading || !isValidInput)
            }
            .padding(.horizontal, 24)
            
            // Error Message
            if let error = authViewModel.error {
                Text(error)
                    .font(.caption)
                    .foregroundColor(.red)
                    .padding(.horizontal, 24)
            }
            
            Spacer()
            
            // Footer
            VStack(spacing: 16) {
                Button(action: {
                    // Demo mode - auto login
                    authViewModel.demoLogin()
                }) {
                    Text("Try Demo Mode")
                        .font(.subheadline)
                        .foregroundColor(Color(hex: "4F46E5"))
                }
                
                Text("By continuing, you agree to our Terms of Service and Privacy Policy")
                    .font(.caption)
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 24)
            }
            .padding(.bottom, 32)
        }
        .sheet(isPresented: $isShowingWalletOptions) {
            walletOptionsView
        }
    }
    
    // Wallet Options View
    private var walletOptionsView: some View {
        VStack(spacing: 24) {
            Text("Connect Wallet")
                .font(.title2)
                .fontWeight(.bold)
                .padding(.top, 24)
            
            Text("Choose a wallet to connect")
                .font(.subheadline)
                .foregroundColor(.gray)
            
            // Wallet Options
            VStack(spacing: 16) {
                walletButton(name: "Phantom", icon: "ghost.fill") {
                    authViewModel.connectWallet(type: "phantom")
                    isShowingWalletOptions = false
                }
                
                walletButton(name: "Solflare", icon: "sun.max.fill") {
                    authViewModel.connectWallet(type: "solflare")
                    isShowingWalletOptions = false
                }
                
                walletButton(name: "Backpack", icon: "bag.fill") {
                    authViewModel.connectWallet(type: "backpack")
                    isShowingWalletOptions = false
                }
            }
            .padding(.horizontal, 24)
            .padding(.vertical, 16)
            
            Spacer()
            
            Button(action: {
                isShowingWalletOptions = false
            }) {
                Text("Cancel")
                    .font(.headline)
                    .foregroundColor(.gray)
                    .padding()
            }
        }
    }
    
    // Wallet Button
    private func walletButton(name: String, icon: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            HStack {
                Image(systemName: icon)
                    .font(.headline)
                    .foregroundColor(Color(hex: "4F46E5"))
                    .frame(width: 24, height: 24)
                
                Text(name)
                    .font(.headline)
                
                Spacer()
                
                Image(systemName: "chevron.right")
                    .font(.caption)
                    .foregroundColor(.gray)
            }
            .padding()
            .background(Color.gray.opacity(0.1))
            .cornerRadius(12)
        }
    }
    
    // Validate input
    private var isValidInput: Bool {
        !email.isEmpty && !password.isEmpty && email.contains("@")
    }
}

struct LoginView_Previews: PreviewProvider {
    static var previews: some View {
        LoginView()
            .environmentObject(AuthViewModel())
    }
}
