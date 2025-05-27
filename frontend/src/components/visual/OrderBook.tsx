import React, { useState, useEffect } from 'react';
import { okxDexClient } from '../../api/okxDexClient';
import { OrderBook, OrderBookEntry } from '../../types/modality';

interface OrderBookProps {
  symbol: string;
}

const OrderBookComponent: React.FC<OrderBookProps> = ({ symbol }) => {
  const [orderBook, setOrderBook] = useState<OrderBook>({ asks: [], bids: [] });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState<number>(10);

  // Fetch order book data
  useEffect(() => {
    const fetchOrderBook = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real implementation, we would fetch order book from the OKX API
        // For now, we'll generate mock data
        const mockOrderBook = generateMockOrderBook(symbol);
        setOrderBook(mockOrderBook);
      } catch (err) {
        console.error('Error fetching order book:', err);
        setError('Failed to load order book. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrderBook();
    
    // Refresh order book every 5 seconds
    const intervalId = setInterval(fetchOrderBook, 5000);
    
    return () => clearInterval(intervalId);
  }, [symbol]);
  
  // Generate mock order book data
  const generateMockOrderBook = (symbol: string): OrderBook => {
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
    
    const asks: OrderBookEntry[] = [];
    const bids: OrderBookEntry[] = [];
    
    // Generate asks (sell orders)
    for (let i = 0; i < 20; i++) {
      const price = (basePrice * (1 + (i + 1) * 0.001)).toFixed(2);
      const amount = (Math.random() * 10 + 0.1).toFixed(4);
      const total = (parseFloat(price) * parseFloat(amount)).toFixed(2);
      
      asks.push({
        price,
        amount,
        total
      });
    }
    
    // Sort asks by price ascending
    asks.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    
    // Generate bids (buy orders)
    for (let i = 0; i < 20; i++) {
      const price = (basePrice * (1 - (i + 1) * 0.001)).toFixed(2);
      const amount = (Math.random() * 10 + 0.1).toFixed(4);
      const total = (parseFloat(price) * parseFloat(amount)).toFixed(2);
      
      bids.push({
        price,
        amount,
        total
      });
    }
    
    // Sort bids by price descending
    bids.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    
    return { asks, bids };
  };

  if (isLoading && orderBook.asks.length === 0 && orderBook.bids.length === 0) {
    return (
      <div className="order-book-loading">
        <div className="spinner"></div>
        <p>Loading order book...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-book-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  // Calculate spread
  const lowestAsk = orderBook.asks[0]?.price || '0';
  const highestBid = orderBook.bids[0]?.price || '0';
  const spread = (parseFloat(lowestAsk) - parseFloat(highestBid)).toFixed(2);
  const spreadPercentage = (parseFloat(spread) / parseFloat(lowestAsk) * 100).toFixed(2);

  return (
    <div className="order-book">
      <div className="order-book-header">
        <h2>Order Book</h2>
        <div className="order-book-controls">
          <select 
            value={displayCount} 
            onChange={(e) => setDisplayCount(parseInt(e.target.value))}
          >
            <option value={5}>5 rows</option>
            <option value={10}>10 rows</option>
            <option value={15}>15 rows</option>
            <option value={20}>20 rows</option>
          </select>
        </div>
      </div>
      
      <div className="order-book-spread">
        <span>Spread: {spread} ({spreadPercentage}%)</span>
      </div>
      
      <div className="order-book-content">
        <div className="order-book-headers">
          <div className="price-header">Price</div>
          <div className="amount-header">Amount</div>
          <div className="total-header">Total</div>
        </div>
        
        <div className="order-book-asks">
          {orderBook.asks.slice(0, displayCount).map((ask, index) => (
            <div key={`ask-${index}`} className="order-book-row ask">
              <div className="price">{ask.price}</div>
              <div className="amount">{ask.amount}</div>
              <div className="total">{ask.total}</div>
              <div 
                className="depth-visualization" 
                style={{ 
                  width: `${Math.min(parseFloat(ask.amount) * 5, 100)}%`,
                  opacity: 1 - (index / displayCount / 2)
                }}
              ></div>
            </div>
          ))}
        </div>
        
        <div className="order-book-bids">
          {orderBook.bids.slice(0, displayCount).map((bid, index) => (
            <div key={`bid-${index}`} className="order-book-row bid">
              <div className="price">{bid.price}</div>
              <div className="amount">{bid.amount}</div>
              <div className="total">{bid.total}</div>
              <div 
                className="depth-visualization" 
                style={{ 
                  width: `${Math.min(parseFloat(bid.amount) * 5, 100)}%`,
                  opacity: 1 - (index / displayCount / 2)
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderBookComponent;
