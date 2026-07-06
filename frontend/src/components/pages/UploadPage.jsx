import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, X, Sparkles, FileSpreadsheet, AlertCircle,
  TrendingUp, TrendingDown, Percent, Calendar, Award,
  ShieldAlert, BadgeDollarSign, Users, Package, Compass,
  ChevronDown, ChevronUp, CheckCircle2, Database, Play,
  MessageSquare, Send, Bell, Zap, RefreshCw, BarChart3,
  ArrowUpRight, ArrowDownRight, Megaphone, Hourglass, XCircle,
  Shield, Check, Bed
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../../authentication/AuthModal';

import DEMO_CSV from '../../data/sample_occupancy.csv?raw';

// ─── Default Preview Mock Data (Matches Screenshot Exactly) ─────────────────
const PREVIEW_DATA = {
  kpis: {
    average_occupancy: 72,
    peak_day: 'Sat, 12 Jul',
    growth_percent: 18.4,
    trend: 'Increasing'
  },
  forecast: [
    { date: '2026-07-07', predicted_occupancy: 82, lower_bound: 76, upper_bound: 88 },
    { date: '2026-07-08', predicted_occupancy: 89, lower_bound: 83, upper_bound: 93 }
  ],
  daily_insights: [
    { date: '2026-07-07', day: 'Tuesday', predicted_occupancy: 82, dashboard_badge: 'Medium', headline: 'Moderate weekday demand spike', summary: 'Stable occupancy levels expected. No immediate pricing actions needed.', recommended_action: 'Maintain regular mid-week dynamic rates.', risk: 'Lower walk-in conversions expected.' },
    { date: '2026-07-08', day: 'Wednesday', predicted_occupancy: 89, dashboard_badge: 'High', headline: 'Summer peak festival demand', summary: 'High volume regional influx expected. Capacity heading to ceiling.', recommended_action: 'Increase rates by 12% across Premium suites.', risk: 'Risk of double-bookings due to cross-channel sync lags.' }
  ],
  business_actions: {
    pricing: 'Increase prices on weekends near events.',
    staffing: 'Add more staff on peak days (12-13 Jul).',
    inventory: 'Increase F&B stocks for high demand period.',
    marketing: 'Run targeted campaigns for weekend stays.'
  },
  records_analyzed: 25
};

const BADGE_STYLES = {
  critical: 'bg-rose-50 text-rose-600 ring-1 ring-rose-500/10',
  high:     'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/10',
  medium:   'bg-amber-50 text-amber-600 ring-1 ring-amber-500/10',
  low:      'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-500/10',
  optimize: 'bg-cyan-50 text-cyan-600 ring-1 ring-cyan-500/10',
  prepare:  'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-500/10',
};
const getBadgeClass = (b) => BADGE_STYLES[b?.toLowerCase()] || 'bg-gray-50 text-gray-500 ring-1 ring-gray-500/20';

const SEGMENT_DATA = {
  'Leisure Weekend Travelers': { size: 340, uplift: '8.4%', sent: 322, failed: 18 },
  'Weekday Corporate Executives': { size: 185, uplift: '5.2%', sent: 180, failed: 5 },
  'Regional Festival Inbound': { size: 620, uplift: '12.6%', sent: 595, failed: 25 }
};

