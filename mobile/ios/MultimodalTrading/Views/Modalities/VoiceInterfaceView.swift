import SwiftUI
import Speech

struct VoiceInterfaceView: View {
    @EnvironmentObject private var tradingViewModel: TradingViewModel
    @State private var status: VoiceStatus = .idle
    @State private var transcript: String = ""
    @State private var errorMessage: String? = nil
    @State private var isListening: Bool = false
    
    // Speech recognizer
    private let speechRecognizer = SpeechRecognitionService()
    
    var body: some View {
        VStack(spacing: 24) {
            // Voice Interface Header
            VStack(spacing: 16) {
                Image(systemName: "waveform.circle.fill")
                    .font(.system(size: 64))
                    .foregroundColor(Color(hex: "4F46E5"))
                
                Text("Voice Trading Assistant")
                    .font(.title)
                    .fontWeight(.bold)
                
                Text("Tap the microphone to start speaking your trading commands")
                    .font(.subheadline)
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal)
            }
            .padding(.top, 32)
            
            // Microphone Button
            Button(action: {
                if isListening {
                    stopListening()
                } else {
                    startListening()
                }
            }) {
                ZStack {
                    Circle()
                        .fill(isListening ? Color.red : Color(hex: "4F46E5"))
                        .frame(width: 80, height: 80)
                        .shadow(color: Color.black.opacity(0.1), radius: 10, x: 0, y: 5)
                    
                    Image(systemName: isListening ? "stop.fill" : "mic.fill")
                        .font(.system(size: 32))
                        .foregroundColor(.white)
                }
                .scaleEffect(isListening ? 1.1 : 1.0)
                .animation(.spring(response: 0.3, dampingFraction: 0.6), value: isListening)
            }
            .padding(.vertical, 24)
            
            // Status and Transcript
            VStack(spacing: 12) {
                Text(statusText)
                    .font(.headline)
                    .foregroundColor(statusColor)
                
                if !transcript.isEmpty {
                    Text("\"\(transcript)\"")
                        .font(.body)
                        .italic()
                        .foregroundColor(.gray)
                        .padding()
                        .background(Color.gray.opacity(0.1))
                        .cornerRadius(8)
                }
                
                if let error = errorMessage {
                    Text(error)
                        .font(.subheadline)
                        .foregroundColor(.red)
                        .padding()
                }
            }
            .padding(.horizontal)
            
            Spacer()
            
            // Example Commands
            VStack(alignment: .leading, spacing: 16) {
                Text("Example Commands:")
                    .font(.headline)
                    .padding(.bottom, 4)
                
                commandExample(command: "Buy 0.5 SOL", description: "Place a buy order")
                commandExample(command: "Sell 10 USDC", description: "Place a sell order")
                commandExample(command: "Swap 1 SOL to USDC", description: "Execute a token swap")
                commandExample(command: "Check price of SOL", description: "Get current price")
                commandExample(command: "Check my balance", description: "View your wallet balance")
            }
            .padding()
            .background(Color.gray.opacity(0.1))
            .cornerRadius(12)
            .padding(.horizontal)
            .padding(.bottom, 24)
        }
        .padding()
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: Color.black.opacity(0.05), radius: 10, x: 0, y: 5)
        .onAppear {
            speechRecognizer.requestAuthorization()
        }
    }
    
    // Command Example View
    private func commandExample(command: String, description: String) -> some View {
        HStack(alignment: .top) {
            Text(command)
                .font(.subheadline)
                .fontWeight(.medium)
                .foregroundColor(Color(hex: "4F46E5"))
                .frame(width: 150, alignment: .leading)
            
            Text(description)
                .font(.subheadline)
                .foregroundColor(.gray)
        }
    }
    
    // Status Text
    private var statusText: String {
        switch status {
        case .idle:
            return "Ready to listen"
        case .listening:
            return "Listening..."
        case .processing:
            return "Processing command..."
        case .error:
            return "Error"
        case .success:
            return "Command recognized"
        }
    }
    
    // Status Color
    private var statusColor: Color {
        switch status {
        case .idle:
            return .gray
        case .listening:
            return .blue
        case .processing:
            return .orange
        case .error:
            return .red
        case .success:
            return .green
        }
    }
    
    // Start Listening
    private func startListening() {
        isListening = true
        status = .listening
        errorMessage = nil
        
        speechRecognizer.startRecognition { result in
            switch result {
            case .success(let recognizedText):
                transcript = recognizedText
                status = .success
                processCommand(recognizedText)
            case .failure(let error):
                errorMessage = error.localizedDescription
                status = .error
            }
            isListening = false
        }
    }
    
    // Stop Listening
    private func stopListening() {
        speechRecognizer.stopRecognition()
        isListening = false
        status = .idle
    }
    
    // Process Command
    private func processCommand(_ command: String) {
        status = .processing
        
        // In a real implementation, this would call the API
        // For demo purposes, we'll just simulate processing
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            // Process command based on patterns
            if command.lowercased().contains("buy") {
                tradingViewModel.processBuyCommand(command)
            } else if command.lowercased().contains("sell") {
                tradingViewModel.processSellCommand(command)
            } else if command.lowercased().contains("swap") {
                tradingViewModel.processSwapCommand(command)
            } else if command.lowercased().contains("price") {
                tradingViewModel.processPriceCommand(command)
            } else if command.lowercased().contains("balance") {
                tradingViewModel.processBalanceCommand(command)
            } else {
                errorMessage = "Command not recognized. Please try again."
                status = .error
                return
            }
            
            status = .success
        }
    }
}

// Voice Status Enum
enum VoiceStatus {
    case idle
    case listening
    case processing
    case error
    case success
}

struct VoiceInterfaceView_Previews: PreviewProvider {
    static var previews: some View {
        VoiceInterfaceView()
            .environmentObject(TradingViewModel())
    }
}
