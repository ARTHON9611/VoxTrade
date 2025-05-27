import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ModalityType } from '../types/modality';
import { useContextAwareness } from '../hooks/useContextAwareness';

interface ModalityContextType {
  activeModality: ModalityType;
  setActiveModality: (modality: ModalityType) => void;
  isAutoDetectEnabled: boolean;
  toggleAutoDetect: () => void;
  detectedModality: ModalityType | null;
}

const ModalityContext = createContext<ModalityContextType | undefined>(undefined);

export const ModalityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeModality, setActiveModality] = useState<ModalityType>(ModalityType.Visual);
  const [isAutoDetectEnabled, setIsAutoDetectEnabled] = useState<boolean>(true);
  
  // Use the context awareness hook to detect the appropriate modality
  const { detectedModality } = useContextAwareness();
  
  // When auto-detect is enabled, update the active modality based on detection
  useEffect(() => {
    if (isAutoDetectEnabled && detectedModality) {
      setActiveModality(detectedModality);
    }
  }, [isAutoDetectEnabled, detectedModality]);
  
  // Toggle auto-detect
  const toggleAutoDetect = () => {
    setIsAutoDetectEnabled(prev => !prev);
  };
  
  const value = {
    activeModality,
    setActiveModality,
    isAutoDetectEnabled,
    toggleAutoDetect,
    detectedModality
  };
  
  return <ModalityContext.Provider value={value}>{children}</ModalityContext.Provider>;
};

export const useModality = (): ModalityContextType => {
  const context = useContext(ModalityContext);
  if (context === undefined) {
    throw new Error('useModality must be used within a ModalityProvider');
  }
  return context;
};
