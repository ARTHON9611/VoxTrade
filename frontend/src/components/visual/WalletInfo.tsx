import React, { useState, useEffect } from 'react';
import { okxDexClient } from '../../api/okxDexClient';
import { TokenBalance } from '../../types/modality';

interface WalletInfoProps {
  walletAddress: string;
}

const WalletInfo: React.FC<WalletInfoProps> = ({ walletAddress }) => {
  const [balances, setBalances] = useState<Record<string, string>>({});
  const [totalValue, setTotalValue] = useState<string>('0.00');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch wallet balances
  useEffect(() => {
    const fetchBalances = async () => {
      if (!walletAddress) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const balanceData = await okxDexClient.getBalances(walletAddress);
        setBalances(balanceData);
        
        // Calculate total value
        let total = 0;
        for (const [token, amount] of Object.entries(balanceData)) {
          if (parseFloat(amount) > 0) {
            const price = await okxDexClient.getPrice(token);
            total += parseFloat(amount) * parseFloat(price);
          }
        }
        
        setTotalValue(total.toFixed(2));
      } catch (err) {
        console.error('Error fetching wallet balances:', err);
        setError('Failed to load wallet information. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBalances();
    
    // Refresh balances every 30 seconds
    const intervalId = setInterval(fetchBalances, 30000);
    
    return () => clearInterval(intervalId);
  }, [walletAddress]);

  if (isLoading && Object.keys(balances).length === 0) {
    return (
      <div className="wallet-info-loading">
        <div className="spinner"></div>
        <p>Loading wallet information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wallet-info-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="wallet-info">
      <div className="wallet-header">
        <h2>Wallet</h2>
        <div className="wallet-address">
          {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
        </div>
      </div>
      
      <div className="wallet-total">
        <span className="label">Total Value:</span>
        <span className="value">${totalValue}</span>
      </div>
      
      <div className="wallet-balances">
        <h3>Token Balances</h3>
        {Object.entries(balances).map(([token, amount]) => (
          parseFloat(amount) > 0 && (
            <div key={token} className="balance-item">
              <div className="token-info">
                <span className="token-symbol">{token}</span>
              </div>
              <div className="token-amount">{amount}</div>
            </div>
          )
        ))}
      </div>
      
      <div className="wallet-actions">
        <button className="deposit-button">Deposit</button>
        <button className="withdraw-button">Withdraw</button>
      </div>
    </div>
  );
};

export default WalletInfo;
