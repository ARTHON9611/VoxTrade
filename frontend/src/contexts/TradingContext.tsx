import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Trade, Transaction } from '../types/modality';
import { config } from '../config';

interface TradingContextType {
  balances: Record<string, string>;
  orderHistory: Transaction[];
  recentTrades: Trade[];
  isLoading: boolean;
  error: string | null;
  loadBalances: (walletAddress: string) => Promise<void>;
  loadOrderHistory: (walletAddress: string) => Promise<void>;
  loadRecentTrades: (market: string) => Promise<void>;
  executeSwap: (walletAddress: string, fromToken: string, toToken: string, amount: string) => Promise<{ success: boolean; error?: string }>;
  getSwapQuote: (fromToken: string, toToken: string, amount: string, slippage: string) => Promise<{ toAmount: string; rate: string; minAmount: string; fee: string }>;
  processBuyCommand: (command: string) => Promise<{ success: boolean; error?: string }>;
  processSellCommand: (command: string) => Promise<{ success: boolean; error?: string }>;
  processSwapCommand: (command: string) => Promise<{ success: boolean; error?: string }>;
  processPriceCommand: (command: string) => Promise<string>;
  processBalanceCommand: (command: string) => Promise<Record<string, string>>;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export const TradingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [balances, setBalances] = useState<Record<string, string>>({});
  const [orderHistory, setOrderHistory] = useState<Transaction[]>([]);
  const [recentTrades, setRecentTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Load balances for a wallet
  const loadBalances = async (walletAddress: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would call the OKX DEX API
      // For demo purposes, we'll use mock data
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock balances
      const mockBalances: Record<string, string> = {
        'SOL': '12.45',
        'USDC': '1250.00',
        'BTC': '0.025',
        'ETH': '0.75'
      };
      
      setBalances(mockBalances);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load balances');
      console.error('Error loading balances:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load order history for a wallet
  const loadOrderHistory = async (walletAddress: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would call the OKX DEX API
      // For demo purposes, we'll use mock data
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock order history
      const mockOrderHistory: Transaction[] = [
        {
          id: '1',
          type: 'buy',
          amount: '0.5',
          token: 'SOL',
          price: '103.42',
          status: 'completed',
          timestamp: '2025-05-26T08:30:45Z',
          timeAgo: '1h ago'
        },
        {
          id: '2',
          type: 'sell',
          amount: '100',
          token: 'USDC',
          price: '1.00',
          status: 'completed',
          timestamp: '2025-05-26T07:15:22Z',
          timeAgo: '2h ago'
        },
        {
          id: '3',
          type: 'swap',
          amount: '50',
          token: 'USDC',
          toAmount: '0.48',
          toToken: 'SOL',
          status: 'completed',
          timestamp: '2025-05-25T22:45:11Z',
          timeAgo: '12h ago'
        }
      ];
      
      setOrderHistory(mockOrderHistory);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load order history');
      console.error('Error loading order history:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load recent trades for a market
  const loadRecentTrades = async (market: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would call the OKX DEX API
      // For demo purposes, we'll use mock data
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock trades
      const mockTrades: Trade[] = [];
      const [baseToken, quoteToken] = market.split('/');
      const basePrice = baseToken === 'SOL' ? 103.42 : 
                       baseToken === 'BTC' ? 62145.78 : 
                       baseToken === 'ETH' ? 3421.56 : 1.00;
      
      // Generate 10 random trades
      for (let i = 0; i < 10; i++) {
        const isBuy = Math.random() > 0.5;
        const priceVariation = (Math.random() - 0.5) * 0.01 * basePrice; // ±0.5% variation
        const price = (basePrice + priceVariation).toFixed(2);
        const amount = (Math.random() * 5 + 0.1).toFixed(3);
        const minutesAgo = Math.floor(Math.random() * 60);
        
        mockTrades.push({
          id: `trade_${i}`,
          type: isBuy ? 'buy' : 'sell',
          price,
          amount,
          total: (parseFloat(price) * parseFloat(amount)).toFixed(2),
          timeAgo: minutesAgo === 0 ? 'Just now' : `${minutesAgo}m ago`
        });
      }
      
      setRecentTrades(mockTrades);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load recent trades');
      console.error('Error loading recent trades:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Execute a swap
  const executeSwap = async (walletAddress: string, fromToken: string, toToken: string, amount: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would call the OKX DEX API
      // For demo purposes, we'll simulate a successful swap
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update balances to reflect the swap
      const fromAmount = parseFloat(amount);
      const toAmount = fromToken === 'USDC' ? fromAmount / 103.42 : fromAmount * 103.42;
      
      setBalances(prev => ({
        ...prev,
        [fromToken]: (parseFloat(prev[fromToken] || '0') - fromAmount).toFixed(2),
        [toToken]: (parseFloat(prev[toToken] || '0') + toAmount).toFixed(2)
      }));
      
      // Add to order history
      const newTransaction: Transaction = {
        id: `tx_${Date.now()}`,
        type: 'swap',
        amount,
        token: fromToken,
        toAmount: toAmount.toFixed(2),
        toToken,
        status: 'completed',
        timestamp: new Date().toISOString(),
        timeAgo: 'Just now'
      };
      
      setOrderHistory(prev => [newTransaction, ...prev]);
      
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Swap failed';
      setError(errorMessage);
      console.error('Error executing swap:', err);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get a swap quote
  const getSwapQuote = async (fromToken: string, toToken: string, amount: string, slippage: string): Promise<{ toAmount: string; rate: string; minAmount: string; fee: string }> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would call the OKX DEX API
      // For demo purposes, we'll use mock data
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock exchange rates
      const rates: Record<string, Record<string, number>> = {
        'SOL': { 'USDC': 103.42, 'BTC': 0.00166, 'ETH': 0.0302 },
        'USDC': { 'SOL': 0.00967, 'BTC': 0.000016, 'ETH': 0.000292 },
        'BTC': { 'SOL': 602.41, 'USDC': 62145.78, 'ETH': 18.16 },
        'ETH': { 'SOL': 33.17, 'USDC': 3421.56, 'BTC': 0.055 }
      };
      
      const rate = rates[fromToken]?.[toToken] || 0;
      const fromAmount = parseFloat(amount);
      const toAmount = fromAmount * rate;
      const slippagePercent = parseFloat(slippage) / 100;
      const minAmount = toAmount * (1 - slippagePercent);
      const fee = (fromAmount * 0.001).toFixed(6); // 0.1% fee
      
      return {
        toAmount: toAmount.toFixed(6),
        rate: rate.toString(),
        minAmount: minAmount.toFixed(6),
        fee: `${fee} ${fromToken}`
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get swap quote');
      console.error('Error getting swap quote:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Process buy command from voice or text interface
  const processBuyCommand = async (command: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Parse command to extract amount and token
      // Example: "Buy 0.5 SOL"
      const match = command.match(/buy\s+(\d+\.?\d*)\s+(\w+)/i);
      
      if (!match) {
        return { success: false, error: 'Invalid buy command format. Try "Buy [amount] [token]"' };
      }
      
      const amount = match[1];
      const token = match[2].toUpperCase();
      
      // Check if token is supported
      if (!config.supportedTokens.includes(token)) {
        return { success: false, error: `Unsupported token: ${token}` };
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update balances to reflect the purchase
      const tokenAmount = parseFloat(amount);
      const usdcAmount = token === 'USDC' ? tokenAmount : tokenAmount * 103.42;
      
      setBalances(prev => ({
        ...prev,
        [token]: (parseFloat(prev[token] || '0') + tokenAmount).toFixed(2),
        'USDC': (parseFloat(prev['USDC'] || '0') - usdcAmount).toFixed(2)
      }));
      
      // Add to order history
      const newTransaction: Transaction = {
        id: `tx_${Date.now()}`,
        type: 'buy',
        amount,
        token,
        price: token === 'USDC' ? '1.00' : '103.42',
        status: 'completed',
        timestamp: new Date().toISOString(),
        timeAgo: 'Just now'
      };
      
      setOrderHistory(prev => [newTransaction, ...prev]);
      
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Buy command failed';
      setError(errorMessage);
      console.error('Error processing buy command:', err);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Process sell command from voice or text interface
  const processSellCommand = async (command: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Parse command to extract amount and token
      // Example: "Sell 0.5 SOL"
      const match = command.match(/sell\s+(\d+\.?\d*)\s+(\w+)/i);
      
      if (!match) {
        return { success: false, error: 'Invalid sell command format. Try "Sell [amount] [token]"' };
      }
      
      const amount = match[1];
      const token = match[2].toUpperCase();
      
      // Check if token is supported
      if (!config.supportedTokens.includes(token)) {
        return { success: false, error: `Unsupported token: ${token}` };
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update balances to reflect the sale
      const tokenAmount = parseFloat(amount);
      const usdcAmount = token === 'USDC' ? tokenAmount : tokenAmount * 103.42;
      
      setBalances(prev => ({
        ...prev,
        [token]: (parseFloat(prev[token] || '0') - tokenAmount).toFixed(2),
        'USDC': (parseFloat(prev['USDC'] || '0') + usdcAmount).toFixed(2)
      }));
      
      // Add to order history
      const newTransaction: Transaction = {
        id: `tx_${Date.now()}`,
        type: 'sell',
        amount,
        token,
        price: token === 'USDC' ? '1.00' : '103.42',
        status: 'completed',
        timestamp: new Date().toISOString(),
        timeAgo: 'Just now'
      };
      
      setOrderHistory(prev => [newTransaction, ...prev]);
      
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sell command failed';
      setError(errorMessage);
      console.error('Error processing sell command:', err);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Process swap command from voice or text interface
  const processSwapCommand = async (command: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Parse command to extract amount, from token, and to token
      // Example: "Swap 50 USDC to SOL"
      const match = command.match(/swap\s+(\d+\.?\d*)\s+(\w+)\s+to\s+(\w+)/i);
      
      if (!match) {
        return { success: false, error: 'Invalid swap command format. Try "Swap [amount] [fromToken] to [toToken]"' };
      }
      
      const amount = match[1];
      const fromToken = match[2].toUpperCase();
      const toToken = match[3].toUpperCase();
      
      // Check if tokens are supported
      if (!config.supportedTokens.includes(fromToken) || !config.supportedTokens.includes(toToken)) {
        return { success: false, error: 'Unsupported token in swap command' };
      }
      
      // Execute the swap
      return await executeSwap('demo_wallet_address', fromToken, toToken, amount);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Swap command failed';
      setError(errorMessage);
      console.error('Error processing swap command:', err);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Process price command from voice or text interface
  const processPriceCommand = async (command: string): Promise<string> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Parse command to extract token
      // Example: "Price of SOL" or "What is the price of SOL"
      const match = command.match(/price\s+(?:of\s+)?(\w+)/i);
      
      if (!match) {
        throw new Error('Invalid price command format. Try "Price of [token]"');
      }
      
      const token = match[1].toUpperCase();
      
      // Check if token is supported
      if (!config.supportedTokens.includes(token)) {
        throw new Error(`Unsupported token: ${token}`);
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock prices
      const prices: Record<string, string> = {
        'SOL': '$103.42',
        'BTC': '$62,145.78',
        'ETH': '$3,421.56',
        'USDC': '$1.00',
        'USDT': '$1.00'
      };
      
      return prices[token] || 'Price not available';
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Price command failed';
      setError(errorMessage);
      console.error('Error processing price command:', err);
      return errorMessage;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Process balance command from voice or text interface
  const processBalanceCommand = async (command: string): Promise<Record<string, string>> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return current balances
      return balances;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Balance command failed';
      setError(errorMessage);
      console.error('Error processing balance command:', err);
      return {};
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initialize with demo data
  useEffect(() => {
    loadBalances('demo_wallet_address');
    loadOrderHistory('demo_wallet_address');
    loadRecentTrades('SOL/USDC');
  }, []);
  
  const value = {
    balances,
    orderHistory,
    recentTrades,
    isLoading,
    error,
    loadBalances,
    loadOrderHistory,
    loadRecentTrades,
    executeSwap,
    getSwapQuote,
    processBuyCommand,
    processSellCommand,
    processSwapCommand,
    processPriceCommand,
    processBalanceCommand
  };
  
  return <TradingContext.Provider value={value}>{children}</TradingContext.Provider>;
};

export const useTrading = (): TradingContextType => {
  const context = useContext(TradingContext);
  if (context === undefined) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  return context;
};
