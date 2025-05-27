import React, { useState, useEffect } from 'react';
import { okxDexClient } from '../../api/okxDexClient';
import { ChartData } from '../../types/modality';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TradingChartProps {
  symbol: string;
  timeframe: string;
}

const TradingChart: React.FC<TradingChartProps> = ({ symbol, timeframe }) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real implementation, we would fetch historical data from the OKX API
        // For now, we'll generate mock data
        const mockData = generateMockChartData(symbol, timeframe);
        setChartData(mockData);
      } catch (err) {
        console.error('Error fetching chart data:', err);
        setError('Failed to load chart data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchChartData();
    
    // Set up polling for real-time updates
    const intervalId = setInterval(fetchChartData, getPollingInterval(timeframe));
    
    return () => clearInterval(intervalId);
  }, [symbol, timeframe]);
  
  // Get appropriate polling interval based on timeframe
  const getPollingInterval = (tf: string): number => {
    switch (tf) {
      case '1m': return 10000; // 10 seconds
      case '5m': return 30000; // 30 seconds
      case '15m': return 60000; // 1 minute
      case '1h': return 300000; // 5 minutes
      case '4h': return 600000; // 10 minutes
      case '1d': return 1800000; // 30 minutes
      default: return 60000; // 1 minute default
    }
  };
  
  // Generate mock chart data
  const generateMockChartData = (symbol: string, tf: string): ChartData[] => {
    const now = new Date();
    const data: ChartData[] = [];
    const points = 100;
    
    // Base price based on symbol
    let basePrice = 0;
    switch (symbol.toUpperCase()) {
      case 'SOL':
        basePrice = 103.42;
        break;
      case 'BTC':
        basePrice = 62145.78;
        break;
      case 'ETH':
        basePrice = 3421.56;
        break;
      case 'USDC':
      case 'USDT':
        basePrice = 1.00;
        break;
      default:
        basePrice = 100.00;
    }
    
    // Volatility based on timeframe
    let volatility = 0;
    switch (tf) {
      case '1m': volatility = 0.001; break;
      case '5m': volatility = 0.003; break;
      case '15m': volatility = 0.005; break;
      case '1h': volatility = 0.01; break;
      case '4h': volatility = 0.02; break;
      case '1d': volatility = 0.03; break;
      default: volatility = 0.01;
    }
    
    // Time interval in milliseconds
    let interval = 0;
    switch (tf) {
      case '1m': interval = 60 * 1000; break;
      case '5m': interval = 5 * 60 * 1000; break;
      case '15m': interval = 15 * 60 * 1000; break;
      case '1h': interval = 60 * 60 * 1000; break;
      case '4h': interval = 4 * 60 * 60 * 1000; break;
      case '1d': interval = 24 * 60 * 60 * 1000; break;
      default: interval = 60 * 60 * 1000;
    }
    
    // Generate data points
    let currentPrice = basePrice;
    for (let i = points - 1; i >= 0; i--) {
      const time = new Date(now.getTime() - (i * interval));
      
      // Random walk with trend
      const trend = Math.sin(i / 10) * volatility * basePrice * 0.5;
      const randomWalk = (Math.random() - 0.5) * 2 * volatility * basePrice;
      currentPrice = currentPrice + trend + randomWalk;
      
      // Ensure price doesn't go negative
      if (currentPrice <= 0) {
        currentPrice = basePrice * 0.1;
      }
      
      // Generate volume
      const volume = Math.random() * basePrice * 10;
      
      data.push({
        time: time.toLocaleTimeString(),
        price: currentPrice,
        volume: volume
      });
    }
    
    return data;
  };
  
  // Format tooltip values
  const formatTooltip = (value: number, name: string) => {
    if (name === 'price') {
      return [`$${value.toFixed(2)}`, 'Price'];
    }
    if (name === 'volume') {
      return [`$${value.toFixed(2)}`, 'Volume'];
    }
    return [value, name];
  };

  if (isLoading && chartData.length === 0) {
    return (
      <div className="trading-chart-loading">
        <div className="spinner"></div>
        <p>Loading chart data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="trading-chart-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="trading-chart">
      <div className="chart-header">
        <h2>{symbol} Price Chart</h2>
        <div className="chart-info">
          <span className="timeframe">{timeframe}</span>
          <span className="price">
            ${chartData.length > 0 ? chartData[chartData.length - 1].price.toFixed(2) : '0.00'}
          </span>
        </div>
      </div>
      
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip formatter={formatTooltip} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#8884d8" 
              activeDot={{ r: 8 }} 
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="chart-controls">
        <div className="timeframe-selector">
          <button className={timeframe === '5m' ? 'active' : ''}>5m</button>
          <button className={timeframe === '15m' ? 'active' : ''}>15m</button>
          <button className={timeframe === '1h' ? 'active' : ''}>1h</button>
          <button className={timeframe === '4h' ? 'active' : ''}>4h</button>
          <button className={timeframe === '1d' ? 'active' : ''}>1d</button>
          <button className={timeframe === '1w' ? 'active' : ''}>1w</button>
        </div>
      </div>
    </div>
  );
};

export default TradingChart;
