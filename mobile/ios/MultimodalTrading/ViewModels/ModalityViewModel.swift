import Foundation
import Combine

class ModalityViewModel: ObservableObject {
    @Published var currentModality: ModalityType = .visual
    @Published var isContextAware: Bool = true
    
    private let contextAwarenessService = ContextAwarenessService()
    private var cancellables = Set<AnyCancellable>()
    
    init() {
        // Subscribe to context changes
        contextAwarenessService.$context
            .sink { [weak self] context in
                guard let self = self, self.isContextAware else { return }
                self.currentModality = context.preferredModality
            }
            .store(in: &cancellables)
    }
    
    // Switch modality manually
    func switchModality(to modality: ModalityType) {
        currentModality = modality
        isContextAware = false
    }
    
    // Enable context awareness
    func enableContextAwareness() {
        isContextAware = true
        detectPreferredModality()
    }
    
    // Detect preferred modality based on current context
    func detectPreferredModality() {
        if isContextAware {
            currentModality = contextAwarenessService.context.preferredModality
        }
    }
}
