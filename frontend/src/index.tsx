import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ModalityProvider } from './contexts/ModalityContext';
import { AuthProvider } from './contexts/AuthContext';
import { TradingProvider } from './contexts/TradingContext';
import TradingDashboard from './pages/TradingDashboard';
import './index.css';

const App = () => {
  return (
    <Router>
      <ModalityProvider>
        <AuthProvider>
          <TradingProvider>
            <Routes>
              <Route path="/" element={<TradingDashboard />} />
            </Routes>
          </TradingProvider>
        </AuthProvider>
      </ModalityProvider>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
