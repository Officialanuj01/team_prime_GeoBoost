import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle2, ArrowRight, X, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CampaignUploader() {
  const [uploadedReport, setUploadedReport] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) setUploadedReport(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setUploadedReport(file);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleCreateCampaign = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowReport(true);
    }, 2000);
  };

  const handleNotificationSender = () => {
    navigate('/NotificationSender');
  };

  const predefinedReport = {
    campaignTitle: 'End of Year Booking Surge',
    duration: '3 Weeks',
    predictedOccupancyIncrease: '12%',
    recommendedAdSpend: '$5,000',
    targetAudience: 'Families, Holiday Travelers',
    channels: ['Google Ads', 'Facebook Ads', 'Email Campaign'],
    contentExample: 'Book early and save! Special holiday offers available for a limited time.',
  };

  const reportFields = [
    { label: 'Campaign Title', value: predefinedReport.campaignTitle, icon: '🎯' },
    { label: 'Duration', value: predefinedReport.duration, icon: '⏱️' },
    { label: 'Predicted Occupancy Increase', value: predefinedReport.predictedOccupancyIncrease, icon: '📈' },
    { label: 'Recommended Ad Spend', value: predefinedReport.recommendedAdSpend, icon: '💰' },
    { label: 'Target Audience', value: predefinedReport.targetAudience, icon: '👥' },
    { label: 'Channels', value: predefinedReport.channels.join(', '), icon: '📢' },
    { label: 'Content Example', value: predefinedReport.contentExample, icon: '✍️' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-hero">
      {/* Decorative circles */}
      <div className="deco-circle deco-circle-cyan w-[300px] h-[300px] -top-20 -right-20 fixed" />
      <div className="deco-circle deco-circle-blue w-[200px] h-[200px] bottom-20 -left-20 fixed" />

      <div className="section-container max-w-3xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <span className="badge mb-4 inline-flex">
            <Upload className="w-3 h-3 mr-1.5" />
            Campaign Creator
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Upload Your Tourism Data
          </h1>
          <p className="text-gray-500 text-lg">
            Upload last year's report and let AI generate an optimized campaign strategy.
          </p>
        </motion.div>

        {/* Upload Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`
              relative bg-white rounded-2xl p-10 text-center cursor-pointer border-2 border-dashed transition-all duration-300 shadow-card
              ${isDragging 
                ? 'border-primary-400 bg-primary-50/50 shadow-soft-md' 
                : uploadedReport 
                  ? 'border-emerald-300 bg-emerald-50/30' 
                  : 'border-primary-200 hover:border-primary-300 hover:shadow-soft'
              }
            `}
            onClick={() => !uploadedReport && document.getElementById('file-input').click()}
          >
            <input id="file-input" type="file" accept=".pdf,.csv,.xlsx" onChange={handleFileUpload} className="hidden" />

            <AnimatePresence mode="wait">
              {uploadedReport ? (
                <motion.div key="uploaded" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                  </div>
                  <p className="text-gray-800 font-semibold mb-1">{uploadedReport.name}</p>
                  <p className="text-xs text-gray-400 mb-4">{(uploadedReport.size / 1024).toFixed(1)} KB</p>
                  <button onClick={(e) => { e.stopPropagation(); setUploadedReport(null); setShowReport(false); }} className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors">
                    <X className="w-3 h-3" /> Remove file
                  </button>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${isDragging ? 'bg-primary-100' : 'bg-surface-200'}`}>
                    <Upload className={`w-8 h-8 transition-colors ${isDragging ? 'text-primary-500' : 'text-gray-400'}`} />
                  </div>
                  <p className="text-gray-700 font-semibold mb-1">{isDragging ? 'Drop your file here' : 'Drag & drop your report'}</p>
                  <p className="text-xs text-gray-400">or click to browse — PDF, CSV, XLSX supported</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Generate Button */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6">
          <button
            onClick={handleCreateCampaign}
            disabled={!uploadedReport || isGenerating}
            className={`w-full py-4 rounded-xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2 ${
              uploadedReport && !isGenerating
                ? 'btn-glow w-full'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
            }`}
          >
            {isGenerating ? (
              <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing with AI...</>
            ) : (
              <><Sparkles className="w-5 h-5" /> Generate AutoCampaign</>
            )}
          </button>
        </motion.div>

        {/* Generated Report */}
        <AnimatePresence>
          {showReport && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} className="mt-10">
              <div className="bg-white rounded-2xl overflow-hidden shadow-soft-lg border border-primary-100/50">
                <div className="p-6 border-b border-primary-100/30 bg-gradient-to-r from-primary-50 to-accent-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-gray-800">AutoCampaign Report</h3>
                      <p className="text-xs text-gray-500">Generated by GeoBoost AI</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  {reportFields.map((field, index) => (
                    <motion.div key={field.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.08 }} className="flex items-start gap-3 p-3 rounded-xl bg-surface-100 hover:bg-surface-200 transition-colors">
                      <span className="text-lg">{field.icon}</span>
                      <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{field.label}</p>
                        <p className="text-sm text-gray-700 mt-0.5">{field.value}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="p-6 border-t border-primary-100/30">
                  <button onClick={handleNotificationSender} className="btn-glow w-full group">
                    Trigger Campaign
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
