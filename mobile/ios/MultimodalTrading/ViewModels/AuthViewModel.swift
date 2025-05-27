import Foundation
import Combine

class AuthViewModel: ObservableObject {
    @Published var isAuthenticated: Bool = false
    @Published var isLoading: Bool = false
    @Published var error: String? = nil
    @Published var user: User? = nil
    
    private var cancellables = Set<AnyCancellable>()
    
    // Login with email and password
    func login(email: String, password: String) {
        isLoading = true
        error = nil
        
        APIService.shared.login(email: email, password: password)
            .sink(receiveCompletion: { [weak self] completion in
                self?.isLoading = false
                
                if case .failure(let error) = completion {
                    self?.error = error.localizedDescription
                }
            }, receiveValue: { [weak self] response in
                self?.handleSuccessfulAuth(response)
            })
            .store(in: &cancellables)
    }
    
    // Connect wallet
    func connectWallet(type: String) {
        isLoading = true
        error = nil
        
        // In a real implementation, this would use a wallet SDK
        // For demo purposes, we'll simulate a successful connection
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) { [weak self] in
            // Generate a random wallet address
            let walletAddress = "sol" + String(UUID().uuidString.prefix(8))
            let signature = UUID().uuidString
            
            // Call API to authenticate with wallet
            APIService.shared.connectWallet(address: walletAddress, signature: signature)
                .sink(receiveCompletion: { [weak self] completion in
                    self?.isLoading = false
                    
                    if case .failure(let error) = completion {
                        self?.error = error.localizedDescription
                    }
                }, receiveValue: { [weak self] response in
                    self?.handleSuccessfulAuth(response)
                })
                .store(in: &(self?.cancellables ?? []))
        }
    }
    
    // Demo login (no API call)
    func demoLogin() {
        isLoading = true
        error = nil
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) { [weak self] in
            // Create demo user
            let user = User(id: "demo-user", email: "demo@example.com", walletAddress: "sol1234demo")
            
            // Save token
            UserDefaults.standard.set("demo-token", forKey: "auth_token")
            
            // Update state
            self?.isAuthenticated = true
            self?.user = user
            self?.isLoading = false
        }
    }
    
    // Connect (generic method)
    func connect() {
        // Show wallet options or login form
        // For demo purposes, we'll just use demo login
        demoLogin()
    }
    
    // Disconnect
    func disconnect() {
        // Clear token
        UserDefaults.standard.removeObject(forKey: "auth_token")
        
        // Update state
        isAuthenticated = false
        user = nil
    }
    
    // Handle successful authentication
    private func handleSuccessfulAuth(_ response: AuthResponse) {
        // Save token
        UserDefaults.standard.set(response.token, forKey: "auth_token")
        
        // Update state
        isAuthenticated = true
        user = response.user
    }
    
    // Check if token exists on app launch
    func checkAuth() {
        if let token = UserDefaults.standard.string(forKey: "auth_token") {
            // Token exists, validate it
            isAuthenticated = true
            
            // In a real implementation, this would validate the token with the API
            // For demo purposes, we'll just create a demo user
            user = User(id: "demo-user", email: "demo@example.com", walletAddress: "sol1234demo")
        }
    }
}
