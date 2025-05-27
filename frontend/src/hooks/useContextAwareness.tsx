import { useState, useEffect } from 'react';
import { ModalityType } from '../types/modality';

interface ContextAwarenessResult {
  detectedModality: ModalityType | null;
  environmentFactors: {
    isMoving: boolean;
    isLoudEnvironment: boolean;
    isHandsFree: boolean;
    isScreenVisible: boolean;
  };
}

export const useContextAwareness = (): ContextAwarenessResult => {
  const [detectedModality, setDetectedModality] = useState<ModalityType | null>(null);
  const [environmentFactors, setEnvironmentFactors] = useState({
    isMoving: false,
    isLoudEnvironment: false,
    isHandsFree: true,
    isScreenVisible: true
  });

  // Detect device motion
  useEffect(() => {
    let motionTimeout: number | null = null;
    let isMoving = false;

    // Check if DeviceMotionEvent is available
    if (typeof window !== 'undefined' && typeof DeviceMotionEvent !== 'undefined') {
      const handleMotion = (event: DeviceMotionEvent) => {
        const acceleration = event.accelerationIncludingGravity;
        
        if (!acceleration) return;
        
        // Calculate total acceleration magnitude
        const magnitude = Math.sqrt(
          Math.pow(acceleration.x || 0, 2) +
          Math.pow(acceleration.y || 0, 2) +
          Math.pow(acceleration.z || 0, 2)
        );
        
        // If magnitude is above threshold, consider device as moving
        if (magnitude > 12) { // Threshold value, may need adjustment
          isMoving = true;
          
          // Reset timeout if already set
          if (motionTimeout) {
            window.clearTimeout(motionTimeout);
          }
          
          // Set timeout to reset isMoving after 2 seconds of no significant motion
          motionTimeout = window.setTimeout(() => {
            isMoving = false;
            setEnvironmentFactors(prev => ({ ...prev, isMoving: false }));
          }, 2000);
        }
        
        setEnvironmentFactors(prev => ({ ...prev, isMoving }));
      };
      
      try {
        window.addEventListener('devicemotion', handleMotion);
      } catch (error) {
        console.error('Error setting up motion detection:', error);
      }
      
      return () => {
        try {
          window.removeEventListener('devicemotion', handleMotion);
          if (motionTimeout) {
            window.clearTimeout(motionTimeout);
          }
        } catch (error) {
          console.error('Error cleaning up motion detection:', error);
        }
      };
    }
    
    return undefined;
  }, []);

  // Detect audio environment using microphone
  useEffect(() => {
    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let microphone: MediaStreamAudioSourceNode | null = null;
    let javascriptNode: ScriptProcessorNode | null = null;
    let audioInterval: number | null = null;
    
    const setupAudioAnalysis = async () => {
      try {
        // Check if browser supports AudioContext
        if (typeof window !== 'undefined' && 
            (typeof AudioContext !== 'undefined' || typeof (window as any).webkitAudioContext !== 'undefined')) {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          audioContext = new AudioContextClass();
          
          // Get microphone access
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          
          // Create analyser node
          analyser = audioContext.createAnalyser();
          analyser.smoothingTimeConstant = 0.3;
          analyser.fftSize = 1024;
          
          // Create microphone source
          microphone = audioContext.createMediaStreamSource(stream);
          microphone.connect(analyser);
          
          // Create script processor node for analyzing audio
          javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);
          analyser.connect(javascriptNode);
          javascriptNode.connect(audioContext.destination);
          
          // Process audio data
          javascriptNode.onaudioprocess = () => {
            const array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            
            // Calculate average volume
            let values = 0;
            for (let i = 0; i < array.length; i++) {
              values += array[i];
            }
            const average = values / array.length;
            
            // If average volume is above threshold, consider environment as loud
            const isLoudEnvironment = average > 50; // Threshold value, may need adjustment
            
            setEnvironmentFactors(prev => ({ ...prev, isLoudEnvironment }));
          };
        }
      } catch (error) {
        console.error('Error accessing microphone:', error);
        // Fall back to simulation if microphone access fails
        simulateAudioEnvironment();
      }
    };
    
    // Simulate audio environment when microphone access is not available
    const simulateAudioEnvironment = () => {
      // Randomly change between quiet and loud environment every 10 seconds
      audioInterval = window.setInterval(() => {
        const isLoud = Math.random() > 0.7; // 30% chance of loud environment
        setEnvironmentFactors(prev => ({ ...prev, isLoudEnvironment: isLoud }));
      }, 10000);
    };
    
    // Try to set up real audio analysis, fall back to simulation if needed
    setupAudioAnalysis().catch(simulateAudioEnvironment);
    
    return () => {
      // Clean up audio resources
      if (javascriptNode) {
        javascriptNode.disconnect();
      }
      if (microphone) {
        microphone.disconnect();
      }
      if (audioContext) {
        audioContext.close();
      }
      if (audioInterval) {
        clearInterval(audioInterval);
      }
    };
  }, []);

  // Detect screen visibility and hands-free status
  useEffect(() => {
    let visibilityInterval: number | null = null;
    
    // Set up visibility change detection
    const handleVisibilityChange = () => {
      if (typeof document !== 'undefined') {
        const isScreenVisible = document.visibilityState === 'visible';
        setEnvironmentFactors(prev => ({ ...prev, isScreenVisible }));
      }
    };
    
    // Simulate hands-free detection (in a real app, this would use camera or other sensors)
    const simulateHandsFreeStatus = () => {
      visibilityInterval = window.setInterval(() => {
        // In a real app, this would be determined by sensors or user behavior
        const isHandsFree = Math.random() > 0.3; // 70% chance of hands-free
        setEnvironmentFactors(prev => ({ ...prev, isHandsFree }));
      }, 15000);
    };
    
    if (typeof document !== 'undefined') {
      // Initial check
      handleVisibilityChange();
      
      // Set up event listener
      document.addEventListener('visibilitychange', handleVisibilityChange);
      
      // Set up hands-free simulation
      simulateHandsFreeStatus();
    }
    
    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      }
      if (visibilityInterval) {
        clearInterval(visibilityInterval);
      }
    };
  }, []);

  // Determine the most appropriate modality based on environment factors
  useEffect(() => {
    const determineModality = () => {
      const { isMoving, isLoudEnvironment, isHandsFree, isScreenVisible } = environmentFactors;
      
      // Decision logic for modality selection
      if (!isScreenVisible) {
        // If screen is not visible, voice is the only option
        return ModalityType.Voice;
      } else if (isMoving && isHandsFree) {
        // If moving and hands-free, voice is best
        return ModalityType.Voice;
      } else if (isLoudEnvironment) {
        // If in loud environment, visual or text is better than voice
        return isHandsFree ? ModalityType.Visual : ModalityType.Text;
      } else if (!isHandsFree) {
        // If hands are occupied but environment is quiet, voice is good
        return ModalityType.Voice;
      } else {
        // Default to visual interface when no constraints
        return ModalityType.Visual;
      }
    };
    
    const newModality = determineModality();
    setDetectedModality(newModality);
  }, [environmentFactors]);

  return {
    detectedModality,
    environmentFactors
  };
};
