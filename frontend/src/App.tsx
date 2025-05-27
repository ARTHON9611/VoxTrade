import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ModalityProvider } from './contexts/ModalityContext';
import { TradingProvider } from './contexts/TradingContext';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import TradingDashboard from './pages/TradingDashboard';
import ModalitySwitcher from './components/ModalitySwitcher';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <AuthProvider>
        <ModalityProvider>
          <TradingProvider>
            <div className="app-container">
              <header className="app-header">
                <div className="logo">
                  <h1>Multimodal Trading Interface</h1>
                </div>
                {isAuthenticated && (
                  <div className="header-controls">
                    <ModalitySwitcher />
                    <button className="logout-button" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                )}
              </header>
              
              <main className="app-content">
                <Routes>
                  <Route 
                    path="/login" 
                    element={
                      isAuthenticated ? 
                        <Navigate to="/dashboard" replace /> : 
                        <LoginPage onLogin={handleLogin} />
                    } 
                  />
                  <Route 
                    path="/dashboard" 
                    element={
                      isAuthenticated ? 
                        <TradingDashboard /> : 
                        <Navigate to="/login" replace />
                    } 
                  />
                  <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
                </Routes>
              </main>
              
              <footer className="app-footer">
                <p>© 2025 Multimodal Trading Interface - OKX Solana Accelerate Hackathon</p>
              </footer>
            </div>
          </TradingProvider>
        </ModalityProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
