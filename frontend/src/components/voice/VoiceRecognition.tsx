import React, { useState, useEffect, useCallback } from 'react';
import { ModalityType } from '../types/modality';

interface VoiceRecognitionProps {
  onResult: (transcript: string) => void;
  onError: (error: string) => void;
  isListening: boolean;
}

const VoiceRecognition: React.FC<VoiceRecognitionProps> = ({ 
  onResult, 
  onError, 
  isListening 
}) => {
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports SpeechRecognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        try {
          const recognitionInstance = new SpeechRecognition();
          recognitionInstance.continuous = false;
          recognitionInstance.interimResults = false;
          recognitionInstance.lang = 'en-US';
          
          setRecognition(recognitionInstance);
          setIsSupported(true);
        } catch (error) {
          console.error('Error initializing speech recognition:', error);
          onError('Speech recognition initialization failed');
          setIsSupported(false);
        }
      } else {
        console.warn('Speech recognition not supported in this browser');
        onError('Speech recognition not supported in this browser');
        setIsSupported(false);
      }
    }
  }, [onError]);

  // Set up event handlers
  useEffect(() => {
    if (!recognition) return;

    const handleResult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    const handleError = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      onError(`Speech recognition error: ${event.error}`);
    };

    const handleEnd = () => {
      // If still listening, restart recognition
      if (isListening) {
        try {
          recognition.start();
        } catch (error) {
          console.error('Error restarting speech recognition:', error);
        }
      }
    };

    recognition.onresult = handleResult;
    recognition.onerror = handleError;
    recognition.onend = handleEnd;

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
    };
  }, [recognition, isListening, onResult, onError]);

  // Start or stop listening based on isListening prop
  useEffect(() => {
    if (!recognition || !isSupported) return;

    if (isListening) {
      try {
        recognition.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        onError('Failed to start speech recognition');
      }
    } else {
      try {
        recognition.stop();
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }

    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch (error) {
          console.error('Error stopping speech recognition on cleanup:', error);
        }
      }
    };
  }, [isListening, recognition, isSupported, onError]);

  return (
    <div className="voice-recognition">
      {!isSupported && (
        <div className="voice-recognition-error">
          Speech recognition is not supported in your browser.
          Please try using Chrome, Edge, or Safari.
        </div>
      )}
      {isListening && isSupported && (
        <div className="voice-recognition-active">
          <div className="voice-indicator">
            <div className="voice-pulse"></div>
          </div>
          <div className="voice-status">Listening...</div>
        </div>
      )}
    </div>
  );
};

export default VoiceRecognition;
