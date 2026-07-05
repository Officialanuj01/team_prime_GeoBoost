import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, FileText, CheckCircle2, ArrowRight, X, Sparkles, 
  FileSpreadsheet, AlertCircle, TrendingUp, TrendingDown, 
  Percent, Calendar, Award, ShieldAlert, BadgeDollarSign, 
  Users, Package, Compass, ChevronDown, ChevronUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../../authentication/AuthModal';

export default function UploadPage() {
  const navigate = useNavigate();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null);

  const [parsedData, setParsedData] = useState(() => {
    try {
      const saved = localStorage.getItem('geoboost_parsed_data');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  React.useEffect(() => {
    if (parsedData) {
      localStorage.setItem('geoboost_parsed_data', JSON.stringify(parsedData));
    } else {
      localStorage.removeItem('geoboost_parsed_data');
    }
  }, [parsedData]);

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('geoboost_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  
  // Default to true so guest users see it immediately
  const [showAuthModal, setShowAuthModal] = useState(true);

  const handleLocalLogin = (user) => {
    setCurrentUser(user);
    setShowAuthModal(false);
    // Reload state if necessary
    window.location.reload();
  };

  const handleCloseAuth = () => {
    setShowAuthModal(false);
    navigate('/');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-gradient-hero flex flex-col items-center justify-center">
        <div className="deco-circle deco-circle-cyan w-[300px] h-[300px] -top-20 -right-20 fixed" />
        <div className="deco-circle deco-circle-blue w-[200px] h-[200px] bottom-20 -left-20 fixed" />
        
        {/* Spacer so footer stays at very bottom */}
        <div className="flex-1 flex flex-col items-center justify-center z-10">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500 font-semibold">Sign in to continue...</p>
        </div>

        <AuthModal 
          isOpen={showAuthModal} 
          onClose={handleCloseAuth} 
          onLogin={handleLocalLogin} 
        />
      </div>
    );
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setError(null);
      setParsedData(null);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file);
      setError(null);
      setParsedData(null);
    }
  }, []);

  const handleDragOver = useCallback((e) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleProcess = async () => {
    if (!uploadedFile) return;
    setIsProcessing(true);
    setError(null);
    setParsedData(null);

    const formData = new FormData();
    formData.append('file', uploadedFile);

    try {
      // Connect to the deployed Cloud Run service URL
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/forecast`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errText = '';
        try {
          const errJson = await response.json();
          errText = errJson.detail || JSON.stringify(errJson);
        } catch {
          errText = await response.text();
        }
        throw new Error(errText || `Server returned HTTP status ${response.status}`);
      }

      const result = await response.json();
      setParsedData(result);
    } catch (err) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred while communicating with the forecast backend.');
    } finally {
      setIsProcessing(false);
    }
  };

  // SVG Chart Dimensions & Computations
  const renderForecastChart = () => {
    if (!parsedData || !parsedData.forecast || parsedData.forecast.length === 0) return null;

    const data = parsedData.forecast;
    const width = 800;
    const height = 320;
    const paddingLeft = 55;
    const paddingRight = 30;
    const paddingTop = 30;
    const paddingBottom = 40;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    // Get min and max bounds for charting y-scale
    const allUpper = data.map(d => d.upper_bound);
    const allLower = data.map(d => d.lower_bound);
    const maxVal = Math.max(...allUpper);
    const minVal = Math.min(...allLower);
    
    // Zoom y-scale range (buffer of 5%)
    const yMax = Math.min(100, Math.ceil(maxVal + 5));
    const yMin = Math.max(0, Math.floor(minVal - 5));
    const yRange = yMax - yMin;

    const getX = (index) => paddingLeft + (index * (chartWidth / (data.length - 1)));
    const getY = (val) => height - paddingBottom - (((val - yMin) / yRange) * chartHeight);

    // Build the confidence interval shaded area path
    let areaPath = '';
    data.forEach((d, i) => {
      const x = getX(i);
      const y = getY(d.upper_bound);
      areaPath += `${i === 0 ? 'M' : 'L'} ${x} ${y} `;
    });
    // Go backwards to close the interval area loop
    for (let i = data.length - 1; i >= 0; i--) {
      const x = getX(i);
      const y = getY(data[i].lower_bound);
      areaPath += `L ${x} ${y} `;
    }
    areaPath += 'Z';

    // Build the main predicted occupancy line path
    let linePath = '';
    data.forEach((d, i) => {
      const x = getX(i);
      const y = getY(d.predicted_occupancy);
      linePath += `${i === 0 ? 'M' : 'L'} ${x} ${y} `;
    });

    // Generate horizontal helper gridlines
    const yTicks = [yMin, yMin + yRange / 4, yMin + yRange / 2, yMin + 3 * yRange / 4, yMax];

    return (
      <div className="w-full overflow-x-auto bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-gray-800 font-bold text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-500" /> 7-Day Forecast & Bounds Interval
            </h4>
            <p className="text-xs text-gray-400">Light blue shaded area indicates the 10th (P10) to 90th (P90) percentile confidence bounds.</p>
          </div>
          <div className="flex gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-cyan-500">
              <span className="w-3 h-3 rounded bg-cyan-100 border border-cyan-300 inline-block" /> Confidence Bounds
            </span>
            <span className="flex items-center gap-1.5 text-indigo-600">
              <span className="w-3.5 h-0.5 bg-indigo-600 inline-block" /> Prediction Line
            </span>
          </div>
        </div>
        
        <svg className="w-full min-w-[700px] h-[320px]" viewBox={`0 0 ${width} ${height}`}>
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.04" />
            </linearGradient>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {yTicks.map((tick, idx) => {
            const y = getY(tick);
            return (
              <g key={idx}>
                <line 
                  x1={paddingLeft} 
                  y1={y} 
                  x2={width - paddingRight} 
                  y2={y} 
                  stroke="#f1f5f9" 
                  strokeDasharray="4 4" 
                  strokeWidth="1.5"
                />
                <text 
                  x={paddingLeft - 10} 
                  y={y + 4} 
                  textAnchor="end" 
                  className="text-[10px] font-bold fill-gray-400"
                >
                  {Math.round(tick)}%
                </text>
              </g>
            );
          })}

          {/* Shaded Area bounds (Confidence limits) */}
          <path d={areaPath} fill="url(#areaGrad)" />

          {/* Draw upper bound line */}
          <path 
            d={data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.upper_bound)}`).join(' ')} 
            fill="none" 
            stroke="#a5f3fc" 
            strokeWidth="1" 
            strokeDasharray="2 2"
          />

          {/* Draw lower bound line */}
          <path 
            d={data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.lower_bound)}`).join(' ')} 
            fill="none" 
            stroke="#a5f3fc" 
            strokeWidth="1" 
            strokeDasharray="2 2"
          />

          {/* Main line path */}
          <path d={linePath} fill="none" stroke="url(#lineGrad)" strokeWidth="3" strokeLinecap="round" />

          {/* Data Points */}
          {data.map((d, idx) => {
            const x = getX(idx);
            const y = getY(d.predicted_occupancy);
            return (
              <g key={idx}>
                {/* Outer halo */}
                <circle cx={x} cy={y} r="6" fill="#ffffff" stroke="#6366f1" strokeWidth="2" />
                <circle cx={x} cy={y} r="3" fill="#06b6d4" />
                
                {/* Labels above point */}
                <text 
                  x={x} 
                  y={y - 12} 
                  textAnchor="middle" 
                  className="text-[10px] font-extrabold fill-indigo-600 bg-white"
                >
                  {Math.round(d.predicted_occupancy)}%
                </text>

                {/* X Axis Date labels */}
                <text 
                  x={x} 
                  y={height - paddingBottom + 20} 
                  textAnchor="middle" 
                  className="text-[10px] font-bold fill-gray-500"
                >
                  {d.date.substring(5)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  const getBadgeClass = (badge) => {
    switch (badge?.toLowerCase()) {
      case 'critical':
        return 'bg-rose-50 text-rose-600 border border-rose-200';
      case 'peak':
        return 'bg-amber-50 text-amber-600 border border-amber-200';
      case 'optimize':
        return 'bg-cyan-50 text-cyan-600 border border-cyan-200';
      case 'prepare':
        return 'bg-indigo-50 text-indigo-600 border border-indigo-200';
      default:
        return 'bg-gray-50 text-gray-600 border border-gray-200';
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-hero">
      <div className="deco-circle deco-circle-cyan w-[300px] h-[300px] -top-20 -right-20 fixed" />
      <div className="deco-circle deco-circle-blue w-[200px] h-[200px] bottom-20 -left-20 fixed" />

      <div className="section-container max-w-4xl relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="badge mb-4 inline-flex"><Upload className="w-3 h-3 mr-1.5" /> Forecast Engine</span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            AI Occupancy <span className="gradient-text">Revenue Manager</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Upload occupancy history to calculate AI-driven forecasts and generate real-time revenue decisions.
          </p>
        </motion.div>

        {/* Upload Zone */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`relative bg-white rounded-2xl p-12 text-center cursor-pointer border-2 border-dashed transition-all duration-300 shadow-card ${
              isDragging ? 'border-primary-400 bg-primary-50/50 shadow-soft-md scale-[1.02]'
                : uploadedFile ? 'border-emerald-300 bg-emerald-50/20'
                : 'border-primary-200 hover:border-primary-300 hover:shadow-soft'
            }`}
            onClick={() => !uploadedFile && document.getElementById('csv-input').click()}
          >
            <input id="csv-input" type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />

            <AnimatePresence mode="wait">
              {uploadedFile ? (
                <motion.div key="uploaded" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mb-5">
                    <FileSpreadsheet className="w-8 h-8 text-emerald-500" />
                  </div>
                  <p className="text-gray-800 font-semibold text-lg mb-1">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-400 mb-4">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                  <button onClick={(e) => { e.stopPropagation(); setUploadedFile(null); setParsedData(null); setError(null); }} className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors">
                    <X className="w-3 h-3" /> Remove file
                  </button>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-5 transition-colors ${isDragging ? 'bg-primary-100' : 'bg-surface-200'}`}>
                    <Upload className={`w-10 h-10 transition-colors ${isDragging ? 'text-primary-500' : 'text-gray-300'}`} />
                  </div>
                  <p className="text-gray-700 font-semibold text-lg mb-1">{isDragging ? 'Drop your file here!' : 'Drag & drop your CSV file'}</p>
                  <p className="text-sm text-gray-400 mb-3">or click anywhere to browse</p>
                  <div className="flex gap-2 text-xs text-gray-400">
                    <span className="px-2 py-1 rounded bg-surface-100">Occupancy CSV</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Error Notice */}
        {error && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 flex gap-2 items-start text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-semibold">Analysis Failed</p>
              <p className="opacity-90">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Process Button */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6">
          <button
            onClick={handleProcess}
            disabled={!uploadedFile || isProcessing}
            className={`w-full py-4 rounded-xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2 ${
              uploadedFile && !isProcessing ? 'btn-glow w-full' : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
            }`}
          >
            {isProcessing ? (
              <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing with AI...</>
            ) : (
              <><Sparkles className="w-5 h-5" /> Calculate Forecast & Insights</>
            )}
          </button>
        </motion.div>

        {/* Processing Skeleton */}
        {isProcessing && (
          <div className="mt-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-card border border-primary-100/20 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-surface-200" />
                  <div className="space-y-2 flex-1"><div className="w-1/3 h-3 rounded bg-surface-200" /><div className="w-1/4 h-2 rounded bg-surface-100" /></div>
                </div>
                <div className="space-y-2"><div className="w-full h-2 rounded bg-surface-100" /><div className="w-3/4 h-2 rounded bg-surface-100" /></div>
              </div>
            ))}
          </div>
        )}

        {/* Parsed Results */}
        <AnimatePresence>
          {parsedData && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-10 space-y-6">
              
              {/* Executive Summary */}
              <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-soft-lg border border-indigo-950">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                    <Sparkles className="w-5 h-5 text-indigo-300" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-white">AI Revenue Manager Summary</h3>
                    <p className="text-xs text-indigo-200/70">{parsedData.records_analyzed} historical periods evaluated</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-indigo-100">{parsedData.summary}</p>
              </div>

              {/* KPI metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-400 uppercase">Average Occupancy</span>
                    <Percent className="w-4 h-4 text-cyan-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{parsedData.kpis.average_occupancy}%</p>
                    <p className="text-[10px] text-gray-400">Mean projected 7-day rate</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-400 uppercase">Peak Occupancy</span>
                    <Award className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{parsedData.kpis.peak_occupancy}%</p>
                    <p className="text-[10px] text-indigo-500 font-medium">On {parsedData.kpis.peak_day}</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-400 uppercase">Growth Delta</span>
                    {parsedData.kpis.growth_percent >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-rose-500" />
                    )}
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${parsedData.kpis.growth_percent >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {parsedData.kpis.growth_percent >= 0 ? '+' : ''}{parsedData.kpis.growth_percent}%
                    </p>
                    <p className="text-[10px] text-gray-400">Against last history point</p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-400 uppercase">Projected Trend</span>
                    <Calendar className="w-4 h-4 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{parsedData.kpis.trend}</p>
                    <p className="text-[10px] text-gray-400">Directional forecast vector</p>
                  </div>
                </div>
              </div>

              {/* Chart */}
              {renderForecastChart()}

              {/* Departmental Business Recommendations */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-display font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-indigo-500" /> Strategic Departmental Decisions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-gray-100 bg-slate-50/50">
                    <div className="flex items-center gap-2 mb-2 text-cyan-600 font-semibold text-sm">
                      <BadgeDollarSign className="w-4 h-4" /> Pricing & ADR Optimization
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{parsedData.business_actions.pricing}</p>
                  </div>

                  <div className="p-4 rounded-xl border border-gray-100 bg-slate-50/50">
                    <div className="flex items-center gap-2 mb-2 text-indigo-600 font-semibold text-sm">
                      <Users className="w-4 h-4" /> Staffing & Scheduling
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{parsedData.business_actions.staffing}</p>
                  </div>

                  <div className="p-4 rounded-xl border border-gray-100 bg-slate-50/50">
                    <div className="flex items-center gap-2 mb-2 text-amber-600 font-semibold text-sm">
                      <Package className="w-4 h-4" /> Inventory & Supply Chain
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{parsedData.business_actions.inventory}</p>
                  </div>

                  <div className="p-4 rounded-xl border border-gray-100 bg-slate-50/50">
                    <div className="flex items-center gap-2 mb-2 text-emerald-600 font-semibold text-sm">
                      <Sparkles className="w-4 h-4" /> Destination Marketing
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{parsedData.business_actions.marketing}</p>
                  </div>
                </div>
              </div>

              {/* 7-Day Expandable insights */}
              <div className="space-y-3">
                <h3 className="font-display font-bold text-gray-800 text-lg mb-2 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-500" /> 7-Day Daily Insights Breakdown
                </h3>
                
                {parsedData.daily_insights.map((day, i) => {
                  const isExpanded = expandedDay === i;
                  return (
                    <div 
                      key={day.date} 
                      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-soft transition-all duration-300"
                    >
                      <div 
                        onClick={() => setExpandedDay(isExpanded ? null : i)}
                        className="p-5 flex flex-wrap items-center justify-between gap-4 cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-full ${getBadgeClass(day.dashboard_badge)}`}>
                            {day.dashboard_badge}
                          </span>
                          <div>
                            <p className="text-sm font-bold text-gray-800">{day.day}, {day.date}</p>
                            <p className="text-xs text-gray-400">{day.headline}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-sm font-extrabold text-indigo-600">{day.predicted_occupancy}% occupancy</p>
                            <p className="text-[10px] text-gray-400">{day.status} · Priority: {day.priority}</p>
                          </div>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                        </div>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden border-t border-gray-50 bg-slate-50/30"
                          >
                            <div className="p-5 space-y-4 text-xs">
                              <div>
                                <p className="font-bold text-gray-700 uppercase tracking-wider text-[10px] mb-1">Business Context Summary</p>
                                <p className="text-gray-600 leading-relaxed">{day.summary}</p>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-3 bg-emerald-50/40 rounded-xl border border-emerald-100/50">
                                  <p className="font-bold text-emerald-700 uppercase tracking-wider text-[10px] mb-1 flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Recommended Operational Action
                                  </p>
                                  <p className="text-gray-600">{day.recommended_action}</p>
                                </div>

                                <div className="p-3 bg-rose-50/40 rounded-xl border border-rose-100/50">
                                  <p className="font-bold text-rose-700 uppercase tracking-wider text-[10px] mb-1 flex items-center gap-1">
                                    <ShieldAlert className="w-3.5 h-3.5" /> Key Risk & Mitigation
                                  </p>
                                  <p className="text-gray-600">{day.risk}</p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
