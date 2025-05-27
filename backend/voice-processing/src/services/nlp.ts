class NLPClient {
  constructor() {
    // Initialize NLP service
    this.commandPatterns = {
      buy: /buy\s+(\d+(?:\.\d+)?)\s+(SOL|USDC|USDT)/i,
      sell: /sell\s+(\d+(?:\.\d+)?)\s+(SOL|USDC|USDT)/i,
      swap: /swap\s+(\d+(?:\.\d+)?)\s+(SOL|USDC|USDT)\s+(?:for|to)\s+(SOL|USDC|USDT)/i,
      price: /(?:get|check|what is|what's)\s+(?:the\s+)?price\s+(?:of\s+)?(SOL|USDC|USDT)/i,
      balance: /(?:get|check|what is|what's)\s+(?:my\s+)?balance/i,
      history: /(?:get|check|what is|what's)\s+(?:my\s+)?(?:transaction\s+)?history/i
    };
  }

  /**
   * Process a natural language command
   * @param {string} command - The command to process
   * @returns {Object} The processed command result
   */
  async processCommand(command) {
    // Check for buy command
    const buyMatch = command.match(this.commandPatterns.buy);
    if (buyMatch) {
      const amount = buyMatch[1];
      const token = buyMatch[2];
      
      return {
        type: 'buy',
        params: {
          amount,
          token
        },
        message: `Buying ${amount} ${token}`
      };
    }
    
    // Check for sell command
    const sellMatch = command.match(this.commandPatterns.sell);
    if (sellMatch) {
      const amount = sellMatch[1];
      const token = sellMatch[2];
      
      return {
        type: 'sell',
        params: {
          amount,
          token
        },
        message: `Selling ${amount} ${token}`
      };
    }
    
    // Check for swap command
    const swapMatch = command.match(this.commandPatterns.swap);
    if (swapMatch) {
      const amount = swapMatch[1];
      const fromToken = swapMatch[2];
      const toToken = swapMatch[3];
      
      return {
        type: 'swap',
        params: {
          amount,
          fromToken,
          toToken
        },
        message: `Swapping ${amount} ${fromToken} to ${toToken}`
      };
    }
    
    // Check for price command
    const priceMatch = command.match(this.commandPatterns.price);
    if (priceMatch) {
      const token = priceMatch[1];
      
      return {
        type: 'price',
        params: {
          token
        },
        message: `Getting price of ${token}`
      };
    }
    
    // Check for balance command
    const balanceMatch = command.match(this.commandPatterns.balance);
    if (balanceMatch) {
      return {
        type: 'balance',
        params: {},
        message: 'Getting wallet balance'
      };
    }
    
    // Check for history command
    const historyMatch = command.match(this.commandPatterns.history);
    if (historyMatch) {
      return {
        type: 'history',
        params: {},
        message: 'Getting transaction history'
      };
    }
    
    // Unknown command
    return {
      type: 'unknown',
      params: {},
      message: 'Command not recognized'
    };
  }
}

export { NLPClient };
