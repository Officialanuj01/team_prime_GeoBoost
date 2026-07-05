import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle2, ArrowRight, X, Sparkles, FileSpreadsheet, AlertCircle, Download, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UploadPage() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const navigate = useNavigate();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) setUploadedFile(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setUploadedFile(file);
  }, []);

  const handleDragOver = useCallback((e) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleProcess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setParsedData({
        rows: 1247,
        columns: ['Date', 'Region', 'Hotel', 'Occupancy', 'Events', 'Revenue'],
        summary: {
          avgOccupancy: '72%',
          topRegion: 'Lake Tahoe',
          peakMonth: 'July',
          totalRevenue: '$2.4M',
        },
        insights: [
          { type: 'trend', text: 'Occupancy peaks correlate with local festival dates — align campaigns 2 weeks prior.' },
          { type: 'opportunity', text: 'Budget-friendly segment is underserved in mountain regions — high growth potential.' },
          { type: 'warning', text: 'Coastal resort occupancy drops 40% in Oct-Nov — consider off-season promotions.' },
        ],
      });
      setIsProcessing(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-hero">
      <div className="deco-circle deco-circle-cyan w-[300px] h-[300px] -top-20 -right-20 fixed" />
      <div className="deco-circle deco-circle-blue w-[200px] h-[200px] bottom-20 -left-20 fixed" />

      <div className="section-container max-w-4xl relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="badge mb-4 inline-flex"><Upload className="w-3 h-3 mr-1.5" /> Data Upload</span>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Upload Your <span className="gradient-text">Tourism Data</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Upload CSV files with hotel occupancy, event schedules, or regional tourism data. Our AI will analyze patterns and generate optimized campaign strategies.
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
            <input id="csv-input" type="file" accept=".csv,.xlsx,.pdf" onChange={handleFileUpload} className="hidden" />

            <AnimatePresence mode="wait">
              {uploadedFile ? (
                <motion.div key="uploaded" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mb-5">
                    <FileSpreadsheet className="w-8 h-8 text-emerald-500" />
                  </div>
                  <p className="text-gray-800 font-semibold text-lg mb-1">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-400 mb-4">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                  <button onClick={(e) => { e.stopPropagation(); setUploadedFile(null); setParsedData(null); }} className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors">
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
                    <span className="px-2 py-1 rounded bg-surface-100">CSV</span>
                    <span className="px-2 py-1 rounded bg-surface-100">XLSX</span>
                    <span className="px-2 py-1 rounded bg-surface-100">PDF</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

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
              <><Sparkles className="w-5 h-5" /> Analyze & Generate Campaign</>
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
              
              {/* Data Summary */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-soft-lg border border-primary-100/50">
                <div className="p-6 border-b border-primary-100/20 bg-gradient-to-r from-primary-50 to-accent-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center"><FileText className="w-5 h-5 text-white" /></div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-gray-800">Data Analysis Complete</h3>
                      <p className="text-xs text-gray-500">{parsedData.rows.toLocaleString()} rows · {parsedData.columns.length} columns detected</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Columns */}
                  <div className="mb-5">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">Detected Columns</p>
                    <div className="flex flex-wrap gap-2">
                      {parsedData.columns.map((col) => (
                        <span key={col} className="badge">{col}</span>
                      ))}
                    </div>
                  </div>

                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {Object.entries(parsedData.summary).map(([key, value]) => (
                      <div key={key} className="bg-surface-100 rounded-xl p-4 text-center">
                        <p className="text-xs text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                        <p className="text-lg font-bold gradient-text mt-1">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Insights */}
              <div className="bg-white rounded-2xl p-6 shadow-card border border-primary-100/30">
                <h3 className="font-display font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary-500" /> AI-Generated Insights
                </h3>
                <div className="space-y-3">
                  {parsedData.insights.map((insight, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }} className={`p-4 rounded-xl border ${
                      insight.type === 'trend' ? 'bg-primary-50/50 border-primary-200/50' :
                      insight.type === 'opportunity' ? 'bg-emerald-50/50 border-emerald-200/50' :
                      'bg-amber-50/50 border-amber-200/50'
                    }`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          insight.type === 'trend' ? 'bg-primary-100 text-primary-600' :
                          insight.type === 'opportunity' ? 'bg-emerald-100 text-emerald-600' :
                          'bg-amber-100 text-amber-600'
                        }`}>
                          {insight.type === 'warning' ? <AlertCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{insight.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => navigate('/CampaignUploader')} className="btn-glow flex-1 gap-2">
                  <Sparkles className="w-5 h-5" /> Generate Campaign <ArrowRight className="w-5 h-5" />
                </button>
                <button className="btn-secondary flex-1 gap-2">
                  <Download className="w-5 h-5" /> Export Report
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
