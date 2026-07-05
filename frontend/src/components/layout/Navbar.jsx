import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, BarChart3, Zap, Users, LogIn } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

/* Inline SVG Logo Component */
function GeoBoostLogo({ size = 36 }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center shadow-soft"
    >
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L12 12" />
        <path d="M12 12L18 8" />
        <path d="M12 12L6 8" />
        <circle cx="12" cy="18" r="4" fill="white" stroke="none" opacity="0.3" />
        <path d="M12 2L16 6" />
        <path d="M12 2L8 6" />
      </svg>
    </div>
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  const navLinks = [
    { label: 'Home', href: '/', icon: <Home className="w-4 h-4" /> },
    { label: 'Features', href: '/#features', icon: <Zap className="w-4 h-4" /> },
    { label: 'Analytics', href: '/#analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'About', href: '/#about', icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-xl border-b border-primary-100/50 shadow-soft'
            : 'bg-transparent'
        }`}
      >
        <nav className="section-container flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <GeoBoostLogo size={36} />
            <span className="font-display font-bold text-xl text-gray-800 tracking-tight">
              Geo<span className="gradient-text">Boost</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 hover:text-primary-600 rounded-lg hover:bg-primary-50/50 transition-all duration-200"
              >
                <span className="text-primary-400">{link.icon}</span>
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/CampaignUploader"
              className="btn-primary text-sm !px-5 !py-2.5 gap-2"
            >
              <LogIn className="w-4 h-4" />
              Get Started
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-16 z-40 p-4 md:hidden"
          >
            <div className="glass-strong rounded-2xl p-4 space-y-1 shadow-soft-lg">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:text-primary-600 rounded-xl hover:bg-primary-50/50 transition-colors"
                >
                  <span className="text-primary-400">{link.icon}</span>
                  {link.label}
                </a>
              ))}
              <div className="pt-2 border-t border-primary-100/30">
                <Link
                  to="/CampaignUploader"
                  className="block text-center btn-primary mt-2"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
