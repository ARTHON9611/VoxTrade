package com.multimodaltrading.android.services

import android.content.Context
import android.speech.RecognitionListener
import android.speech.SpeechRecognizer
import android.speech.RecognizerIntent
import android.content.Intent
import android.os.Bundle
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class SpeechRecognitionService(private val context: Context) {
    // State flows
    private val _isListening = MutableStateFlow(false)
    val isListening: StateFlow<Boolean> = _isListening.asStateFlow()
    
    private val _transcript = MutableStateFlow("")
    val transcript: StateFlow<String> = _transcript.asStateFlow()
    
    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error.asStateFlow()
    
    // Speech recognizer
    private var speechRecognizer: SpeechRecognizer? = null
    
    // Initialize speech recognizer
    fun initialize() {
        if (SpeechRecognizer.isRecognitionAvailable(context)) {
            speechRecognizer = SpeechRecognizer.createSpeechRecognizer(context)
            speechRecognizer?.setRecognitionListener(createRecognitionListener())
        } else {
            _error.value = "Speech recognition is not available on this device"
        }
    }
    
    // Start listening
    fun startListening() {
        if (speechRecognizer == null) {
            initialize()
        }
        
        _isListening.value = true
        _error.value = null
        _transcript.value = ""
        
        val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH)
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
        intent.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)
        intent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1)
        
        try {
            speechRecognizer?.startListening(intent)
        } catch (e: Exception) {
            _error.value = "Error starting speech recognition: ${e.message}"
            _isListening.value = false
        }
    }
    
    // Stop listening
    fun stopListening() {
        speechRecognizer?.stopListening()
        _isListening.value = false
    }
    
    // Destroy speech recognizer
    fun destroy() {
        speechRecognizer?.destroy()
        speechRecognizer = null
    }
    
    // Create recognition listener
    private fun createRecognitionListener(): RecognitionListener {
        return object : RecognitionListener {
            override fun onReadyForSpeech(params: Bundle?) {
                _error.value = null
            }
            
            override fun onBeginningOfSpeech() {
                // Speech started
            }
            
            override fun onRmsChanged(rmsdB: Float) {
                // Sound level changed
            }
            
            override fun onBufferReceived(buffer: ByteArray?) {
                // More sound has been received
            }
            
            override fun onEndOfSpeech() {
                _isListening.value = false
            }
            
            override fun onError(error: Int) {
                _isListening.value = false
                _error.value = when (error) {
                    SpeechRecognizer.ERROR_AUDIO -> "Audio recording error"
                    SpeechRecognizer.ERROR_CLIENT -> "Client side error"
                    SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS -> "Insufficient permissions"
                    SpeechRecognizer.ERROR_NETWORK -> "Network error"
                    SpeechRecognizer.ERROR_NETWORK_TIMEOUT -> "Network timeout"
                    SpeechRecognizer.ERROR_NO_MATCH -> "No match found"
                    SpeechRecognizer.ERROR_RECOGNIZER_BUSY -> "RecognitionService busy"
                    SpeechRecognizer.ERROR_SERVER -> "Server error"
                    SpeechRecognizer.ERROR_SPEECH_TIMEOUT -> "No speech input"
                    else -> "Unknown error"
                }
            }
            
            override fun onResults(results: Bundle?) {
                val matches = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                if (!matches.isNullOrEmpty()) {
                    _transcript.value = matches[0]
                }
                _isListening.value = false
            }
            
            override fun onPartialResults(partialResults: Bundle?) {
                val matches = partialResults?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                if (!matches.isNullOrEmpty()) {
                    _transcript.value = matches[0]
                }
            }
            
            override fun onEvent(eventType: Int, params: Bundle?) {
                // Event occurred
            }
        }
    }
}
