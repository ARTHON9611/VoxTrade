import SwiftUI

struct TradingDashboardView: View {
    @EnvironmentObject private var authViewModel: AuthViewModel
    @EnvironmentObject private var tradingViewModel: TradingViewModel
    @EnvironmentObject private var modalityViewModel: ModalityViewModel
    
    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // Header
                headerView
                
                // Modality Selector
                modalitySelectorView
                
                // Main Content based on selected modality
                mainContentView
            }
            .navigationBarHidden(true)
            .onAppear {
                // Detect environment and set preferred modality
                modalityViewModel.detectPreferredModality()
                
                // Load user data
                if authViewModel.isAuthenticated {
                    tradingViewModel.loadBalances()
                    tradingViewModel.loadOrderHistory()
                }
            }
        }
    }
    
    // Header View
    private var headerView: some View {
        ZStack {
            Color(hex: "4F46E5") // Indigo color
            
            HStack {
                Text("Multimodal Trading Interface")
                    .font(.title2)
                    .fontWeight(.bold)
                    .foregroundColor(.white)
                
                Spacer()
                
                Button(action: {
                    if authViewModel.isAuthenticated {
                        authViewModel.disconnect()
                    } else {
                        authViewModel.connect()
                    }
                }) {
                    Text(authViewModel.isAuthenticated ? "Disconnect" : "Connect Wallet")
                        .font(.subheadline)
                        .fontWeight(.medium)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 8)
                        .background(authViewModel.isAuthenticated ? Color.green.opacity(0.2) : Color.white)
                        .foregroundColor(authViewModel.isAuthenticated ? Color.green : Color(hex: "4F46E5"))
                        .cornerRadius(8)
                }
            }
            .padding(.horizontal)
            .padding(.vertical, 12)
        }
        .frame(height: 60)
    }
    
    // Modality Selector View
    private var modalitySelectorView: some View {
        ZStack {
            Color.white
            
            HStack(spacing: 8) {
                modalityButton(title: "Visual", icon: "eye.fill", modality: .visual)
                modalityButton(title: "Voice", icon: "mic.fill", modality: .voice)
                modalityButton(title: "Text", icon: "text.bubble.fill", modality: .text)
            }
            .padding(.vertical, 8)
        }
        .frame(height: 56)
        .shadow(color: Color.black.opacity(0.05), radius: 2, x: 0, y: 2)
    }
    
    // Modality Button
    private func modalityButton(title: String, icon: String, modality: ModalityType) -> some View {
        Button(action: {
            modalityViewModel.switchModality(to: modality)
        }) {
            HStack {
                Image(systemName: icon)
                    .font(.subheadline)
                Text(title)
                    .font(.subheadline)
                    .fontWeight(.medium)
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(modalityViewModel.currentModality == modality ? Color(hex: "4F46E5") : Color(hex: "F3F4F6"))
            .foregroundColor(modalityViewModel.currentModality == modality ? .white : .primary)
            .cornerRadius(8)
        }
    }
    
    // Main Content View based on selected modality
    private var mainContentView: some View {
        ScrollView {
            VStack {
                switch modalityViewModel.currentModality {
                case .visual:
                    VisualInterfaceView()
                        .environmentObject(tradingViewModel)
                case .voice:
                    VoiceInterfaceView()
                        .environmentObject(tradingViewModel)
                case .text:
                    TextInterfaceView()
                        .environmentObject(tradingViewModel)
                }
            }
            .padding()
        }
        .background(Color(hex: "F9FAFB"))
    }
}

// Helper extension for hex colors
extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (1, 1, 1, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

struct TradingDashboardView_Previews: PreviewProvider {
    static var previews: some View {
        TradingDashboardView()
            .environmentObject(AuthViewModel())
            .environmentObject(TradingViewModel())
            .environmentObject(ModalityViewModel())
    }
}
