import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Zap, LogIn, MapPin, Globe, BarChart3 } from 'lucide-react';

/* =============================================
   LOGIN FORM
   ============================================= */
function LoginForm({ onLogin, onSwitchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [devStatus, setDevStatus] = useState('');

  function handleDevLogin() {
    setEmail('demo@geoboost.ai');
    setPassword('demo123');
    setDevStatus('Demo credentials loaded. Click Log In to continue.');
    setError('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate login
    setTimeout(() => {
      if (email && password) {
        const user = { name: email.split('@')[0], email };
        localStorage.setItem('geoboost_user', JSON.stringify(user));
        onLogin(user);
      } else {
        setError('Please fill in all fields');
      }
      setLoading(false);
    }, 800);
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      {/* Email */}
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-500">
          <Mail className="w-4.5 h-4.5" />
        </div>
        <input
          type="email"
          placeholder="Email"
          className="h-12 w-full rounded-xl border-[1.5px] border-primary-200 bg-gradient-to-r from-white to-primary-50/30 pl-11 pr-4 text-sm text-gray-800 placeholder:text-primary-400 focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300 hover:border-primary-300 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Password */}
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-accent-500">
          <Lock className="w-4.5 h-4.5" />
        </div>
        <input
          type="password"
          placeholder="Password"
          className="h-12 w-full rounded-xl border-[1.5px] border-accent-200 bg-gradient-to-r from-white to-accent-50/30 pl-11 pr-4 text-sm text-gray-800 placeholder:text-primary-400 focus:ring-2 focus:ring-accent-400 focus:border-transparent transition-all duration-300 hover:border-accent-300 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Messages */}
      <div style={{ minHeight: '1.2em' }}>
        {error && (
          <div className="text-red-500 text-xs bg-red-50 border border-red-200 rounded-lg p-2.5 flex items-center gap-2">
            <span className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] shrink-0">!</span>
            {error}
          </div>
        )}
        {!error && devStatus && (
          <div className="text-emerald-600 text-xs bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            {devStatus}
          </div>
        )}
      </div>

      {/* Buttons Row */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleDevLogin}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-50 to-accent-50 border-[1.5px] border-primary-200 px-4 py-3 text-sm font-medium text-primary-700 hover:from-primary-100 hover:to-accent-100 hover:border-primary-300 transition-all duration-300 hover:-translate-y-0.5"
        >
          <Zap className="w-4 h-4" />
          Demo Credentials
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 px-4 py-3 text-sm font-semibold text-white shadow-btn hover:shadow-btn-hover transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative flex items-center gap-2">
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            {loading ? 'Logging in...' : 'Log In'}
          </span>
        </button>
      </div>

      {/* Divider */}
      <div className="relative my-1">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 bg-white text-gray-400">Or continue with</span>
        </div>
      </div>

      {/* Google Sign In */}
      <button
        type="button"
        className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-white border-[1.5px] border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 hover:-translate-y-0.5"
      >
        <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Continue with Google
      </button>

      {/* Switch to signup */}
      <button
        type="button"
        onClick={onSwitchToSignup}
        className="text-sm text-primary-500 hover:text-primary-600 transition-colors flex items-center justify-center gap-1.5"
      >
        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary-400 to-accent-500" />
        Don't have an account? Sign up
      </button>
    </form>
  );
}

/* =============================================
   SIGNUP FORM
   ============================================= */
function SignupForm({ onSignup, onSwitchToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (name && email && password) {
        onSignup();
      } else {
        setError('Please fill in all fields');
      }
      setLoading(false);
    }, 800);
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-500"><User className="w-4 h-4" /></div>
        <input type="text" placeholder="Full Name" className="h-12 w-full rounded-xl border-[1.5px] border-primary-200 bg-white pl-11 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300 outline-none" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-500"><Mail className="w-4 h-4" /></div>
        <input type="email" placeholder="Email Address" className="h-12 w-full rounded-xl border-[1.5px] border-primary-200 bg-white pl-11 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-300 outline-none" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-accent-500"><Lock className="w-4 h-4" /></div>
        <input type="password" placeholder="Password" className="h-12 w-full rounded-xl border-[1.5px] border-accent-200 bg-white pl-11 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-accent-400 focus:border-transparent transition-all duration-300 outline-none" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>

      {error && (
        <div className="text-red-500 text-xs bg-red-50 border border-red-200 rounded-lg p-2.5">{error}</div>
      )}

      <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 px-6 py-3.5 text-sm font-semibold text-white shadow-btn hover:shadow-btn-hover transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-70 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className="relative">{loading ? 'Creating...' : 'Create Account'}</span>
      </button>

      <button type="button" onClick={onSwitchToLogin} className="text-sm text-primary-500 hover:text-primary-600 transition-colors flex items-center justify-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary-400 to-accent-500" />
        Already have an account? Log in
      </button>
    </form>
  );
}

/* =============================================
   AUTH MODAL (Main Export)
   ============================================= */
export default function AuthModal({ isOpen, onClose, onLogin }) {
  const [mode, setMode] = useState('login');

  function handleLogin(user) {
    onLogin(user);
    onClose();
  }

  function handleSignup() {
    setMode('login');
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
          >
            <div className="relative w-full max-w-md bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_8px_40px_rgba(6,182,212,0.15)] border border-primary-100/50 p-8 overflow-hidden">
              
              {/* Floating Background Elements */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-4 left-4 w-6 h-6 rounded-lg bg-primary-100/50 flex items-center justify-center animate-float">
                  <MapPin className="w-3 h-3 text-primary-400" />
                </div>
                <div className="absolute top-8 right-8 w-5 h-5 rounded-md bg-accent-100/50 flex items-center justify-center animate-float-slow">
                  <Globe className="w-2.5 h-2.5 text-accent-400" />
                </div>
                <div className="absolute bottom-8 left-8 w-4 h-4 rounded-full bg-primary-100/50 flex items-center justify-center animate-float-delayed">
                  <Zap className="w-2 h-2 text-primary-400" />
                </div>
                <div className="absolute bottom-4 right-4 w-5 h-5 rounded-sm bg-accent-100/50 flex items-center justify-center animate-float">
                  <BarChart3 className="w-2.5 h-2.5 text-accent-400" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 to-accent-50/20" />
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-all duration-300 z-20"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="relative z-10 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center shadow-soft animate-float">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold font-display gradient-text">
                    {mode === 'login' ? 'Welcome to GeoBoost' : 'Join GeoBoost'}
                  </h2>
                </div>
                <p className="text-sm text-primary-600 leading-relaxed">
                  {mode === 'login'
                    ? <>Access your AI-powered tourism dashboard and optimize campaigns. Use <b>Demo</b> credentials to explore.</>
                    : 'Create your account and start boosting regional tourism with AI.'}
                </p>
              </div>

              {/* Forms */}
              <div className="relative z-10">
                <AnimatePresence mode="wait">
                  {mode === 'login' ? (
                    <motion.div key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}>
                      <LoginForm onLogin={handleLogin} onSwitchToSignup={() => setMode('signup')} />
                    </motion.div>
                  ) : (
                    <motion.div key="signup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                      <SignupForm onSignup={handleSignup} onSwitchToLogin={() => setMode('login')} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
