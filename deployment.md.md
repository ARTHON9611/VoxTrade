# VoxTrade Deployment Guide

This document provides instructions for deploying the VoxTrade platform locally and to production environments.

## Local Development Deployment

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- A Solana wallet (Phantom, Solflare, or other Solana-compatible wallets)
- OKX API credentials

### Step 1: Clone the Repository
```bash
git clone https://github.com/ARTHON9611/VoxTrade.git
cd VoxTrade
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a `.env` file in the root directory with your OKX API credentials:
```
OKX_API_KEY=your_api_key
OKX_SECRET_KEY=your_secret_key
OKX_PASSPHRASE=your_passphrase
```

### Step 4: Start the Development Server
```bash
npm start
```
This will launch the application at `http://localhost:8080`.

## Production Deployment

### Option 1: Static Hosting (Recommended)

#### Step 1: Build the Production Bundle
```bash
npm run build
```
This generates optimized files in the `dist` directory.

#### Step 2: Deploy to Hosting Service
Upload the contents of the `dist` directory to your preferred static hosting service (Netlify, Vercel, GitHub Pages, etc.).

### Option 2: Docker Deployment

#### Step 1: Build Docker Image
```bash
docker build -t voxtrade:latest .
```

#### Step 2: Run Docker Container
```bash
docker run -p 80:80 -e OKX_API_KEY=your_api_key -e OKX_SECRET_KEY=your_secret_key -e OKX_PASSPHRASE=your_passphrase voxtrade:latest
```

## Configuration Options

### Customizing OKX DEX Integration
Edit the `OKXDexClient.js` file to modify API endpoints or add additional functionality.

### Solana Network Selection
By default, VoxTrade connects to Solana mainnet. To use devnet or testnet, modify the network configuration in `WalletContextProvider.jsx`.

## Troubleshooting

### Common Issues
- **Wallet Connection Errors**: Ensure your browser has a compatible Solana wallet extension installed.
- **API Rate Limiting**: The OKX DEX API has rate limits. Check the console for related errors.
- **Build Failures**: Make sure all dependencies are correctly installed with `npm install`.

### Support
For additional support, please open an issue on the GitHub repository.

## Security Considerations
- Never commit your `.env` file or expose API credentials in client-side code
- Use environment variables for all sensitive information
- Regularly update dependencies to patch security vulnerabilities
