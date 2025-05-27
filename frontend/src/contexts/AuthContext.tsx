import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types/modality';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  connectWallet: (walletType: string) => Promise<void>;
  disconnect: () => void;
  demoLogin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Login with email and password
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would call an API
      // For demo purposes, we'll simulate a successful login
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email && password) {
        setIsAuthenticated(true);
        setUser({
          id: '1',
          email,
          name: 'Demo User'
        });
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Connect wallet
  const connectWallet = async (walletType: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would connect to the wallet
      // For demo purposes, we'll simulate a successful connection
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsAuthenticated(true);
      setUser({
        id: `wallet_${walletType}_1`,
        name: `${walletType} User`,
        walletAddress: '8xn3jhH4Xs7oDrKZMaGV7p3UpUFKXR5KQZ8QNuFnw9g2'
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wallet connection failed');
      console.error('Wallet connection error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Disconnect
  const disconnect = () => {
    setIsAuthenticated(false);
    setUser(null);
  };
  
  // Demo login
  const demoLogin = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsAuthenticated(true);
      setUser({
        id: 'demo_1',
        email: 'demo@example.com',
        name: 'Demo User',
        walletAddress: '8xn3jhH4Xs7oDrKZMaGV7p3UpUFKXR5KQZ8QNuFnw9g2'
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Demo login failed');
      console.error('Demo login error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const value = {
    isAuthenticated,
    user,
    isLoading,
    error,
    login,
    connectWallet,
    disconnect,
    demoLogin
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
