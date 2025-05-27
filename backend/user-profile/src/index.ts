import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Load environment variables
dotenv.config();

// Initialize Prisma client
const prisma = new PrismaClient();

// Create Express server
const app = express();
const port = process.env.PORT || 3004;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON bodies

// JWT authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    req.user = user;
    next();
  });
};

// Routes
app.use('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'user-profile' });
});

// Register user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || email.split('@')[0],
        preferences: {
          create: {
            defaultModality: 'visual',
            slippageTolerance: '0.5',
            theme: 'light'
          }
        }
      }
    });
    
    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      id: user.id,
      email: user.email,
      name: user.name,
      token
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );
    
    res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
      token
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Failed to login user' });
  }
});

// Get user profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find user with preferences
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { preferences: true }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

// Update user preferences
app.put('/api/user/preferences', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { defaultModality, slippageTolerance, theme } = req.body;
    
    // Update preferences
    const preferences = await prisma.userPreferences.update({
      where: { userId },
      data: {
        defaultModality: defaultModality || undefined,
        slippageTolerance: slippageTolerance || undefined,
        theme: theme || undefined
      }
    });
    
    res.status(200).json(preferences);
  } catch (error) {
    console.error('Error updating user preferences:', error);
    res.status(500).json({ error: 'Failed to update user preferences' });
  }
});

// Save wallet address
app.post('/api/user/wallet', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { address, chainId } = req.body;
    
    if (!address || !chainId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if wallet already exists
    const existingWallet = await prisma.wallet.findFirst({
      where: {
        userId,
        address,
        chainId
      }
    });
    
    if (existingWallet) {
      return res.status(409).json({ error: 'Wallet already exists' });
    }
    
    // Create wallet
    const wallet = await prisma.wallet.create({
      data: {
        userId,
        address,
        chainId,
        isDefault: true
      }
    });
    
    res.status(201).json(wallet);
  } catch (error) {
    console.error('Error saving wallet address:', error);
    res.status(500).json({ error: 'Failed to save wallet address' });
  }
});

// Get user wallets
app.get('/api/user/wallets', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find wallets
    const wallets = await prisma.wallet.findMany({
      where: { userId }
    });
    
    res.status(200).json(wallets);
  } catch (error) {
    console.error('Error getting user wallets:', error);
    res.status(500).json({ error: 'Failed to get user wallets' });
  }
});

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
  console.log(`User Profile Service listening on port ${port}`);
});

export default app;