// ─── Compact Forecast Chart Component ───
function ForecastChart({ data }) {
  if (!data || !data.length) return null;

  const w = 500;
  const h = 140;
  const pl = 30;
  const pr = 10;
  const pt = 15;
  const pb = 20;
  const cw = w - pl - pr;
  const ch = h - pt - pb;

  const allVals = data.flatMap(d => [d.predicted_occupancy, d.upper_bound, d.lower_bound]);
  const yMax = Math.min(100, Math.ceil(Math.max(...allVals) + 5));
  const yMin = Math.max(0, Math.floor(Math.min(...allVals) - 5));
  const yRange = yMax - yMin || 1;

  const getX = i => pl + (i * cw / Math.max(data.length - 1, 1));
  const getY = v => pt + ch - ((v - yMin) / yRange) * ch;

  const mainLine = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.predicted_occupancy)}`).join(' ');
  const areaTop = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.upper_bound)}`).join(' ');
  const areaBot = [...data].reverse().map((d, i) => `L ${getX(data.length - 1 - i)} ${getY(d.lower_bound)}`).join(' ');
  const confidencePath = `${areaTop} ${areaBot} Z`;

  const gradientArea = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.predicted_occupancy)}`).join(' ')
    + ` L ${getX(data.length - 1)} ${h - pb} L ${getX(0)} ${h - pb} Z`;

  const yTicks = [yMin, yMin + yRange / 2, yMax];

  return (
    <div className="relative">
      <svg className="w-full h-[170px]" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="chart-conf-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Horizontal grids */}
        {yTicks.map((t, i) => (
          <g key={i}>
            <line x1={pl} y1={getY(t)} x2={w - pr} y2={getY(t)} stroke="#f1f5f9" strokeWidth="1" />
            <text x={pl - 6} y={getY(t) + 3} textAnchor="end" className="text-[8px] fill-slate-400 font-bold">{Math.round(t)}%</text>
          </g>
        ))}

        {/* Shaded confidence interval band */}
        <path d={confidencePath} fill="url(#chart-conf-grad)" />

        {/* Shaded main gradient area */}
        <path d={gradientArea} fill="url(#chart-area-grad)" />

        {/* Dotted confidence boundaries */}
        <path d={data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.upper_bound)}`).join(' ')} fill="none" stroke="#22d3ee" strokeWidth="0.75" strokeDasharray="3 2" opacity="0.5" />
        <path d={data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.lower_bound)}`).join(' ')} fill="none" stroke="#22d3ee" strokeWidth="0.75" strokeDasharray="3 2" opacity="0.5" />

        {/* Main occupancy line */}
        <path d={mainLine} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Circles on dots */}
        {data.map((d, i) => (
          <g key={i}>
            <circle cx={getX(i)} cy={getY(d.predicted_occupancy)} r="3" fill="white" stroke="#3b82f6" strokeWidth="1.5" />
            <circle cx={getX(i)} cy={getY(d.predicted_occupancy)} r="1" fill="#22d3ee" />
            <text x={getX(i)} y={getY(d.predicted_occupancy) - 6} textAnchor="middle" className="text-[8px] font-extrabold fill-blue-600">
              {Math.round(d.predicted_occupancy)}%
            </text>
            <text x={getX(i)} y={h - 3} textAnchor="middle" className="text-[7.5px] font-semibold fill-slate-400">
              {d.date?.substring(5)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function UploadPage() {
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null);
  
  // Settings context checkboxes
  const [includeEvents, setIncludeEvents] = useState(true);
  const [includePromotions, setIncludePromotions] = useState(true);
  const [includeWeather, setIncludeWeather] = useState(false);

  // WhatsApp settings (read-only for future integration)
  const [audienceSegment, setAudienceSegment] = useState('Leisure Weekend Travelers');
  const [messageTemplate, setMessageTemplate] = useState('Festival Offer Template');
  const [campaignStatus, setCampaignStatus] = useState('Draft'); // 'Draft', 'Sending', 'Completed'
  const [isCampaignSending, setIsCampaignSending] = useState(false);

  useEffect(() => {
    setCampaignStatus('Draft');
  }, [audienceSegment]);

  const triggerCampaign = () => {
    if (isCampaignSending) return;
    setIsCampaignSending(true);
    setCampaignStatus('Sending');
    setTimeout(() => {
      setIsCampaignSending(false);
      setCampaignStatus('Completed');
    }, 1200);
  };

  // Retry states
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [retryCountdown, setRetryCountdown] = useState(null);
  const countdownIntervalRef = useRef(null);

  // Load state from localStorage or use preview mode by default
  const [parsedData, setParsedData] = useState(() => {
    try {
      const s = localStorage.getItem('geoboost_parsed_data');
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });

  useEffect(() => {
    if (parsedData) {
      localStorage.setItem('geoboost_parsed_data', JSON.stringify(parsedData));
    } else {
      localStorage.removeItem('geoboost_parsed_data');
    }
  }, [parsedData]);

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const s = localStorage.getItem('geoboost_user');
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });
  const [showAuthModal, setShowAuthModal] = useState(true);

  const handleLogin = (u) => { setCurrentUser(u); setShowAuthModal(false); window.location.reload(); };
  const handleCloseAuth = () => { setShowAuthModal(false); navigate('/'); };

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, []);

  // Timer Effect
  useEffect(() => {
    if (retryCountdown === null) return;
    if (retryCountdown === 0) {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
      setRetryCountdown(null);
      runForecast();
      return;
    }
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    countdownIntervalRef.current = setInterval(() => {
      setRetryCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [retryCountdown]);

  if (!currentUser) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-gradient-hero flex flex-col items-center justify-center">
        <div className="deco-circle deco-circle-cyan w-[300px] h-[300px] -top-20 -right-20 fixed" />
        <div className="deco-circle deco-circle-blue w-[200px] h-[200px] bottom-20 -left-20 fixed" />
        <div className="flex-1 flex flex-col items-center justify-center z-10">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500 font-semibold">Sign in to continue...</p>
        </div>
        <AuthModal isOpen={showAuthModal} onClose={handleCloseAuth} onLogin={handleLogin} />
      </div>
    );
  }

  // File Handlers
  const onFileChange = (e) => {
    const f = e.target.files[0];
    if (f) { setUploadedFile(f); setError(null); }
  };
  const onDrop = (e) => {
    e.preventDefault(); setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) { setUploadedFile(f); setError(null); }
  };
  const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);

  const clearAll = () => {
    setUploadedFile(null);
    setParsedData(null);
    setError(null);
    setRetryAttempt(0);
    setRetryCountdown(null);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  };

  const loadDemo = () => {
    const f = new File([new Blob([DEMO_CSV], { type: 'text/csv' })], 'sample_occupancy.csv', { type: 'text/csv' });
    setUploadedFile(f);
    setError(null);
  };

  const handleModelNotReady = () => {
    const nextAttempt = retryAttempt + 1;
    if (nextAttempt > 3) {
      setError("Vertex AI Endpoint failed to scale up from zero. Please try again in a few minutes.");
      setRetryAttempt(0);
      setRetryCountdown(null);
      return;
    }
    setError(null);
    setRetryAttempt(nextAttempt);
    const duration = nextAttempt === 1 ? 30 : nextAttempt === 2 ? 60 : 120;
    setRetryCountdown(duration);
  };

  const handleRetryNow = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setRetryCountdown(null);
    runForecast();
  };

  const runForecast = async () => {
    if (!uploadedFile) return;
    setIsProcessing(true); setError(null);
    const fd = new FormData();
    fd.append('file', uploadedFile);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/forecast`, { method: 'POST', body: fd });
      if (!res.ok) {
        let t = '';
        let isModelNotReady = false;
        try {
          const j = await res.json();
          t = j.detail || JSON.stringify(j);
          if (t.includes("Model is not yet ready for inference") || t.includes("scale-up from zero")) {
            isModelNotReady = true;
          }
        } catch {
          t = await res.text();
          if (t.includes("Model is not yet ready for inference") || t.includes("scale-up from zero")) {
            isModelNotReady = true;
          }
        }
        if (isModelNotReady) {
          handleModelNotReady();
          return;
        }
        throw new Error(t || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setParsedData(data);
      setRetryAttempt(0);
      setRetryCountdown(null);
    } catch (e) {
      setError(e.message || 'Forecast failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Determine active dataset (dynamic uploaded data vs exact screenshot preview data)
  // Determine active dataset
  const activeData = parsedData;

  if (!parsedData) {
    return (
      <div className="relative min-h-screen pt-24 pb-16 bg-gradient-hero flex flex-col items-center justify-center px-4">
        {/* Background Decors */}
        <div className="deco-circle deco-circle-cyan w-[400px] h-[400px] -top-20 -left-20 fixed" />
        <div className="deco-circle deco-circle-blue w-[400px] h-[400px] bottom-0 -right-20 fixed" />
        
        <div className="w-full max-w-2xl glass-card p-6 sm:p-10 z-10 space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 text-indigo-600 text-[11px] font-bold uppercase tracking-wider ring-1 ring-indigo-500/20">
                <Database className="w-3 h-3" /> AI Forecasting Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 font-display">
              Initiate Tourism <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">Analysis</span>
            </h1>
            <p className="text-xs text-slate-400 font-semibold max-w-md mx-auto leading-relaxed">
              Upload regional occupancy CSV data to run predictive models, evaluate regional risks, and generate strategic recommendations.
            </p>
          </div>

          {/* Large Upload Box */}
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => !uploadedFile && document.getElementById('initiate-file-selector').click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer relative ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50/20 shadow-inner'
                : uploadedFile
                ? 'border-emerald-300 bg-emerald-50/10'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
            }`}
          >
            <input
              id="initiate-file-selector"
              type="file"
              accept=".csv"
              onChange={onFileChange}
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center gap-3">
              {uploadedFile ? (
                <>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{uploadedFile.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                      {(uploadedFile.size / 1024).toFixed(1)} KB • CSV Spreadsheet
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      clearAll();
                    }}
                    className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 text-[10px] font-bold rounded-lg transition-colors border border-rose-200/50"
                  >
                    Remove File
                  </button>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-100">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">Drag and drop regional occupancy CSV here</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-1">or click to browse local files</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-4">
            <button
              onClick={loadDemo}
              disabled={isProcessing}
              className="w-full sm:w-auto btn-secondary"
            >
              <Database className="w-4 h-4 mr-2" /> Load Demo Data
            </button>
            <button
              onClick={runForecast}
              disabled={isProcessing || !uploadedFile}
              className={`w-full sm:w-auto btn-primary ${
                isProcessing || !uploadedFile
                  ? 'opacity-60 cursor-not-allowed hover:transform-none hover:shadow-btn'
                  : ''
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-current" /> Analyse & Run Forecast
                </>
              )}
            </button>
          </div>

          {/* Vertex Retry Card and Errors */}
          {(error || retryCountdown !== null) && (
            <div className="pt-4 border-t border-slate-100 space-y-3">
              {retryCountdown !== null ? (
                <div className="bg-amber-50/40 border border-amber-100 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Forecast Engine Scale-up In Progress</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                        Vertex AI endpoint is waking up from zero. Retrying in <span className="font-extrabold text-amber-600">{retryCountdown}s</span> (Attempt {retryAttempt}/3).
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRetryNow}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all shrink-0"
                  >
                    Send Now
                  </button>
                </div>
              ) : (
                <div className="bg-rose-50/40 border border-rose-100 rounded-xl p-4 flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                    <AlertCircle className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Analysis Error</h4>
                    <p className="text-[10px] text-rose-600 mt-0.5 leading-relaxed font-semibold">
                      {error}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Solution Overview Footer */}
        <div className="mt-8 text-center text-[10px] text-slate-400 font-medium z-10">
          GeoBoost solution is powered by Google Vertex AI dedicated predictive models.
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pt-24 pb-12 bg-gradient-hero">
      {/* Background Decors */}
      <div className="deco-circle deco-circle-cyan w-[400px] h-[400px] -top-20 -right-20 fixed" />
      <div className="deco-circle deco-circle-blue w-[400px] h-[400px] bottom-0 -left-20 fixed" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Global Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-4 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 flex gap-3 items-start text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <div><p className="font-bold">Forecast Error</p><p className="text-xs opacity-80 mt-0.5">{error}</p></div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* ─── SIDEPANEL + DASHBOARD GRID LAYOUT CONTAINER ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

          {/* ═════════════════════════════════════════════════════════════════
              LEFT SIDEBAR: CONTROLS & MARKETING STACK (span 1)
              ═════════════════════════════════════════════════════════════════ */}
          <div className="col-span-1 space-y-6">
            
            {/* Box 1: Upload Regional Data */}
            <div className="glass-card p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-800">Upload Regional Data</h3>
              
              <div
                onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}
                onClick={() => !uploadedFile && document.getElementById('csv-file-selector').click()}
                className={`border-2 border-dashed rounded-lg p-5 text-center transition-all ${
                  isDragging ? 'border-blue-500 bg-blue-50/50' :
                  uploadedFile ? 'border-emerald-300 bg-emerald-50/10' :
                  'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 cursor-pointer'
                }`}
              >
                <input id="csv-file-selector" type="file" accept=".csv" onChange={onFileChange} className="hidden" />
                
                {uploadedFile ? (
                  <div className="flex flex-col items-center gap-1.5">
                    <FileSpreadsheet className="w-7 h-7 text-emerald-500" />
                    <p className="text-xs font-bold text-slate-700 truncate max-w-full">{uploadedFile.name}</p>
                    <p className="text-[10px] text-slate-400">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                    <button onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }} className="text-[10px] text-rose-500 font-bold hover:underline mt-1">Remove</button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                      <Upload className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700">Choose CSV File</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">or drag and drop</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Upload Action / Demo Data */}
              <div className="flex flex-col gap-2">
                {!uploadedFile ? (
                  <button onClick={loadDemo} className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5">
                    <Database className="w-3.5 h-3.5" /> Load Demo Data
                  </button>
                ) : (
                  <button onClick={clearAll} className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-rose-600 text-xs font-bold rounded-lg transition-colors">
                    Clear Data
                  </button>
                )}
              </div>
            </div>

            {/* Box 2: Forecast Status */}
            <div className="glass-card p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-800">Forecast Status</h3>
              <div className="space-y-3">
                <button
                  onClick={runForecast}
                  disabled={!uploadedFile || isProcessing}
                  className={`w-full py-3 rounded-lg text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md ${
                    uploadedFile && !isProcessing
                      ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98]'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isProcessing ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Computing...</>
                  ) : (
                    <><Play className="w-4 h-4 fill-current" /> Run Forecast</>
                  )}
                </button>

                {/* Status Bar */}
                <div className="flex items-center gap-2 px-1">
                  <div className={`w-2 h-2 rounded-full ${uploadedFile ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                  <span className="text-[11px] font-bold text-slate-500">
                    Status: {uploadedFile ? 'Ready' : 'Awaiting CSV'}
                  </span>
                </div>
              </div>
            </div>

            {/* Box 3: Personalized Messaging (WhatsApp) */}
            <div className="glass-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800">Personalized Messaging</h3>
                <span className="text-[9px] font-bold uppercase text-emerald-600 bg-emerald-50 ring-1 ring-emerald-500/10 px-2 py-0.5 rounded">
                  WhatsApp
                </span>
              </div>

              {/* Dropdown: Audience Segment */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Audience Segment</label>
                <div className="relative">
                  <select
                    value={audienceSegment}
                    onChange={e => setAudienceSegment(e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 pl-3 pr-8 font-medium text-slate-700 outline-none focus:border-slate-300 focus:bg-white appearance-none cursor-pointer"
                  >
                    <option>Leisure Weekend Travelers</option>
                    <option>Weekday Corporate Executives</option>
                    <option>Regional Festival Inbound</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Dropdown: Template */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Template</label>
                <div className="relative">
                  <select
                    value={messageTemplate}
                    onChange={e => setMessageTemplate(e.target.value)}
                    className="w-full text-xs rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 pl-3 pr-8 font-medium text-slate-700 outline-none focus:border-slate-300 focus:bg-white appearance-none cursor-pointer"
                  >
                    <option>Festival Offer Template</option>
                    <option>Early Bird Occupancy Incentive</option>
                    <option>Mid-Week Vacancy Flash Offer</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Preview block */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Message Preview</label>
                <div className="bg-blue-50/30 border border-blue-100 rounded-lg p-3 text-xs text-slate-600 leading-relaxed font-medium">
                  Hi <span className="text-blue-600 font-bold">{"{{name}}"}</span>, rooms near <span className="text-blue-600 font-bold">{"{{event}}"}</span> are filling fast.
                  <br/><br/>
                  Book now for <span className="text-blue-600 font-bold">{"{{discount}}"}% off</span> in <span className="text-blue-600 font-bold">{"{{city}}"}</span>.
                </div>
              </div>

              {/* Messaging controls */}
              <div className="flex gap-2">
                <button
                  onClick={() => navigate('/NotificationSender')}
                  className="flex-1 py-2 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors flex items-center justify-center gap-1 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" /> Open Messaging Page
                </button>
              </div>
            </div>

            {/* Box 4: Team DSA Creators */}
            <div className="glass-card p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Team DSA</h3>
                </div>
                <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 font-bold text-xs">
                  DSA
                </div>
              </div>

              <div className="space-y-3">
                {[
                  {
                    name: 'Devraj Patil',
                    role: 'Full Stack Developer',
                    initials: 'DP',
                    color: 'from-pink-500 to-rose-500',
                    link: 'https://www.linkedin.com/in/devraj-patil-0944b22b5/'
                  },
                  {
                    name: 'Saksham Gupta',
                    role: 'Full Stack Developer',
                    initials: 'SG',
                    color: 'from-indigo-500 to-cyan-500',
                    link: 'https://www.linkedin.com/in/saksham-gupta-87a1a427b/'
                  },
                  {
                    name: 'Anuj Sahu',
                    role: 'Full Stack Developer',
                    initials: 'AS',
                    color: 'from-purple-500 to-indigo-500',
                    link: 'https://www.linkedin.com/in/anuj-sahu-4059bb253/'
                  }
                ].map((m, idx) => (
                  <a
                    key={idx}
                    href={m.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${m.color} flex items-center justify-center text-white font-extrabold text-[11px] shadow-sm`}>
                        {m.initials}
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{m.name}</p>
                        <p className="text-[9px] text-slate-400 font-medium">{m.role}</p>
                      </div>
                    </div>
                    {/* LinkedIn icon */}
                    <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current text-slate-400 group-hover:text-blue-600">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* ═════════════════════════════════════════════════════════════════
              RIGHT PANEL: MAIN INSIGHTS & STRATEGIC DASHBOARD (span 3)
              ═════════════════════════════════════════════════════════════════ */}
          <div className="col-span-1 lg:col-span-3 space-y-6">

            {/* Dashboard Sub-Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

              {/* Box 1: KPI Stats Grid */}
              <div className="col-span-12 glass-card p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800">Top KPIs</h3>

                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* KPI 1: Avg Occupancy */}
                  <div className="bg-slate-50/50 rounded-lg p-3 border border-slate-100 flex flex-col justify-between">
                    <div>
                      <p className="text-base font-extrabold text-slate-800 leading-tight">{activeData.kpis.average_occupancy}%</p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Avg Occupancy</p>
                    </div>
                    <div className="h-5 mt-2 overflow-hidden">
                      <svg viewBox="0 0 80 20" className="w-full h-full" preserveAspectRatio="none">
                        <path d="M0 15 Q20 5, 40 12 T80 4" fill="none" stroke="#22d3ee" strokeWidth="1.5" />
                      </svg>
                    </div>
                  </div>

                  {/* KPI 2: Peak Day */}
                  <div className="bg-slate-50/50 rounded-lg p-3 border border-slate-100 flex flex-col justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-extrabold text-slate-800 leading-snug">{activeData.kpis.peak_day}</p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Peak Day</p>
                    </div>
                    <div className="flex justify-end mt-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>

                  {/* KPI 3: Growth % */}
                  <div className="bg-slate-50/50 rounded-lg p-3 border border-slate-100 flex flex-col justify-between">
                    <div>
                      <p className={`text-base font-extrabold leading-tight ${activeData.kpis.growth_percent >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {activeData.kpis.growth_percent >= 0 ? '+' : ''}{activeData.kpis.growth_percent}%
                      </p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Growth %</p>
                    </div>
                    <div className="h-5 mt-2 overflow-hidden">
                      <svg viewBox="0 0 80 20" className="w-full h-full" preserveAspectRatio="none">
                        <path d="M0 18 Q20 12, 40 8 T80 2" fill="none" stroke={activeData.kpis.growth_percent >= 0 ? "#10b981" : "#ef4444"} strokeWidth="1.5" />
                      </svg>
                    </div>
                  </div>

                  {/* KPI 4: Trend */}
                  <div className="bg-slate-50/50 rounded-lg p-3 border border-slate-100 flex flex-col justify-between">
                    <div>
                      <p className="text-xs sm:text-sm font-extrabold text-slate-800 leading-snug">{activeData.kpis.trend}</p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Trend</p>
                    </div>
                    <div className="h-5 mt-2 overflow-hidden">
                      <svg viewBox="0 0 80 20" className="w-full h-full" preserveAspectRatio="none">
                        <path d="M0 12 Q20 18, 40 8 T80 4" fill="none" stroke="#6366f1" strokeWidth="1.5" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Box 2: Weekly Trend Chart */}
              <div className="col-span-12 xl:col-span-8 glass-card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-blue-500" /> Weekly Occupancy Trend
                  </h4>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-semibold">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-0.5 bg-blue-500 inline-block" /> Occupancy</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-cyan-100 ring-1 ring-cyan-200 inline-block rounded" /> Bounds</span>
                  </div>
                </div>
                <div className="pt-2">
                  <ForecastChart data={activeData.forecast} />
                </div>
              </div>

              {/* Box 3: Executive AI Summary */}
              <div className="col-span-12 xl:col-span-4 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-xl p-5 text-white relative overflow-hidden shadow-md flex flex-col justify-center">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur">
                      <Sparkles className="w-4 h-4 text-indigo-300" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs">AI Executive Summary</h3>
                      <p className="text-[9px] text-indigo-300/60">{activeData.records_analyzed} historical intervals evaluated</p>
                    </div>
                  </div>
                  <p className="text-[11px] leading-relaxed text-indigo-100/90">{activeData.summary}</p>
                </div>
              </div>

              {/* Box 4: 7-Day Forecast & Detailed Insights Accordion */}
              <div className="col-span-12 xl:col-span-6 glass-card p-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-800">7-Day Forecast & Daily Insights</h4>
                <div className="border border-slate-100 rounded-lg overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="py-2.5 px-3 text-left font-bold">Date</th>
                        <th className="py-2.5 px-3 text-center font-bold">Predicted</th>
                        <th className="py-2.5 px-3 text-center font-bold">Lower</th>
                        <th className="py-2.5 px-3 text-center font-bold">Upper</th>
                        <th className="py-2.5 px-3 text-center font-bold">Priority</th>
                        <th className="py-2.5 px-3 text-right"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeData.forecast.map((row, idx) => {
                        const isExpanded = expandedDay === idx;
                        const dayInsight = activeData.daily_insights?.[idx];
                        return (
                          <React.Fragment key={idx}>
                            <tr
                              onClick={() => setExpandedDay(isExpanded ? null : idx)}
                              className="border-b border-slate-50 hover:bg-slate-50/50 cursor-pointer last:border-none transition-colors"
                            >
                              <td className="py-2.5 px-3 font-semibold text-slate-700">
                                {dayInsight ? `${dayInsight.day}, ${row.date.substring(5)}` : row.date}
                              </td>
                              <td className="py-2.5 px-3 text-center font-extrabold text-blue-600">{Math.round(row.predicted_occupancy)}%</td>
                              <td className="py-2.5 px-3 text-center text-slate-400">{Math.round(row.lower_bound)}%</td>
                              <td className="py-2.5 px-3 text-center text-slate-400">{Math.round(row.upper_bound)}%</td>
                              <td className="py-2.5 px-3 text-center">
                                {dayInsight && (
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${getBadgeClass(dayInsight.dashboard_badge)}`}>
                                    {dayInsight.dashboard_badge}
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400 inline" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400 inline" />}
                              </td>
                            </tr>
                            
                            {/* Expanded detail box */}
                            <AnimatePresence>
                              {isExpanded && dayInsight && (
                                <tr>
                                  <td colSpan="6" className="bg-slate-50/60 p-4 border-b border-slate-100">
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                      className="space-y-3 text-xs"
                                    >
                                      <div className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                        <div>
                                          <p className="font-bold text-slate-800">{dayInsight.headline}</p>
                                          <p className="text-slate-500 mt-0.5 leading-relaxed">{dayInsight.summary}</p>
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                        <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-2.5">
                                          <p className="font-bold text-emerald-700 text-[10px] uppercase tracking-wider flex items-center gap-1">
                                            <Check className="w-3.5 h-3.5" /> Recommended Action
                                          </p>
                                          <p className="text-slate-600 mt-1 leading-relaxed text-[11px]">{dayInsight.recommended_action}</p>
                                        </div>
                                        <div className="bg-rose-50/50 border border-rose-100 rounded-lg p-2.5">
                                          <p className="font-bold text-rose-700 text-[10px] uppercase tracking-wider flex items-center gap-1">
                                            <ShieldAlert className="w-3.5 h-3.5" /> Key Risk
                                          </p>
                                          <p className="text-slate-600 mt-1 leading-relaxed text-[11px]">{dayInsight.risk}</p>
                                        </div>
                                      </div>
                                    </motion.div>
                                  </td>
                                </tr>
                              )}
                            </AnimatePresence>
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Box 5: AI Strategic Actions */}
              <div className="col-span-12 xl:col-span-6 glass-card p-5 space-y-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Strategic AI Recommendations</h4>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {/* Pricing */}
                    <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 text-left flex flex-col items-start gap-1">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                        <BadgeDollarSign className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-800 mt-1">Pricing Strategy</span>
                      <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5 line-clamp-3">{activeData.business_actions.pricing}</p>
                    </div>

                    {/* Staffing */}
                    <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 text-left flex flex-col items-start gap-1">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                        <Users className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-800 mt-1">Staffing Allocation</span>
                      <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5 line-clamp-3">{activeData.business_actions.staffing}</p>
                    </div>

                    {/* Bed / Inventory */}
                    <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 text-left flex flex-col items-start gap-1">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                        <Bed className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-800 mt-1">Room Inventory</span>
                      <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5 line-clamp-3">{activeData.business_actions.inventory}</p>
                    </div>

                    {/* Marketing */}
                    <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 text-left flex flex-col items-start gap-1">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                        <Megaphone className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-800 mt-1">Marketing Outreach</span>
                      <p className="text-[10px] text-slate-500 leading-relaxed mt-0.5 line-clamp-3">{activeData.business_actions.marketing}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons Footer */}
                <div className="flex gap-2.5 pt-4 border-t border-slate-100 mt-4">
                  <button
                    onClick={() => navigate('/NotificationSender')}
                    className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Megaphone className="w-3.5 h-3.5" /> Create Campaign
                  </button>
                  <button
                    onClick={() => navigate('/NotificationSender')}
                    className="flex-1 py-2.5 rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" /> Send Messages
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* ─── BOTTOM OVERVIEW BAR ─── */}
        <div className="mt-8 glass-card p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex gap-3 max-w-xl">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Solution Overview</h4>
              <p className="text-[11px] text-slate-400 leading-normal mt-0.5">
                GeoBoost leverages AI-powered forecasting and automated messaging to help hotel partners optimize occupancy, create targeted campaigns, and drive more bookings.
              </p>
            </div>
          </div>
          
          <div className="flex gap-5 shrink-0 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
            {[
              { icon: <TrendingUp className="w-4 h-4 text-blue-500" />, label: 'AI Forecasting' },
              { icon: <Sparkles className="w-4 h-4 text-blue-500" />, label: 'Smart Insights' },
              { icon: <MessageSquare className="w-4 h-4 text-blue-500" />, label: 'Personalized Outreach' },
              { icon: <Send className="w-4 h-4 text-blue-500" />, label: 'Real-time Delivery' }
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2 shrink-0">
                {f.icon}
                <span className="text-[10px] font-bold text-slate-600">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
