import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';

// Load environment variables
dotenv.config();

// Create Express server
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'api-gateway' });
});

// Proxy routes to appropriate services
app.use('/api/voice', createProxyMiddleware({ 
  target: process.env.VOICE_SERVICE_URL || 'http://localhost:3002',
  changeOrigin: true,
  pathRewrite: {
    '^/api/voice': '/api', 
  },
}));

app.use('/api/trading', createProxyMiddleware({ 
  target: process.env.TRADING_SERVICE_URL || 'http://localhost:3003',
  changeOrigin: true,
  pathRewrite: {
    '^/api/trading': '/api', 
  },
}));

app.use('/api/user', createProxyMiddleware({ 
  target: process.env.USER_SERVICE_URL || 'http://localhost:3004',
  changeOrigin: true,
  pathRewrite: {
    '^/api/user': '/api', 
  },
}));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(port, () => {
  console.log(`API Gateway listening on port ${port}`);
});

export default app;
