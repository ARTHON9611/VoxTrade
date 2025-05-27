import React, { useState, useEffect } from 'react';
import { ModalityType } from '../../types/modality';
import VoiceRecognition from '../../components/voice/VoiceRecognition';
import { okxDexClient } from '../../api/okxDexClient';

interface VoiceInterfaceProps {
  onCommandExecuted: (result: { success: boolean; message: string; data?: any }) => void;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ onCommandExecuted }) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Command patterns for voice recognition
  const COMMAND_PATTERNS = {
    BUY: /buy\s+(\d+(?:\.\d+)?)\s+(SOL|USDC|USDT|BTC|ETH)/i,
    SELL: /sell\s+(\d+(?:\.\d+)?)\s+(SOL|USDC|USDT|BTC|ETH)/i,
    SWAP: /swap\s+(\d+(?:\.\d+)?)\s+(SOL|USDC|USDT|BTC|ETH)\s+(?:for|to)\s+(SOL|USDC|USDT|BTC|ETH)/i,
    PRICE: /(?:get|check|what is|what's)?\s*(?:the)?\s*price\s+(?:of\s+)?(SOL|USDC|USDT|BTC|ETH)/i,
    BALANCE: /(?:get|check|what is|what's)?\s*(?:my)?\s*balance/i,
    HELP: /(?:help|commands|what can you do)/i,
  };

  // Process voice command
  const processVoiceCommand = async (command: string) => {
    setIsProcessing(true);
    setFeedback(`Processing: "${command}"`);
    
    try {
      // Check for buy command
      const buyMatch = command.match(COMMAND_PATTERNS.BUY);
      if (buyMatch) {
        const [_, amount, token] = buyMatch;
        const result = await executeBuyCommand(amount, token);
        onCommandExecuted(result);
        setFeedback(result.message);
        setIsProcessing(false);
        return;
      }
      
      // Check for sell command
      const sellMatch = command.match(COMMAND_PATTERNS.SELL);
      if (sellMatch) {
        const [_, amount, token] = sellMatch;
        const result = await executeSellCommand(amount, token);
        onCommandExecuted(result);
        setFeedback(result.message);
        setIsProcessing(false);
        return;
      }
      
      // Check for swap command
      const swapMatch = command.match(COMMAND_PATTERNS.SWAP);
      if (swapMatch) {
        const [_, amount, fromToken, toToken] = swapMatch;
        const result = await executeSwapCommand(amount, fromToken, toToken);
        onCommandExecuted(result);
        setFeedback(result.message);
        setIsProcessing(false);
        return;
      }
      
      // Check for price command
      const priceMatch = command.match(COMMAND_PATTERNS.PRICE);
      if (priceMatch) {
        const [_, token] = priceMatch;
        const result = await executePriceCommand(token);
        onCommandExecuted(result);
        setFeedback(result.message);
        setIsProcessing(false);
        return;
      }
      
      // Check for balance command
      const balanceMatch = command.match(COMMAND_PATTERNS.BALANCE);
      if (balanceMatch) {
        const result = await executeBalanceCommand();
        onCommandExecuted(result);
        setFeedback(result.message);
        setIsProcessing(false);
        return;
      }
      
      // Check for help command
      const helpMatch = command.match(COMMAND_PATTERNS.HELP);
      if (helpMatch) {
        const result = executeHelpCommand();
        onCommandExecuted(result);
        setFeedback(result.message);
        setIsProcessing(false);
        return;
      }
      
      // No command matched
      setFeedback(`Sorry, I didn't understand that command. Try saying "help" for available commands.`);
      onCommandExecuted({
        success: false,
        message: `Command not recognized: "${command}"`
      });
    } catch (error) {
      console.error('Error processing voice command:', error);
      setFeedback(`Error processing command: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      
      // Format balances for voice response
      let balanceMessage = 'Your current balances are: ';
      for (const [token, amount] of Object.entries(balances)) {
        if (parseFloat(amount) > 0) {
          balanceMessage += `${amount} ${token}, `;
        }
      }
      
      return {
        success: true,
        message: balanceMessage.slice(0, -2), // Remove trailing comma and space
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
    const helpMessage = `
      You can say commands like:
      "Buy 1 SOL"
      "Sell 0.5 BTC"
      "Swap 100 USDC to SOL"
      "Price of ETH"
      "Check my balance"
    `;
    
    return {
      success: true,
      message: helpMessage,
      data: {
        commands: [
          { command: 'Buy [amount] [token]', description: 'Buy the specified amount of a token' },
          { command: 'Sell [amount] [token]', description: 'Sell the specified amount of a token' },
          { command: 'Swap [amount] [fromToken] to [toToken]', description: 'Swap one token for another' },
          { command: 'Price of [token]', description: 'Check the current price of a token' },
          { command: 'Check my balance', description: 'Check your current token balances' },
          { command: 'Help', description: 'Show this help message' }
        ]
      }
    };
  };

  // Handle voice recognition result
  const handleVoiceResult = (result: string) => {
    setTranscript(result);
    processVoiceCommand(result);
  };
  
  // Handle voice recognition error
  const handleVoiceError = (error: string) => {
    console.error('Voice recognition error:', error);
    setFeedback(`Voice recognition error: ${error}`);
    onCommandExecuted({
      success: false,
      message: `Voice recognition error: ${error}`
    });
  };

  return (
    <div className="voice-interface">
      <div className="voice-status">
        <h2>Voice Interface</h2>
        <p className="status-text">
          {isListening ? 'Listening...' : 'Click the microphone to start'}
        </p>
      </div>
      
      <div className="voice-controls">
        <button
          className={`microphone-button ${isListening ? 'active' : ''} ${isProcessing ? 'processing' : ''}`}
          onClick={() => setIsListening(!isListening)}
          disabled={isProcessing}
        >
          {isListening ? 'Stop' : 'Start'}
        </button>
      </div>
      
      {transcript && (
        <div className="transcript">
          <h3>You said:</h3>
          <p>{transcript}</p>
        </div>
      )}
      
      {feedback && (
        <div className="feedback">
          <h3>Response:</h3>
          <p>{feedback}</p>
        </div>
      )}
      
      <VoiceRecognition
        onResult={handleVoiceResult}
        onError={handleVoiceError}
        isListening={isListening}
      />
      
      <div className="voice-help">
        <h3>Try saying:</h3>
        <ul>
          <li>"Buy 1 SOL"</li>
          <li>"Sell 0.5 BTC"</li>
          <li>"Swap 100 USDC to SOL"</li>
          <li>"Price of ETH"</li>
          <li>"Check my balance"</li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceInterface;
