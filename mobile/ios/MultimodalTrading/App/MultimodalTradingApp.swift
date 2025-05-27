import SwiftUI

@main
struct MultimodalTradingApp: App {
    // Initialize view models
    @StateObject private var authViewModel = AuthViewModel()
    @StateObject private var tradingViewModel = TradingViewModel()
    @StateObject private var modalityViewModel = ModalityViewModel()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(authViewModel)
                .environmentObject(tradingViewModel)
                .environmentObject(modalityViewModel)
        }
    }
}
