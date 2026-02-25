import React, { useState, useEffect } from 'react';
import { loadSession, clearSession } from './utils/auth';
import { getBusiness } from './utils/loyaltyCards';
import { getCustomerCards } from './utils/loyaltyCards';

// Pages
import Home from './components/Home';
import BusinessLogin from './components/BusinessLogin';
import BusinessSignup from './components/BusinessSignup';
import BusinessSetup from './components/BusinessSetup';
import BusinessDashboard from './components/BusinessDashboard';
import ScanQR from './components/ScanQR';
import CustomerLogin from './components/CustomerLogin';
import CustomerSignup from './components/CustomerSignup';
import CustomerDashboard from './components/CustomerDashboard';
import ShowQR from './components/ShowQR';

export default function App() {
  const [view, setView] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState('');
  const [businessData, setBusinessData] = useState(null);
  const [customerCards, setCustomerCards] = useState([]);
  const [scanningCard, setScanningCard] = useState(null);

  // ── Restore session on first load ──────────────────────────────────────────
  useEffect(() => {
    const session = loadSession();
    if (!session) return;

    const { user, userType: type } = session;
    setCurrentUser(user);
    setUserType(type);

    if (type === 'business') {
      const biz = getBusiness(user.email);
      if (biz) {
        setBusinessData(biz);
        setView('business-dashboard');
      } else {
        setView('business-setup');
      }
    } else {
      const cards = getCustomerCards(user.email);
      setCustomerCards(cards);
      setView('customer');
    }
  }, []);

  // ── Auth callbacks ─────────────────────────────────────────────────────────
  const handleAuthSuccess = (user, type) => {
    setCurrentUser(user);
    setUserType(type);

    if (type === 'business') {
      const biz = getBusiness(user.email);
      if (biz) {
        setBusinessData(biz);
        setView('business-dashboard');
      } else {
        setView('business-setup');
      }
    } else {
      const cards = getCustomerCards(user.email);
      setCustomerCards(cards);
      setView('customer');
    }
  };

  const handleLogout = () => {
    clearSession();
    setCurrentUser(null);
    setUserType('');
    setBusinessData(null);
    setCustomerCards([]);
    setScanningCard(null);
    setView('home');
  };

  const handleBusinessSetupDone = (biz) => {
    setBusinessData(biz);
    setView('business-dashboard');
  };

  // ── NEW: called after business deletes their loyalty program ──────────────
  const handleBusinessDeleted = () => {
    setBusinessData(null);
    setView('business-setup');
  };

  const handleCardsChange = (updatedCards) => {
    setCustomerCards(updatedCards);
  };

  const handleShowQR = (card) => {
    setScanningCard(card);
    setView('show-qr');
  };

  // ── Router ─────────────────────────────────────────────────────────────────
  const sharedProps = { currentUser, userType, onLogout: handleLogout };

  switch (view) {
    case 'home':
      return <Home onBusiness={() => setView('business-login')} onCustomer={() => setView('customer-login')} />;

    case 'business-login':
      return <BusinessLogin onSuccess={(u) => handleAuthSuccess(u, 'business')} onSignup={() => setView('business-signup')} onBack={() => setView('home')} />;

    case 'business-signup':
      return <BusinessSignup onSuccess={(u) => handleAuthSuccess(u, 'business')} onLogin={() => setView('business-login')} onBack={() => setView('business-login')} />;

    case 'business-setup':
      return <BusinessSetup {...sharedProps} onDone={handleBusinessSetupDone} />;

    case 'business-dashboard':
      return <BusinessDashboard {...sharedProps} businessData={businessData} onScan={() => setView('scan')} onDeleted={handleBusinessDeleted} />;

    case 'scan':
      return <ScanQR {...sharedProps} onBack={() => setView('business-dashboard')} />;

    case 'customer-login':
      return <CustomerLogin onSuccess={(u) => handleAuthSuccess(u, 'customer')} onSignup={() => setView('customer-signup')} onBack={() => setView('home')} />;

    case 'customer-signup':
      return <CustomerSignup onSuccess={(u) => handleAuthSuccess(u, 'customer')} onLogin={() => setView('customer-login')} onBack={() => setView('customer-login')} />;

    case 'customer':
      return <CustomerDashboard {...sharedProps} cards={customerCards} onCardsChange={handleCardsChange} onShowQR={handleShowQR} />;

    case 'show-qr':
      return <ShowQR card={scanningCard} onBack={() => setView('customer')} />;

    default:
      return <Home onBusiness={() => setView('business-login')} onCustomer={() => setView('customer-login')} />;
  }
}