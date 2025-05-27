import React, { useState, useEffect } from 'react';
import { ModalityType } from '../../types/modality';
import VoiceRecognition from '../voice/VoiceRecognition';
import { okxDexClient } from '../../api/okxDexClient';

interface CommandProcessorProps {
  onCommandExecuted: (result: { success: boolean; message: string; data?: any }) => void;
}

const CommandProcessor: React.FC<CommandProcessorProps> = ({ onCommandExecuted }) => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  // Command patterns for text commands
  const COMMAND_PATTERNS = {
    BUY: /^buy\s+(\d+(?:\.\d+)?)\s+(SOL|USDC|USDT|BTC|ETH)$/i,
    SELL: /^sell\s+(\d+(?:\.\d+)?)\s+(SOL|USDC|USDT|BTC|ETH)$/i,
    SWAP: /^swap\s+(\d+(?:\.\d+)?)\s+(SOL|USDC|USDT|BTC|ETH)\s+(?:for|to)\s+(SOL|USDC|USDT|BTC|ETH)$/i,
    PRICE: /^(?:price|check)\s+(?:of\s+)?(SOL|USDC|USDT|BTC|ETH)$/i,
    BALANCE: /^(?:balance|holdings)$/i,
    HELP: /^(?:help|commands)$/i,
  };

  // Process command input
  const processCommand = async (command: string) => {
    setIsProcessing(true);
    
    try {
      // Add command to history
      setHistory(prev => [...prev, command]);
      
      // Check for buy command
      const buyMatch = command.match(COMMAND_PATTERNS.BUY);
      if (buyMatch) {
        const [_, amount, token] = buyMatch;
        const result = await executeBuyCommand(amount, token);
        onCommandExecuted(result);
        setIsProcessing(false);
        return;
      }
      
      // Check for sell command
      const sellMatch = command.match(COMMAND_PATTERNS.SELL);
      if (sellMatch) {
        const [_, amount, token] = sellMatch;
        const result = await executeSellCommand(amount, token);
        onCommandExecuted(result);
        setIsProcessing(false);
        return;
      }
      
      // Check for swap command
      const swapMatch = command.match(COMMAND_PATTERNS.SWAP);
      if (swapMatch) {
        const [_, amount, fromToken, toToken] = swapMatch;
        const result = await executeSwapCommand(amount, fromToken, toToken);
        onCommandExecuted(result);
        setIsProcessing(false);
        return;
      }
      
      // Check for price command
      const priceMatch = command.match(COMMAND_PATTERNS.PRICE);
      if (priceMatch) {
        const [_, token] = priceMatch;
        const result = await executePriceCommand(token);
        onCommandExecuted(result);
        setIsProcessing(false);
        return;
      }
      
      // Check for balance command
      const balanceMatch = command.match(COMMAND_PATTERNS.BALANCE);
      if (balanceMatch) {
        const result = await executeBalanceCommand();
        onCommandExecuted(result);
        setIsProcessing(false);
        return;
      }
      
      // Check for help command
      const helpMatch = command.match(COMMAND_PATTERNS.HELP);
      if (helpMatch) {
        const result = executeHelpCommand();
        onCommandExecuted(result);
        setIsProcessing(false);
        return;
      }
      
      // No command matched
      onCommandExecuted({
        success: false,
        message: `Command not recognized. Type 'help' for available commands.`
      });
    } catch (error) {
      console.error('Error processing command:', error);
      onCommandExecuted({
        success: false,
        message: `Error processing command: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Execute buy command
  const executeBuyCommand = async (amount: string, token: string) => {
    try {
      // Mock wallet address for demo
      const walletAddress = '0x1234567890abcdef';
      
      // Execute buy order
      const result = await okxDexClient.executeBuy(walletAddress, token, amount);
      
      if (result.success) {
        return {
          success: true,
          message: `Successfully bought ${amount} ${token}`,
          data: result
        };
      } else {
        return {
          success: false,
          message: `Failed to buy ${amount} ${token}: ${result.error || 'Unknown error'}`,
          data: result
        };
      }
    } catch (error) {
      console.error('Error executing buy command:', error);
      return {
        success: false,
        message: `Error executing buy command: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  };
  
  // Execute sell command
  const executeSellCommand = async (amount: string, token: string) => {
    try {
      // Mock wallet address for demo
      const walletAddress = '0x1234567890abcdef';
      
      // Execute sell order
      const result = await okxDexClient.executeSell(walletAddress, token, amount);
      
      if (result.success) {
        return {
          success: true,
          message: `Successfully sold ${amount} ${token}`,
          data: result
        };
      } else {
        return {
          success: false,
          message: `Failed to sell ${amount} ${token}: ${result.error || 'Unknown error'}`,
          data: result
        };
      }
    } catch (error) {
      console.error('Error executing sell command:', error);
      return {
        success: false,
        message: `Error executing sell command: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  };
  
  // Execute swap command
  const executeSwapCommand = async (amount: string, fromToken: string, toToken: string) => {
    try {
      // Mock wallet address for demo
      const walletAddress = '0x1234567890abcdef';
      
      // Get quote first
      const quote = await okxDexClient.getSwapQuote(fromToken, toToken, amount, '0.5');
      
      // Execute swap
      const result = await okxDexClient.executeSwap(walletAddress, fromToken, toToken, amount);
      
      if (result.success) {
        return {
          success: true,
          message: `Successfully swapped ${amount} ${fromToken} for approximately ${quote.toAmount} ${toToken}`,
          data: { ...result, quote }
        };
      } else {
        return {
          success: false,
          message: `Failed to swap ${amount} ${fromToken} to ${toToken}: ${result.error || 'Unknown error'}`,
          data: result
        };
      }
    } catch (error) {
      console.error('Error executing swap command:', error);
      return {
        success: false,
        message: `Error executing swap command: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  };
  
  // Execute price command
  const executePriceCommand = async (token: string) => {
    try {
      const price = await okxDexClient.getPrice(token);
      
      return {
        success: true,
        message: `Current price of ${token}: $${price}`,
        data: { token, price }
      };
    } catch (error) {
      console.error('Error executing price command:', error);
      return {
        success: false,
        message: `Error getting price for ${token}: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  };
  
  // Execute balance command
  const executeBalanceCommand = async () => {
    try {
      // Mock wallet address for demo
      const walletAddress = '0x1234567890abcdef';
      
      const balances = await okxDexClient.getBalances(walletAddress);
      
      return {
        success: true,
        message: `Your current balances:`,
        data: balances
      };
    } catch (error) {
      console.error('Error executing balance command:', error);
      return {
        success: false,
        message: `Error getting balances: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  };
  
  // Execute help command
  const executeHelpCommand = () => {
    return {
      success: true,
      message: 'Available commands:',
      data: {
        commands: [
          { command: 'buy [amount] [token]', description: 'Buy the specified amount of a token' },
          { command: 'sell [amount] [token]', description: 'Sell the specified amount of a token' },
          { command: 'swap [amount] [fromToken] to [toToken]', description: 'Swap one token for another' },
          { command: 'price [token]', description: 'Check the current price of a token' },
          { command: 'balance', description: 'Check your current token balances' },
          { command: 'help', description: 'Show this help message' }
        ]
      }
    };
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      processCommand(input.trim());
      setInput('');
    }
  };
  
  // Handle voice recognition result
  const handleVoiceResult = (transcript: string) => {
    setInput(transcript);
    processCommand(transcript);
  };
  
  // Handle voice recognition error
  const handleVoiceError = (error: string) => {
    console.error('Voice recognition error:', error);
    onCommandExecuted({
      success: false,
      message: `Voice recognition error: ${error}`
    });
  };

  return (
    <div className="command-processor">
      <div className="command-history">
        {history.map((cmd, index) => (
          <div key={index} className="history-item">
            <span className="prompt">{'>'}</span> {cmd}
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="command-input-form">
        <div className="input-wrapper">
          <span className="prompt">{'>'}</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter command (e.g., 'buy 1 SOL')"
            disabled={isProcessing}
            className="command-input"
          />
        </div>
        
        <div className="command-buttons">
          <button 
            type="submit" 
            disabled={!input.trim() || isProcessing}
            className="submit-button"
          >
            Execute
          </button>
          
          <button
            type="button"
            onClick={() => setIsListening(!isListening)}
            className={`voice-button ${isListening ? 'active' : ''}`}
          >
            {isListening ? 'Stop Listening' : 'Start Voice'}
          </button>
        </div>
      </form>
      
      {isListening && (
        <VoiceRecognition
          onResult={handleVoiceResult}
          onError={handleVoiceError}
          isListening={isListening}
        />
      )}
      
      {isProcessing && (
        <div className="processing-indicator">
          Processing command...
        </div>
      )}
    </div>
  );
};

export default CommandProcessor;
