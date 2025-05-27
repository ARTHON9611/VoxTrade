import React, { useState } from 'react';
import { ModalityType } from '../types/modality';
import { useModality } from '../contexts/ModalityContext';

interface ModalitySwitcherProps {
  className?: string;
}

const ModalitySwitcher: React.FC<ModalitySwitcherProps> = ({ className }) => {
  const { activeModality, setActiveModality, isAutoDetectEnabled, toggleAutoDetect, detectedModality } = useModality();

  return (
    <div className={`modality-switcher ${className || ''}`}>
      <div className="modality-options">
        <button
          className={`modality-button ${activeModality === ModalityType.Visual ? 'active' : ''}`}
          onClick={() => setActiveModality(ModalityType.Visual)}
        >
          <span className="icon">👁️</span>
          <span className="label">Visual</span>
        </button>
        
        <button
          className={`modality-button ${activeModality === ModalityType.Voice ? 'active' : ''}`}
          onClick={() => setActiveModality(ModalityType.Voice)}
        >
          <span className="icon">🎤</span>
          <span className="label">Voice</span>
        </button>
        
        <button
          className={`modality-button ${activeModality === ModalityType.Text ? 'active' : ''}`}
          onClick={() => setActiveModality(ModalityType.Text)}
        >
          <span className="icon">⌨️</span>
          <span className="label">Text</span>
        </button>
      </div>
      
      <div className="auto-detect-toggle">
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={isAutoDetectEnabled}
            onChange={toggleAutoDetect}
          />
          <span className="toggle-text">Auto-detect</span>
        </label>
        
        {isAutoDetectEnabled && detectedModality && (
          <div className="detected-modality">
            Detected: {detectedModality}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalitySwitcher;
