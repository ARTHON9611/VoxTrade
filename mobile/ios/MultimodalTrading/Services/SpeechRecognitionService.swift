import Foundation
import Speech
import AVFoundation

class SpeechRecognitionService: NSObject, SFSpeechRecognizerDelegate {
    private let speechRecognizer = SFSpeechRecognizer(locale: Locale(identifier: "en-US"))
    private var recognitionRequest: SFSpeechAudioBufferRecognitionRequest?
    private var recognitionTask: SFSpeechRecognitionTask?
    private let audioEngine = AVAudioEngine()
    
    override init() {
        super.init()
        speechRecognizer?.delegate = self
    }
    
    // Request authorization for speech recognition
    func requestAuthorization() {
        SFSpeechRecognizer.requestAuthorization { status in
            // Handle authorization status
            switch status {
            case .authorized:
                print("Speech recognition authorized")
            case .denied:
                print("Speech recognition authorization denied")
            case .restricted:
                print("Speech recognition restricted on this device")
            case .notDetermined:
                print("Speech recognition not determined")
            @unknown default:
                print("Unknown authorization status")
            }
        }
    }
    
    // Start speech recognition
    func startRecognition(completion: @escaping (Result<String, Error>) -> Void) {
        // Check if recognition is already in progress
        if recognitionTask != nil {
            stopRecognition()
        }
        
        // Create audio session
        let audioSession = AVAudioSession.sharedInstance()
        do {
            try audioSession.setCategory(.record, mode: .measurement, options: .duckOthers)
            try audioSession.setActive(true, options: .notifyOthersOnDeactivation)
        } catch {
            completion(.failure(error))
            return
        }
        
        // Create recognition request
        recognitionRequest = SFSpeechAudioBufferRecognitionRequest()
        
        // Check if audio engine is available
        guard let recognitionRequest = recognitionRequest, let speechRecognizer = speechRecognizer, speechRecognizer.isAvailable else {
            completion(.failure(NSError(domain: "SpeechRecognitionService", code: 0, userInfo: [NSLocalizedDescriptionKey: "Speech recognition not available"])))
            return
        }
        
        // Configure recognition request
        recognitionRequest.shouldReportPartialResults = true
        
        // Start recognition task
        recognitionTask = speechRecognizer.recognitionTask(with: recognitionRequest) { result, error in
            var isFinal = false
            
            if let result = result {
                // Get transcription
                let transcription = result.bestTranscription.formattedString
                isFinal = result.isFinal
                
                // If final, return result
                if isFinal {
                    completion(.success(transcription))
                }
            }
            
            // Handle error
            if error != nil || isFinal {
                self.audioEngine.stop()
                self.audioEngine.inputNode.removeTap(onBus: 0)
                
                self.recognitionRequest = nil
                self.recognitionTask = nil
                
                if let error = error {
                    completion(.failure(error))
                }
            }
        }
        
        // Configure audio engine
        let recordingFormat = audioEngine.inputNode.outputFormat(forBus: 0)
        audioEngine.inputNode.installTap(onBus: 0, bufferSize: 1024, format: recordingFormat) { buffer, _ in
            self.recognitionRequest?.append(buffer)
        }
        
        // Start audio engine
        do {
            audioEngine.prepare()
            try audioEngine.start()
        } catch {
            completion(.failure(error))
        }
    }
    
    // Stop speech recognition
    func stopRecognition() {
        audioEngine.stop()
        audioEngine.inputNode.removeTap(onBus: 0)
        
        recognitionRequest?.endAudio()
        recognitionTask?.cancel()
        
        recognitionRequest = nil
        recognitionTask = nil
    }
    
    // Speech recognizer availability changed
    func speechRecognizer(_ speechRecognizer: SFSpeechRecognizer, availabilityDidChange available: Bool) {
        print("Speech recognizer availability changed: \(available)")
    }
}
