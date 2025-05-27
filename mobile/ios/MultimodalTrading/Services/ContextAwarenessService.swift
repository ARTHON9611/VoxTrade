import Foundation
import Combine

class ContextAwarenessService: ObservableObject {
    @Published var context: EnvironmentContext = EnvironmentContext()
    
    private var cancellables = Set<AnyCancellable>()
    
    init() {
        // Initial detection
        detectEnvironment()
        
        // Set up timer to periodically check environment
        Timer.publish(every: 30, on: .main, in: .common)
            .autoconnect()
            .sink { [weak self] _ in
                self?.detectEnvironment()
            }
            .store(in: &cancellables)
    }
    
    // Detect environment
    private func detectEnvironment() {
        // Check device orientation
        let orientation = UIDevice.current.orientation
        context.isLandscape = orientation.isLandscape
        
        // Check device type
        context.deviceType = UIDevice.current.userInterfaceIdiom == .pad ? .tablet : .phone
        
        // Check ambient light level
        if let lightSensor = UIScreen.main.brightness {
            context.isDarkMode = lightSensor < 0.5
        }
        
        // Check if headphones are connected
        let audioSession = AVAudioSession.sharedInstance()
        try? audioSession.setActive(true)
        let outputs = audioSession.currentRoute.outputs
        context.hasHeadphones = outputs.contains { $0.portType == .headphones || $0.portType == .bluetoothA2DP }
        
        // Check if device is in motion
        context.isInMotion = detectMotion()
        
        // Determine preferred modality based on context
        determinePreferredModality()
    }
    
    // Detect if device is in motion
    private func detectMotion() -> Bool {
        // In a real implementation, this would use CoreMotion
        // For demo purposes, we'll return a random value
        return Bool.random()
    }
    
    // Determine preferred modality based on context
    private func determinePreferredModality() {
        if context.hasHeadphones {
            // If headphones are connected, prefer voice
            context.preferredModality = .voice
        } else if context.isInMotion {
            // If in motion, prefer voice
            context.preferredModality = .voice
        } else if context.isLandscape && context.deviceType == .tablet {
            // If landscape tablet, prefer visual
            context.preferredModality = .visual
        } else if context.isDarkMode && context.deviceType == .phone {
            // If dark mode on phone, prefer text
            context.preferredModality = .text
        } else {
            // Default to visual
            context.preferredModality = .visual
        }
    }
}

// Environment Context
struct EnvironmentContext {
    var isLandscape: Bool = false
    var deviceType: DeviceType = .phone
    var isDarkMode: Bool = false
    var hasHeadphones: Bool = false
    var isInMotion: Bool = false
    var preferredModality: ModalityType = .visual
}

// Device Type
enum DeviceType {
    case phone
    case tablet
}

// Modality Type
enum ModalityType {
    case visual
    case voice
    case text
}

// Environment Context Provider
class EnvironmentContextProvider {
    static let shared = EnvironmentContextProvider()
    private let contextAwarenessService = ContextAwarenessService()
    
    private init() {}
    
    func getContext() -> EnvironmentContext {
        return contextAwarenessService.context
    }
}

// SwiftUI Environment Object
extension ContextAwarenessService {
    static func environmentObject() -> ContextAwarenessService {
        return ContextAwarenessService()
    }
}

// SwiftUI Environment Key
struct EnvironmentContextKey: EnvironmentKey {
    static let defaultValue = EnvironmentContext()
}

extension EnvironmentValues {
    var environmentContext: EnvironmentContext {
        get { self[EnvironmentContextKey.self] }
        set { self[EnvironmentContextKey.self] = newValue }
    }
}

// SwiftUI Hook
func useEnvironmentContext() -> EnvironmentContext {
    return EnvironmentContextProvider.shared.getContext()
}
