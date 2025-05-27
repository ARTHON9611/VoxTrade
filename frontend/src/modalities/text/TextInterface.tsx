import React, { useState, useEffect } from 'react';
import { ModalityType } from '../../types/modality';
import CommandProcessor from '../../components/text/CommandProcessor';

interface TextInterfaceProps {
  onCommandExecuted: (result: { success: boolean; message: string; data?: any }) => void;
}

const TextInterface: React.FC<TextInterfaceProps> = ({ onCommandExecuted }) => {
  const [commandHistory, setCommandHistory] = useState<Array<{command: string; result: any}>>([]);

  // Handle command execution
  const handleCommandExecuted = (result: { success: boolean; message: string; data?: any }) => {
    // Pass the result up to the parent component
    onCommandExecuted(result);
    
    // Update command history if needed
    if (result.command) {
      setCommandHistory(prev => [...prev, { command: result.command, result }]);
    }
  };

  return (
    <div className="text-interface">
      <div className="text-interface-header">
        <h2>Text Command Interface</h2>
        <p className="interface-description">
          Enter trading commands using text. Type "help" for available commands.
        </p>
      </div>
      
      <CommandProcessor onCommandExecuted={handleCommandExecuted} />
      
      <div className="command-examples">
        <h3>Example Commands:</h3>
        <div className="examples-list">
          <div className="example-item">
            <code>buy 1 SOL</code>
            <span>Buy 1 SOL token</span>
          </div>
          <div className="example-item">
            <code>sell 0.5 BTC</code>
            <span>Sell 0.5 BTC</span>
          </div>
          <div className="example-item">
            <code>swap 100 USDC to SOL</code>
            <span>Swap 100 USDC for SOL</span>
          </div>
          <div className="example-item">
            <code>price SOL</code>
            <span>Check the current price of SOL</span>
          </div>
          <div className="example-item">
            <code>balance</code>
            <span>Check your wallet balances</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextInterface;
