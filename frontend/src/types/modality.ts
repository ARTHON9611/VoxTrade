export enum ModalityType {
  Visual = 'visual',
  Voice = 'voice',
  Text = 'text'
}

export interface User {
  id: string;
  name: string;
  email?: string;
  walletAddress?: string;
}

export interface Trade {
  id: string;
  type: 'buy' | 'sell';
  price: string;
  amount: string;
  total: string;
  timeAgo: string;
}

export interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'swap';
  amount: string;
  token: string;
  price?: string;
  toAmount?: string;
  toToken?: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  timeAgo: string;
}

export interface TokenBalance {
  token: string;
  amount: string;
  value: string;
}

export interface SwapQuote {
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  rate: string;
  minReceived: string;
  fee: string;
  slippage: string;
}

export interface OrderBookEntry {
  price: string;
  amount: string;
  total: string;
}

export interface OrderBook {
  asks: OrderBookEntry[];
  bids: OrderBookEntry[];
}

export interface ChartData {
  time: string;
  price: number;
  volume?: number;
}

export interface EnvironmentContext {
  isMoving: boolean;
  isLoudEnvironment: boolean;
  isHandsFree: boolean;
  isScreenVisible: boolean;
}

export interface CommandResult {
  success: boolean;
  message: string;
  data?: any;
}
