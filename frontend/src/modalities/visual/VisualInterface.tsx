import React, { useState, useEffect } from 'react';
import { ModalityType } from '../../types/modality';
import TradingChart from '../../components/visual/TradingChart';
import OrderBook from '../../components/visual/OrderBook';
import SwapForm from '../../components/visual/SwapForm';
import WalletInfo from '../../components/visual/WalletInfo';
import RecentTrades from '../../components/visual/RecentTrades';

interface VisualInterfaceProps {
  onActionExecuted: (result: { success: boolean; message: string; data?: any }) => void;
}

const VisualInterface: React.FC<VisualInterfaceProps> = ({ onActionExecuted }) => {
  const [selectedMarket, setSelectedMarket] = useState<string>('SOL');
  const [timeframe, setTimeframe] = useState<string>('1h');
  const [walletAddress, setWalletAddress] = useState<string>('0x1234567890abcdef'); // Mock wallet address

  // Handle swap execution
  const handleSwapExecuted = (result: { success: boolean; message: string; data?: any }) => {
    onActionExecuted(result);
  };

  return (
    <div className="visual-interface">
      <div className="market-selector">
        <select 
          value={selectedMarket} 
          onChange={(e) => setSelectedMarket(e.target.value)}
        >
          <option value="SOL">SOL</option>
          <option value="BTC">BTC</option>
          <option value="ETH">ETH</option>
          <option value="USDC">USDC</option>
          <option value="USDT">USDT</option>
        </select>
        
        <div className="timeframe-selector">
          <button 
            className={timeframe === '5m' ? 'active' : ''} 
            onClick={() => setTimeframe('5m')}
          >
            5m
          </button>
          <button 
            className={timeframe === '15m' ? 'active' : ''} 
            onClick={() => setTimeframe('15m')}
          >
            15m
          </button>
          <button 
            className={timeframe === '1h' ? 'active' : ''} 
            onClick={() => setTimeframe('1h')}
          >
            1h
          </button>
          <button 
            className={timeframe === '4h' ? 'active' : ''} 
            onClick={() => setTimeframe('4h')}
          >
            4h
          </button>
          <button 
            className={timeframe === '1d' ? 'active' : ''} 
            onClick={() => setTimeframe('1d')}
          >
            1d
          </button>
        </div>
      </div>
      
      <div className="trading-dashboard">
        <div className="left-panel">
          <WalletInfo walletAddress={walletAddress} />
          <SwapForm onSwapExecuted={handleSwapExecuted} />
        </div>
        
        <div className="center-panel">
          <TradingChart symbol={selectedMarket} timeframe={timeframe} />
        </div>
        
        <div className="right-panel">
          <OrderBook symbol={selectedMarket} />
          <RecentTrades symbol={selectedMarket} />
        </div>
      </div>
    </div>
  );
};

export default VisualInterface;
