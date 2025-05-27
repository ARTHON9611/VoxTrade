import React, { useState, useEffect } from 'react';
import { okxDexClient } from '../../api/okxDexClient';
import { SwapQuote } from '../../types/modality';

interface SwapFormProps {
  onSwapExecuted: (result: { success: boolean; message: string; data?: any }) => void;
}

const SwapForm: React.FC<SwapFormProps> = ({ onSwapExecuted }) => {
  const [fromToken, setFromToken] = useState<string>('USDC');
  const [toToken, setToToken] = useState<string>('SOL');
  const [amount, setAmount] = useState<string>('');
  const [slippage, setSlippage] = useState<string>('0.5');
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isQuoteLoading, setIsQuoteLoading] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('0x1234567890abcdef'); // Mock wallet address

  const supportedTokens = ['SOL', 'USDC', 'USDT', 'BTC', 'ETH'];

  // Get quote when inputs change
  useEffect(() => {
    const getQuote = async () => {
      if (!amount || parseFloat(amount) <= 0) {
        setQuote(null);
        return;
      }

      setIsQuoteLoading(true);
      setError(null);

      try {
        const newQuote = await okxDexClient.getSwapQuote(
          fromToken,
          toToken,
          amount,
          slippage
        );
        setQuote(newQuote);
      } catch (err) {
        console.error('Error getting swap quote:', err);
        setError('Failed to get swap quote. Please try again.');
        setQuote(null);
      } finally {
        setIsQuoteLoading(false);
      }
    };

    // Debounce quote requests
    const timeoutId = setTimeout(getQuote, 500);
    return () => clearTimeout(timeoutId);
  }, [fromToken, toToken, amount, slippage]);

  // Handle token swap
  const handleSwap = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!quote) {
      setError('Please wait for quote to load');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await okxDexClient.executeSwap(
        walletAddress,
        fromToken,
        toToken,
        amount
      );

      if (result.success) {
        onSwapExecuted({
          success: true,
          message: `Successfully swapped ${amount} ${fromToken} for approximately ${quote.toAmount} ${toToken}`,
          data: { ...result, quote }
        });
        
        // Reset form
        setAmount('');
        setQuote(null);
      } else {
        setError(`Swap failed: ${result.error || 'Unknown error'}`);
        onSwapExecuted({
          success: false,
          message: `Failed to swap ${amount} ${fromToken} to ${toToken}`,
          data: result
        });
      }
    } catch (err) {
      console.error('Error executing swap:', err);
      setError('Failed to execute swap. Please try again.');
      onSwapExecuted({
        success: false,
        message: `Error executing swap: ${err instanceof Error ? err.message : 'Unknown error'}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle token switch
  const handleSwitchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setAmount('');
    setQuote(null);
  };

  return (
    <div className="swap-form">
      <h2>Swap Tokens</h2>
      
      <form onSubmit={handleSwap}>
        <div className="form-group">
          <label htmlFor="fromToken">From</label>
          <div className="token-input-container">
            <select
              id="fromToken"
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
              disabled={isLoading}
            >
              {supportedTokens.map((token) => (
                <option key={`from-${token}`} value={token}>
                  {token}
                </option>
              ))}
            </select>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="any"
              disabled={isLoading}
              required
            />
          </div>
        </div>
        
        <button
          type="button"
          className="switch-button"
          onClick={handleSwitchTokens}
          disabled={isLoading}
        >
          ↑↓
        </button>
        
        <div className="form-group">
          <label htmlFor="toToken">To</label>
          <div className="token-input-container">
            <select
              id="toToken"
              value={toToken}
              onChange={(e) => setToToken(e.target.value)}
              disabled={isLoading}
            >
              {supportedTokens.map((token) => (
                <option key={`to-${token}`} value={token}>
                  {token}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={quote ? quote.toAmount : '0.00'}
              readOnly
              placeholder="0.00"
              className="estimated-amount"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="slippage">Slippage Tolerance (%)</label>
          <select
            id="slippage"
            value={slippage}
            onChange={(e) => setSlippage(e.target.value)}
            disabled={isLoading}
          >
            <option value="0.1">0.1%</option>
            <option value="0.5">0.5%</option>
            <option value="1.0">1.0%</option>
            <option value="2.0">2.0%</option>
          </select>
        </div>
        
        {quote && (
          <div className="quote-details">
            <div className="quote-item">
              <span>Rate:</span>
              <span>1 {fromToken} = {quote.rate} {toToken}</span>
            </div>
            <div className="quote-item">
              <span>Minimum received:</span>
              <span>{quote.minAmount} {toToken}</span>
            </div>
            <div className="quote-item">
              <span>Fee:</span>
              <span>{quote.fee}</span>
            </div>
          </div>
        )}
        
        {error && <div className="error-message">{error}</div>}
        
        <button
          type="submit"
          className="swap-button"
          disabled={isLoading || isQuoteLoading || !quote || !amount}
        >
          {isLoading ? 'Swapping...' : 'Swap'}
        </button>
      </form>
    </div>
  );
};

export default SwapForm;
