import { useState, useEffect } from 'react';

// Modality types
export enum ModalityType {
  VISUAL = 'visual',
  VOICE = 'voice',
  TEXT = 'text'
}

// Environment context
export interface EnvironmentContext {
  deviceType: 'desktop' | 'tablet' | 'mobile';
  isMoving: boolean;
  hasKeyboard: boolean;
  hasTouch: boolean;
  noiseLevel: 'low' | 'medium' | 'high';
  batteryLevel: number;
  isCharging: boolean;
  connectionType: 'wifi' | 'cellular' | 'offline';
  preferredModality: ModalityType;
}

// Default context
const defaultContext: EnvironmentContext = {
  deviceType: 'desktop',
  isMoving: false,
  hasKeyboard: true,
  hasTouch: false,
  noiseLevel: 'low',
  batteryLevel: 100,
  isCharging: true,
  connectionType: 'wifi',
  preferredModality: ModalityType.VISUAL
};

export const useEnvironmentContext = () => {
  const [context, setContext] = useState<EnvironmentContext>(defaultContext);
  
  // Detect device type
  useEffect(() => {
    const detectDeviceType = () => {
      const width = window.innerWidth;
      if (width < 768) {
        return 'mobile';
      } else if (width < 1024) {
        return 'tablet';
      } else {
        return 'desktop';
      }
    };
    
    const updateDeviceType = () => {
      setContext(prev => ({
        ...prev,
        deviceType: detectDeviceType()
      }));
    };
    
    // Initial detection
    updateDeviceType();
    
    // Listen for resize events
    window.addEventListener('resize', updateDeviceType);
    
    return () => {
      window.removeEventListener('resize', updateDeviceType);
    };
  }, []);
  
  // Detect touch capability
  useEffect(() => {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    setContext(prev => ({
      ...prev,
      hasTouch
    }));
  }, []);
  
  // Detect battery status if available
  useEffect(() => {
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        const updateBatteryInfo = () => {
          setContext(prev => ({
            ...prev,
            batteryLevel: battery.level * 100,
            isCharging: battery.charging
          }));
        };
        
        // Initial update
        updateBatteryInfo();
        
        // Listen for battery changes
        battery.addEventListener('levelchange', updateBatteryInfo);
        battery.addEventListener('chargingchange', updateBatteryInfo);
        
        return () => {
          battery.removeEventListener('levelchange', updateBatteryInfo);
          battery.removeEventListener('chargingchange', updateBatteryInfo);
        };
      });
    }
  }, []);
  
  // Detect connection type
  useEffect(() => {
    const updateConnectionType = () => {
      if (!navigator.onLine) {
        return 'offline';
      }
      
      // Use Network Information API if available
      if ('connection' in navigator) {
        const connection = navigator.connection;
        if (connection.type === 'wifi') {
          return 'wifi';
        } else {
          return 'cellular';
        }
      }
      
      // Default to wifi if can't determine
      return 'wifi';
    };
    
    const handleConnectionChange = () => {
      setContext(prev => ({
        ...prev,
        connectionType: updateConnectionType() as 'wifi' | 'cellular' | 'offline'
      }));
    };
    
    // Initial detection
    handleConnectionChange();
    
    // Listen for connection changes
    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);
    
    return () => {
      window.removeEventListener('online', handleConnectionChange);
      window.removeEventListener('offline', handleConnectionChange);
    };
  }, []);
  
  // Determine preferred modality based on context
  useEffect(() => {
    const determinePreferredModality = () => {
      // If offline, prefer visual as it may work with cached data
      if (context.connectionType === 'offline') {
        return ModalityType.VISUAL;
      }
      
      // If mobile and moving, prefer voice
      if (context.deviceType === 'mobile' && context.isMoving) {
        return ModalityType.VOICE;
      }
      
      // If desktop with keyboard, prefer text
      if (context.deviceType === 'desktop' && context.hasKeyboard) {
        return ModalityType.TEXT;
      }
      
      // If touch device, prefer visual
      if (context.hasTouch) {
        return ModalityType.VISUAL;
      }
      
      // Default to visual
      return ModalityType.VISUAL;
    };
    
    setContext(prev => ({
      ...prev,
      preferredModality: determinePreferredModality()
    }));
  }, [
    context.deviceType,
    context.isMoving,
    context.hasKeyboard,
    context.hasTouch,
    context.connectionType
  ]);
  
  return {
    context,
    setContext
  };
};
