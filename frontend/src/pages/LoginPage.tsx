import React, { useState } from 'react';
import './LoginPage.css';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // In a real app, this would call an authentication API
      // For demo purposes, we'll simulate a successful login after a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful login
      onLogin();
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Multimodal Trading Interface</h1>
          <p>Sign in to access your trading dashboard</p>
        </div>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
          
          <div className="demo-login">
            <p>For demo purposes, you can use any email and password</p>
            <button
              type="button"
              className="demo-button"
              onClick={() => {
                setEmail('demo@example.com');
                setPassword('password');
              }}
              disabled={isLoading}
            >
              Fill Demo Credentials
            </button>
          </div>
        </form>
        
        <div className="login-footer">
          <p>OKX Solana Accelerate Hackathon Project</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
