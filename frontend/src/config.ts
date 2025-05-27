export const config = {
  // API configuration
  apiBaseUrl: 'https://api.okx.com',
  apiVersion: 'v5',
  okxApiKey: process.env.OKX_API_KEY || 'demo-api-key',
  okxSecretKey: process.env.OKX_SECRET_KEY || 'demo-secret-key',
  okxPassphrase: process.env.OKX_PASSPHRASE || 'demo-passphrase',
  okxDexApiUrl: 'https://www.okx.com',
  
  // Solana configuration
  solanaRpcUrl: 'https://api.mainnet-beta.solana.com',
  solanaWalletAddress: '',
  
  // Default settings
  defaultMarket: 'SOL/USDC',
  defaultTimeframe: '1h',
  defaultSlippage: '0.5',
  
  // Supported tokens
  supportedTokens: ['SOL', 'BTC', 'ETH', 'USDC', 'USDT'],
  
  // Chart timeframes
  chartTimeframes: ['5m', '15m', '1h', '4h', '1d', '1w'],
  
  // Feature flags
  features: {
    voiceRecognition: true,
    contextAwareness: true,
    darkMode: true,
    demoMode: true
  },
  
  // Context awareness settings
  contextAwareness: {
    motionThreshold: 12,
    soundThreshold: 50,
    detectionInterval: 5000
  }
}
