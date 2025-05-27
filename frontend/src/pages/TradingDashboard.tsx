import React, { useState, useEffect } from 'react';
import { ModalityType } from '../types/modality';
import { useModality } from '../contexts/ModalityContext';
import VisualInterface from '../modalities/visual/VisualInterface';
import VoiceInterface from '../modalities/voice/VoiceInterface';
import TextInterface from '../modalities/text/TextInterface';

const TradingDashboard: React.FC = () => {
  const { activeModality } = useModality();
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
    timestamp: number;
  }>>([]);

  // Handle command/action execution from any modality
  const handleActionExecuted = (result: { success: boolean; message: string; data?: any }) => {
    // Add notification
    const notification = {
      id: Date.now().toString(),
      message: result.message,
      type: result.success ? 'success' : 'error',
      timestamp: Date.now()
    };
    
    setNotifications(prev => [notification, ...prev]);
    
    // Auto-remove notifications after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  return (
    <div className="trading-dashboard">
      <div className="modality-indicator">
        <div className={`indicator ${activeModality.toLowerCase()}`}>
          {activeModality === ModalityType.Visual && 'Visual Mode'}
          {activeModality === ModalityType.Voice && 'Voice Mode'}
          {activeModality === ModalityType.Text && 'Text Mode'}
        </div>
      </div>
      
      <div className="dashboard-content">
        {activeModality === ModalityType.Visual && (
          <VisualInterface onActionExecuted={handleActionExecuted} />
        )}
        
        {activeModality === ModalityType.Voice && (
          <VoiceInterface onCommandExecuted={handleActionExecuted} />
        )}
        
        {activeModality === ModalityType.Text && (
          <TextInterface onCommandExecuted={handleActionExecuted} />
        )}
      </div>
      
      <div className="notifications-container">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`notification ${notification.type}`}
          >
            <span className="message">{notification.message}</span>
            <button 
              className="close-button"
              onClick={() => setNotifications(prev => 
                prev.filter(n => n.id !== notification.id)
              )}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TradingDashboard;
