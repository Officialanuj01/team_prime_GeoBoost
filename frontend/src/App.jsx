import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './components/landing-page';
import CampaignUploader from './components/CampaignUploader';
import CampaignDetails from './components/CampaignDetails';
import NotificationSender from './components/NotificationSender';
import FeaturesPage from './components/pages/FeaturesPage';
import AboutPage from './components/pages/AboutPage';
import UploadPage from './components/pages/UploadPage';
import AuthModal from './authentication/AuthModal';

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes({ user }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
        <Route path="/features" element={<PageTransition><FeaturesPage /></PageTransition>} />
        <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
        <Route path="/upload" element={<PageTransition><UploadPage user={user} /></PageTransition>} />
        <Route path="/CampaignUploader" element={<PageTransition><CampaignUploader /></PageTransition>} />
        <Route path="/campaigns" element={<PageTransition><CampaignDetails /></PageTransition>} />
        <Route path="/CampaignDetails" element={<PageTransition><CampaignDetails /></PageTransition>} />
        <Route path="/NotificationSender" element={<PageTransition><NotificationSender user={user} /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState(null);

  // Restore user from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('geoboost_user');
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch {}
    }
  }, []);

  function handleLogin(userData) {
    setUser(userData);
    localStorage.setItem('geoboost_user', JSON.stringify(userData));
  }

  function handleLogout() {
    setUser(null);
    localStorage.removeItem('geoboost_user');
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar
          user={user}
          onLoginClick={() => setShowAuth(true)}
          onLogout={handleLogout}
        />
        <main className="flex-1">
          <AnimatedRoutes user={user} />
        </main>
        <Footer />

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuth}
          onClose={() => setShowAuth(false)}
          onLogin={handleLogin}
        />
      </div>
    </Router>
  );
}

export default App;