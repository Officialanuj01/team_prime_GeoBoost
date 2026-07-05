import React, { useMemo, useState } from 'react';
import { Github, Linkedin, Mail, X, Construction } from 'lucide-react';
import { Link } from 'react-router-dom';

const useFooterData = () => {
  const creators = useMemo(() => [
    { name: 'Anuj Sahu', role: 'Full Stack Developer', linkedin: 'https://www.linkedin.com/in/anuj-sahu-4059bb253/' },
    { name: 'Saksham Gupta', role: 'Full Stack Developer', linkedin: 'https://www.linkedin.com/in/saksham-gupta-87a1a427b/' },
    { name: 'Devraj Patil', role: 'Full Stack Developer', linkedin: 'https://www.linkedin.com/in/devraj-patil-0944b22b5/' },
  ], []);

  const links = useMemo(() => ({
    Product: [
      { name: 'Features', href: '/features' },
      { name: 'Upload Data', href: '/upload' },
      { name: 'About', href: '/about' },
    ],
    Legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
    ],
  }), []);

  return { creators, links };
};

const validRoutes = ['/', '/features', '/upload', '/CampaignUploader', '/about'];

export default function Footer() {
  const { creators, links } = useFooterData();
  const [showDevModal, setShowDevModal] = useState(false);

  const handleLinkClick = (e, href) => {
    if (href.startsWith('/') && !validRoutes.includes(href)) {
      e.preventDefault();
      setShowDevModal(true);
    }
  };

  return (
    <footer className="relative bg-surface-100 border-t border-primary-100/30">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-400/40 to-transparent" />

      <div className="section-container py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center shadow-soft">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L12 12" /><path d="M12 12L18 8" /><path d="M12 12L6 8" />
                  <path d="M12 2L16 6" /><path d="M12 2L8 6" />
                </svg>
              </div>
              <span className="font-display font-bold text-lg text-gray-800">
                Geo<span className="gradient-text">Boost</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs mb-5">
              AI-powered tourism campaign optimization. Driving regional growth for tourism boards and partner hotels.
            </p>
            <div className="flex gap-3">
              <a href="https://github.com/Officialanuj01/team_prime_GeoBoost" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-primary-600 bg-white hover:bg-primary-50 border border-gray-100 hover:border-primary-200 transition-all duration-300 shadow-sm">
                <Github className="w-4 h-4" />
              </a>
              <a href="mailto:demo@geoboost.ai"
                className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-primary-600 bg-white hover:bg-primary-50 border border-gray-100 hover:border-primary-200 transition-all duration-300 shadow-sm">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h3 className="font-display font-semibold text-sm text-gray-800 mb-4">{category}</h3>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      onClick={(e) => handleLinkClick(e, item.href)}
                      className="text-sm text-gray-500 hover:text-primary-600 transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Creators */}
        <div className="border-t border-gray-100 pt-8 mb-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Built by Team Prime · Google Solution Challenge 2026</p>
          <div className="flex flex-wrap gap-3">
            {creators.map((creator) => (
              <a
                key={creator.name}
                href={creator.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white border border-gray-100 hover:border-primary-200 hover:shadow-soft transition-all duration-300 group"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {creator.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">{creator.name}</p>
                  <p className="text-[11px] text-gray-400">{creator.role}</p>
                </div>
                <Linkedin className="w-3.5 h-3.5 text-gray-300 group-hover:text-primary-500 transition-colors ml-1" />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} GeoBoost. All rights reserved.</p>
          <p className="text-xs text-gray-400">Built with ♥ for the tourism industry</p>
        </div>
      </div>

      {/* Coming Soon Modal */}
      {showDevModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-accent-50 opacity-50" />
            <div className="relative p-8 text-center">
              <button onClick={() => setShowDevModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                <X className="w-4 h-4 text-gray-600" />
              </button>
              <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Construction className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Coming Soon!</h3>
              <p className="text-gray-500 text-sm mb-6">This page is currently under development. Stay tuned!</p>
              <button onClick={() => setShowDevModal(false)}
                className="btn-glow text-sm px-6 py-2.5">
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
