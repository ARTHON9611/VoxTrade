import axios from 'axios';
import { config } from '../config';

// Market data API endpoints
const BASE_URL = 'https://web3.okx.com/api/v1';

// Get market data for a specific trading pair
export const getMarketData = async (fromToken: string, toToken: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/market/ticker`, {
      params: {
        fromToken,
        toToken
      },
      headers: {
        'OKX-API-KEY': config.OKX_API_KEY,
        'OKX-API-PASSPHRASE': config.OKX_API_PASSPHRASE
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
};

// Get order book data
export const getOrderBook = async (fromToken: string, toToken: string, depth: number = 10) => {
  try {
    const response = await axios.get(`${BASE_URL}/market/orderbook`, {
      params: {
        fromToken,
        toToken,
        depth
      },
      headers: {
        'OKX-API-KEY': config.OKX_API_KEY,
        'OKX-API-PASSPHRASE': config.OKX_API_PASSPHRASE
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching order book:', error);
    throw error;
  }
};

// Get historical price data
export const getHistoricalPrices = async (
  fromToken: string, 
  toToken: string, 
  interval: string = '1h',
  limit: number = 24
) => {
  try {
    const response = await axios.get(`${BASE_URL}/market/candles`, {
      params: {
        fromToken,
        toToken,
        interval,
        limit
      },
      headers: {
        'OKX-API-KEY': config.OKX_API_KEY,
        'OKX-API-PASSPHRASE': config.OKX_API_PASSPHRASE
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching historical prices:', error);
    throw error;
  }
};

// Get recent trades
export const getRecentTrades = async (fromToken: string, toToken: string, limit: number = 10) => {
  try {
    const response = await axios.get(`${BASE_URL}/market/trades`, {
      params: {
        fromToken,
        toToken,
        limit
      },
      headers: {
        'OKX-API-KEY': config.OKX_API_KEY,
        'OKX-API-PASSPHRASE': config.OKX_API_PASSPHRASE
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching recent trades:', error);
    throw error;
  }
};
