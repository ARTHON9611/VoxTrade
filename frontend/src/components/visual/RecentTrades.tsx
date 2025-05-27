import React, { useState, useEffect } from 'react';
import { okxDexClient } from '../../api/okxDexClient';
import { Trade } from '../../types/modality';

interface RecentTradesProps {
  symbol: string;
}

const RecentTrades: React.FC<RecentTradesProps> = ({ symbol }) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch recent trades
  useEffect(() => {
    const fetchRecentTrades = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const recentTrades = await okxDexClient.getRecentTrades(`${symbol}/USDT`);
        setTrades(recentTrades);
      } catch (err) {
        console.error('Error fetching recent trades:', err);
        setError('Failed to load recent trades. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecentTrades();
    
    // Refresh trades every 10 seconds
    const intervalId = setInterval(fetchRecentTrades, 10000);
    
    return () => clearInterval(intervalId);
  }, [symbol]);

  if (isLoading && trades.length === 0) {
    return (
      <div className="recent-trades-loading">
        <div className="spinner"></div>
        <p>Loading recent trades...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recent-trades-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="recent-trades">
      <h2>Recent Trades</h2>
      
      <div className="trades-list">
        <div className="trades-header">
          <div className="price-header">Price</div>
          <div className="amount-header">Amount</div>
          <div className="time-header">Time</div>
        </div>
        
        <div className="trades-content">
          {trades.map((trade) => (
            <div 
              key={trade.id} 
              className={`trade-row ${trade.type === 'buy' ? 'buy' : 'sell'}`}
            >
              <div className="price">{trade.price}</div>
              <div className="amount">{trade.amount}</div>
              <div className="time">{trade.timeAgo}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentTrades;
