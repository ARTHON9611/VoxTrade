# Multimodal Trading Interface

A comprehensive trading platform that combines visual, voice, and text inputs to create a seamless trading experience across different contexts. Built for the OKX Solana Accelerate Hackathon.

## Features

- **Visual Interface**: Interactive charts, gesture recognition, and QR code scanning
- **Voice Processing**: Natural language understanding for trading commands with voice authentication
- **Text Command System**: Command parsing with autocomplete and suggestion engine
- **Context Awareness**: Automatically adapts to user environment and preferences
- **OKX DEX API Integration**: Complete trading functionality with the OKX DEX API
- **Multi-platform Support**: Web, mobile, and voice assistant integration
- **Enterprise-grade Security**: Multi-factor authentication and transaction safety

## Project Structure

```
multimodal-trading-interface/
├── frontend/                  # Web application
│   ├── public/                # Static assets
│   └── src/                   # Source code
│       ├── api/               # API integration
│       ├── components/        # UI components
│       ├── contexts/          # React contexts
│       ├── hooks/             # Custom hooks
│       ├── modalities/        # Modality implementations
│       ├── pages/             # Page components
│       ├── services/          # Business logic
│       ├── types/             # TypeScript types
│       └── utils/             # Utility functions
├── mobile/                    # Mobile application
│   ├── android/               # Android-specific code
│   ├── ios/                   # iOS-specific code
│   └── src/                   # Shared source code
├── backend/                   # Backend services
│   ├── api-gateway/           # API Gateway service
│   ├── voice-processing/      # Voice processing service
│   ├── trading-service/       # Trading service
│   └── user-profile/          # User profile service
├── docs/                      # Documentation
└── deployment/                # Deployment configuration
```

## Technology Stack

- **Frontend**: React, TypeScript, TailwindCSS
- **Mobile**: React Native
- **Backend**: Node.js, Express, NestJS
- **Database**: PostgreSQL, Redis
- **Blockchain**: Solana, OKX DEX SDK
- **Voice Processing**: Web Speech API, Custom NLP
- **Deployment**: Docker, Kubernetes

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Docker and Docker Compose
- OKX API credentials
- Solana wallet

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/multimodal-trading-interface.git
   cd multimodal-trading-interface
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example` and fill in your credentials

4. Start the development server
   ```
   npm start
   ```

## Usage

### Visual Interface

The visual interface provides a traditional trading experience with charts, order forms, and portfolio management. It's optimized for desktop and mobile devices with touch support.

### Voice Commands

The voice interface supports commands like:
- "Buy 0.5 SOL"
- "Sell 10 USDC"
- "Swap 1 SOL to USDC"
- "Check price of SOL"
- "Check my balance"

### Text Commands

The text interface supports a command syntax for efficient trading:
- `/buy 0.5 SOL`
- `/sell 10 USDC`
- `/swap 1 SOL USDC`
- `/price SOL`
- `/balance`

## Deployment

### Local Deployment

1. Build the Docker image
   ```
   docker build -t multimodal-trading-interface .
   ```

2. Run the container
   ```
   docker run -p 80:80 multimodal-trading-interface
   ```

3. Access the application at http://localhost

### Production Deployment

See the [Deployment Guide](deployment.md) for detailed instructions on deploying to production environments.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- OKX for providing the DEX API
- Solana for the blockchain infrastructure
- SendAI for the agent framework
