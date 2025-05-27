import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { OKXDexClient } from '@okx-dex/okx-dex-sdk';

// Load environment variables
dotenv.config();

// Initialize Solana connection
const connection = new Connection(
  process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
  'confirmed'
);

// Initialize OKX DEX client
const okxDexClient = new OKXDexClient({
  apiKey: process.env.OKX_API_KEY || '',
  secretKey: process.env.OKX_SECRET_KEY || '',
  apiPassphrase: process.env.OKX_API_PASSPHRASE || '',
  projectId: process.env.OKX_PROJECT_ID || '',
  solana: {
    connection: {
      rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
      confirmTransactionInitialTimeout: 60000
    }
  }
});

// Create Express server
const app = express();
const port = process.env.PORT || 3003;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'trading-service' });
});

// Get market data
app.get('/api/market/ticker', async (req, res) => {
  try {
    const { fromToken, toToken } = req.query;
    
    if (!fromToken || !toToken) {
      return res.status(400).json({ error: 'Missing token parameters' });
    }
    
    // In a real implementation, this would call the OKX DEX API
    // For demo purposes, we'll return mock data
    
    const mockData = {
      price: '103.42',
      change24h: '+2.5%',
      volume24h: '1.2M',
      high24h: '105.67',
      low24h: '101.23'
    };
    
    res.status(200).json(mockData);
  } catch (error) {
    console.error('Error fetching market data:', error);
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

// Get order book
app.get('/api/market/orderbook', async (req, res) => {
  try {
    const { fromToken, toToken, depth = 10 } = req.query;
    
    if (!fromToken || !toToken) {
      return res.status(400).json({ error: 'Missing token parameters' });
    }
    
    // In a real implementation, this would call the OKX DEX API
    // For demo purposes, we'll return mock data
    
    const basePrice = 103.42;
    const mockBids = [];
    const mockAsks = [];
    
    // Generate bids (buy orders) slightly below base price
    for (let i = 0; i < depth; i++) {
      const price = (basePrice - (i * 0.02) - (Math.random() * 0.01)).toFixed(2);
      const amount = (Math.random() * 10 + 0.5).toFixed(2);
      mockBids.push({ price, amount });
    }
    
    // Generate asks (sell orders) slightly above base price
    for (let i = 0; i < depth; i++) {
      const price = (basePrice + (i * 0.02) + (Math.random() * 0.01)).toFixed(2);
      const amount = (Math.random() * 10 + 0.5).toFixed(2);
      mockAsks.push({ price, amount });
    }
    
    // Sort bids in descending order (highest price first)
    mockBids.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    
    // Sort asks in ascending order (lowest price first)
    mockAsks.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    
    res.status(200).json({
      bids: mockBids,
      asks: mockAsks
    });
  } catch (error) {
    console.error('Error fetching order book:', error);
    res.status(500).json({ error: 'Failed to fetch order book' });
  }
});

// Get historical price data
app.get('/api/market/candles', async (req, res) => {
  try {
    const { fromToken, toToken, interval = '1h', limit = 24 } = req.query;
    
    if (!fromToken || !toToken) {
      return res.status(400).json({ error: 'Missing token parameters' });
    }
    
    // In a real implementation, this would call the OKX DEX API
    // For demo purposes, we'll return mock data
    
    const candles = [];
    const now = Date.now();
    const basePrice = 103;
    
    // Generate candles based on interval
    let intervalMs;
    switch (interval) {
      case '1h':
        intervalMs = 60 * 60 * 1000;
        break;
      case '1d':
        intervalMs = 24 * 60 * 60 * 1000;
        break;
      case '1w':
        intervalMs = 7 * 24 * 60 * 60 * 1000;
        break;
      case '1m':
        intervalMs = 30 * 24 * 60 * 60 * 1000;
        break;
      default:
        intervalMs = 60 * 60 * 1000;
    }
    
    for (let i = 0; i < limit; i++) {
      const timestamp = now - (i * intervalMs);
      const volatility = interval === '1h' ? 0.5 : interval === '1d' ? 1 : interval === '1w' ? 2 : 3;
      const trend = interval === '1h' ? 0.02 : interval === '1d' ? 0.05 : interval === '1w' ? 0.2 : 0.3;
      const randomFactor = (Math.random() - 0.5) * volatility;
      const trendFactor = i * trend;
      
      // Add some sine wave pattern for realism
      const sineWave = Math.sin(i / (limit / 3)) * (volatility / 2);
      
      const open = basePrice + randomFactor + trendFactor + sineWave;
      const close = open + (Math.random() - 0.5) * (volatility / 2);
      const high = Math.max(open, close) + Math.random() * (volatility / 4);
      const low = Math.min(open, close) - Math.random() * (volatility / 4);
      const volume = Math.random() * 100 + 50;
      
      candles.push({
        timestamp,
        open: open.toFixed(2),
        high: high.toFixed(2),
        low: low.toFixed(2),
        close: close.toFixed(2),
        volume: volume.toFixed(2)
      });
    }
    
    // Sort candles by timestamp (oldest first)
    candles.sort((a, b) => a.timestamp - b.timestamp);
    
    res.status(200).json(candles);
  } catch (error) {
    console.error('Error fetching candles:', error);
    res.status(500).json({ error: 'Failed to fetch candles' });
  }
});

// Get quote for token swap
app.get('/api/trade/quote', async (req, res) => {
  try {
    const { fromToken, toToken, amount, slippage = '0.5' } = req.query;
    
    if (!fromToken || !toToken || !amount) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // In a real implementation, this would call the OKX DEX API
    // For demo purposes, we'll return mock data
    
    let rate;
    if (fromToken === 'USDC' && toToken === 'SOL') {
      rate = 1 / 103.42; // 1 USDC = 0.00967 SOL
    } else if (fromToken === 'SOL' && toToken === 'USDC') {
      rate = 103.42; // 1 SOL = 103.42 USDC
    } else if (fromToken === 'USDT' && toToken === 'SOL') {
      rate = 1 / 103.38; // 1 USDT = 0.00967 SOL
    } else if (fromToken === 'SOL' && toToken === 'USDT') {
      rate = 103.38; // 1 SOL = 103.38 USDT
    } else if (fromToken === 'USDC' && toToken === 'USDT') {
      rate = 0.9996; // 1 USDC = 0.9996 USDT
    } else if (fromToken === 'USDT' && toToken === 'USDC') {
      rate = 1.0004; // 1 USDT = 1.0004 USDC
    } else {
      rate = 1;
    }
    
    const estimatedAmount = parseFloat(amount) * rate;
    const minAmount = estimatedAmount * (1 - parseFloat(slippage) / 100);
    
    res.status(200).json({
      fromToken,
      toToken,
      fromAmount: amount,
      toAmount: estimatedAmount.toFixed(6),
      minAmount: minAmount.toFixed(6),
      rate: rate.toFixed(6),
      slippage,
      fee: '0.3%',
      expiresAt: Date.now() + 30000 // 30 seconds
    });
  } catch (error) {
    console.error('Error getting quote:', error);
    res.status(500).json({ error: 'Failed to get quote' });
  }
});

// Execute token swap
app.post('/api/trade/swap', async (req, res) => {
  try {
    const { fromToken, toToken, amount, slippage = '0.5', walletAddress } = req.body;
    
    if (!fromToken || !toToken || !amount || !walletAddress) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // In a real implementation, this would call the OKX DEX API
    // For demo purposes, we'll return mock data
    
    let rate;
    if (fromToken === 'USDC' && toToken === 'SOL') {
      rate = 1 / 103.42; // 1 USDC = 0.00967 SOL
    } else if (fromToken === 'SOL' && toToken === 'USDC') {
      rate = 103.42; // 1 SOL = 103.42 USDC
    } else if (fromToken === 'USDT' && toToken === 'SOL') {
      rate = 1 / 103.38; // 1 USDT = 0.00967 SOL
    } else if (fromToken === 'SOL' && toToken === 'USDT') {
      rate = 103.38; // 1 SOL = 103.38 USDT
    } else if (fromToken === 'USDC' && toToken === 'USDT') {
      rate = 0.9996; // 1 USDC = 0.9996 USDT
    } else if (fromToken === 'USDT' && toToken === 'USDC') {
      rate = 1.0004; // 1 USDT = 1.0004 USDC
    } else {
      rate = 1;
    }
    
    const estimatedAmount = parseFloat(amount) * rate;
    
    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    res.status(200).json({
      txId: Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10),
      fromToken,
      toToken,
      fromAmount: amount,
      toAmount: estimatedAmount.toFixed(6),
      rate: rate.toFixed(6),
      fee: (parseFloat(amount) * 0.003).toFixed(6),
      timestamp: Date.now(),
      status: 'confirmed'
    });
  } catch (error) {
    console.error('Error executing swap:', error);
    res.status(500).json({ error: 'Failed to execute swap' });
  }
});

// Get token balance
app.get('/api/wallet/balance', async (req, res) => {
  try {
    const { walletAddress } = req.query;
    
    if (!walletAddress) {
      return res.status(400).json({ error: 'Missing wallet address' });
    }
    
    // In a real implementation, this would call the Solana API
    // For demo purposes, we'll return mock data
    
    res.status(200).json({
      SOL: '12.45',
      USDC: '1245.67',
      USDT: '523.89'
    });
  } catch (error) {
    console.error('Error getting balance:', error);
    res.status(500).json({ error: 'Failed to get balance' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(port, () => {
  console.log(`Trading Service listening on port ${port}`);
});

export default app;
