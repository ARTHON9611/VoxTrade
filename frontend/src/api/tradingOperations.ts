import axios from 'axios';
import { config } from '../config';

// Trading operations API endpoints
const BASE_URL = 'https://web3.okx.com/api/v1';

// Execute a trade
export const executeTrade = async (
  fromToken: string,
  toToken: string,
  amount: string,
  type: 'buy' | 'sell',
  price?: string
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/trade/order`,
      {
        fromToken,
        toToken,
        amount,
        type,
        price
      },
      {
        headers: {
          'OKX-API-KEY': config.OKX_API_KEY,
          'OKX-API-SECRET': config.OKX_SECRET_KEY,
          'OKX-API-PASSPHRASE': config.OKX_API_PASSPHRASE
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error executing trade:', error);
    throw error;
  }
};

// Get order status
export const getOrderStatus = async (orderId: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/trade/order/${orderId}`, {
      headers: {
        'OKX-API-KEY': config.OKX_API_KEY,
        'OKX-API-SECRET': config.OKX_SECRET_KEY,
        'OKX-API-PASSPHRASE': config.OKX_API_PASSPHRASE
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting order status:', error);
    throw error;
  }
};

// Cancel order
export const cancelOrder = async (orderId: string) => {
  try {
    const response = await axios.delete(`${BASE_URL}/trade/order/${orderId}`, {
      headers: {
        'OKX-API-KEY': config.OKX_API_KEY,
        'OKX-API-SECRET': config.OKX_SECRET_KEY,
        'OKX-API-PASSPHRASE': config.OKX_API_PASSPHRASE
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error canceling order:', error);
    throw error;
  }
};

// Get user's open orders
export const getOpenOrders = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/trade/orders/open`, {
      headers: {
        'OKX-API-KEY': config.OKX_API_KEY,
        'OKX-API-SECRET': config.OKX_SECRET_KEY,
        'OKX-API-PASSPHRASE': config.OKX_API_PASSPHRASE
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting open orders:', error);
    throw error;
  }
};

// Get user's order history
export const getOrderHistory = async (limit: number = 10) => {
  try {
    const response = await axios.get(`${BASE_URL}/trade/orders/history`, {
      params: { limit },
      headers: {
        'OKX-API-KEY': config.OKX_API_KEY,
        'OKX-API-SECRET': config.OKX_SECRET_KEY,
        'OKX-API-PASSPHRASE': config.OKX_API_PASSPHRASE
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error getting order history:', error);
    throw error;
  }
};
