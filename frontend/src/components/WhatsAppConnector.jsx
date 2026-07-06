import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, CheckCircle2, AlertCircle, Loader2, RefreshCw, LogOut, MessageSquare } from 'lucide-react';

export default function WhatsAppConnector({ userId, onConnectionChange }) {
  const [status, setStatus] = useState('disconnected'); // 'loading', 'qr_ready', 'ready', 'disconnected'
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [error, setError] = useState(null);
  const [pollingActive, setPollingActive] = useState(false);

  const backendUrl = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:5000';

  // Check connection status on load
  useEffect(() => {
    if (userId) {
      checkStatus();
    }
  }, [userId]);

  // Polling loop to fetch QR and status updates
  useEffect(() => {
    let intervalId = null;

    if (pollingActive && userId) {
      intervalId = setInterval(async () => {
        try {
          const res = await fetch(`${backendUrl}/api/notifications/status?userId=${encodeURIComponent(userId)}`);
          const data = await res.json();
          
          if (res.ok) {
            setStatus(data.status);
            
            if (data.status === 'ready') {
              setPollingActive(false);
              setQrDataUrl(null);
              if (onConnectionChange) onConnectionChange(true);
            } else if (data.status === 'qr_ready') {
              fetchQrCode();
            } else if (data.status === 'disconnected') {
              setPollingActive(false);
              setQrDataUrl(null);
            }
          }
        } catch (err) {
          console.error('Failed to poll status:', err);
        }
      }, 3000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [pollingActive, userId]);

  const checkStatus = async () => {
    try {
      setError(null);
      const res = await fetch(`${backendUrl}/api/notifications/status?userId=${encodeURIComponent(userId)}`);
      const data = await res.json();
      if (res.ok) {
        setStatus(data.status);
        if (data.status === 'ready') {
          if (onConnectionChange) onConnectionChange(true);
        } else if (data.status === 'qr_ready' || data.status === 'loading') {
          setPollingActive(true);
          if (data.status === 'qr_ready') fetchQrCode();
        }
      }
    } catch (err) {
      setError('Could not connect to authentication backend.');
    }
  };

  const fetchQrCode = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/notifications/qr?userId=${encodeURIComponent(userId)}`);
      const data = await res.json();
      if (res.ok) {
        setQrDataUrl(data.qrCodeDataUrl);
      }
    } catch (err) {
      console.error('Failed to fetch QR:', err);
    }
  };

  const handleConnect = async () => {
    setError(null);
    setStatus('loading');
    setPollingActive(true);

    try {
      const res = await fetch(`${backendUrl}/api/notifications/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || 'Failed to initialize WhatsApp connection.');
      }
    } catch (err) {
      setError(err.message);
      setStatus('disconnected');
      setPollingActive(false);
    }
  };

  const handleDisconnect = async () => {
    setError(null);
    setStatus('loading');
    setPollingActive(false);

    try {
      const res = await fetch(`${backendUrl}/api/notifications/disconnect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (res.ok) {
        setStatus('disconnected');
        setQrDataUrl(null);
        if (onConnectionChange) onConnectionChange(false);
      } else {
        const result = await res.json();
        throw new Error(result.error || 'Failed to disconnect.');
      }
    } catch (err) {
      setError(err.message);
      checkStatus();
    }
  };

  return (
    <div className="glass-card p-6 md:p-8 space-y-6 relative z-10 text-left">
      <div className="flex items-start justify-between border-b border-primary-100/20 pb-4">
        <div>
          <h2 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-500" /> WhatsApp Outreach Connector
          </h2>
          <p className="text-xs text-slate-400 mt-1">Link your personal phone to dispatch personalized guest campaigns.</p>
        </div>
        <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ring-1 ${
          status === 'ready' 
            ? 'bg-emerald-50 text-emerald-600 ring-emerald-500/25'
            : status === 'qr_ready'
            ? 'bg-amber-50 text-amber-600 ring-amber-500/25'
            : status === 'loading'
            ? 'bg-blue-50 text-blue-600 ring-blue-500/25 animate-pulse'
            : 'bg-slate-50 text-slate-500 ring-slate-500/10'
        }`}>
          {status === 'ready' ? 'Connected' : status === 'qr_ready' ? 'Ready to Scan' : status === 'loading' ? 'Initializing' : 'Disconnected'}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {status === 'disconnected' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4 py-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <QrCode className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto">
              <p className="text-sm font-semibold text-slate-700">Link Your WhatsApp Account</p>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Connect your account to send custom campaigns directly from your phone. Clicking below will load a QR connection code to scan.
              </p>
            </div>
            <button onClick={handleConnect} className="btn-glow !px-8 py-3 mx-auto">
              Get QR Code
            </button>
          </motion.div>
        )}

        {status === 'loading' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-8 flex flex-col items-center justify-center text-center space-y-4">
            <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
            <div>
              <p className="text-sm font-semibold text-slate-700">Preparing QR Session</p>
              <p className="text-xs text-slate-400 mt-1">Starting a secure headless browser. This may take up to 10 seconds...</p>
            </div>
          </motion.div>
        )}

        {status === 'qr_ready' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col md:flex-row items-center gap-6 py-4">
            <div className="w-48 h-48 bg-white border border-slate-100 p-3 rounded-2xl shadow-sm flex items-center justify-center shrink-0">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="WhatsApp Web QR Code" className="w-full h-full" />
              ) : (
                <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
              )}
            </div>
            <div className="space-y-3.5 text-center md:text-left">
              <h3 className="font-semibold text-slate-800 text-sm">Scan with your WhatsApp App</h3>
              <ol className="text-xs text-slate-500 space-y-2 list-decimal pl-4 leading-relaxed font-medium">
                <li>Open <b>WhatsApp</b> on your mobile device.</li>
                <li>Tap <b>Menu</b> (Android) or <b>Settings</b> (iOS) and select <b>Linked Devices</b>.</li>
                <li>Tap on <b>Link a Device</b> and point your camera to this screen to scan.</li>
              </ol>
              <div className="flex gap-2 justify-center md:justify-start pt-2">
                <button onClick={checkStatus} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors font-bold">
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh Status
                </button>
                <span className="text-slate-200">|</span>
                <button onClick={handleDisconnect} className="text-xs text-red-500 hover:text-red-600 transition-colors font-bold">
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {status === 'ready' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-between py-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-[0_4px_10px_rgba(16,185,129,0.2)]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Connection Active</p>
                <p className="text-xs text-emerald-600 mt-0.5 font-medium">Outbound outreach will now deliver from your phone.</p>
              </div>
            </div>
            <button onClick={handleDisconnect} className="flex items-center gap-1.5 px-3 py-2 border border-red-200 hover:bg-red-50 rounded-lg text-xs font-bold text-red-600 transition-colors">
              <LogOut className="w-3.5 h-3.5" /> Disconnect
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-100 flex items-start gap-2.5 text-xs text-red-600">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <span className="font-semibold">{error}</span>
        </div>
      )}
    </div>
  );
}
