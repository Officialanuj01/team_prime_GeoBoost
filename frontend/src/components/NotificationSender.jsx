import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Send, ArrowLeft, AlertCircle, CheckCircle2, User, Loader2 } from 'lucide-react';

export default function NotificationSender() {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sendSuccess, setSendSuccess] = useState(false);
  const navigate = useNavigate();

  const genAI = new GoogleGenerativeAI('AIzaSyAZ_kDwYZ6BSinhzoH-E6AojakoL9XKKPk');

  const customers = [
    { name: 'John Doe', bookedRoom: 'Suite', preference: 'beach' },
    { name: 'Jane Smith', bookedRoom: 'Double', preference: 'mountain' },
    { name: 'Mark Johnson', bookedRoom: 'Single', preference: 'city' },
  ];

  const preferenceGradients = {
    beach: 'from-cyan-400 to-cyan-500',
    mountain: 'from-emerald-400 to-emerald-500',
    city: 'from-purple-400 to-purple-500',
  };

  const handleGenerateMessages = async () => {
    setLoading(true);
    setError(null);
    setSendSuccess(false);
    const generatedResponses = [];

    for (const customer of customers) {
      const prompt = `Create a friendly marketing message for ${customer.name}, who previously booked a ${customer.bookedRoom} room and prefers ${customer.preference} trips, inviting them to visit again. Keep it under 80 words.`;
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        generatedResponses.push({ customer: customer.name, room: customer.bookedRoom, preference: customer.preference, message: result.response.text() });
      } catch (err) {
        setError('Failed to generate message: ' + err.message);
      }
    }
    setResponses(generatedResponses);
    setLoading(false);
  };

  const handleSendMessage = () => {
    setSendSuccess(true);
    setTimeout(() => navigate('/'), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-hero">
      <div className="deco-circle deco-circle-cyan w-[300px] h-[300px] -top-20 -right-20 fixed" />
      
      <div className="section-container max-w-3xl relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary-600 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <span className="badge mb-4 inline-flex"><Sparkles className="w-3 h-3 mr-1.5" /> AI Message Generator</span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Personalized Outreach</h1>
          <p className="text-gray-500 text-lg">Generate AI-crafted marketing messages tailored to each customer.</p>
        </motion.div>

        {/* Customer Preview Cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid gap-3 mb-8">
          {customers.map((customer) => (
            <div key={customer.name} className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-card border border-primary-100/30">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${preferenceGradients[customer.preference] || 'from-gray-400 to-gray-500'} flex items-center justify-center text-white shrink-0`}>
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{customer.name}</p>
                <p className="text-xs text-gray-400">{customer.bookedRoom} room · Prefers {customer.preference} trips</p>
              </div>
              {responses.find((r) => r.customer === customer.name) && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
            </div>
          ))}
        </motion.div>

        {/* Generate Button */}
        <button onClick={handleGenerateMessages} disabled={loading} className="btn-glow w-full">
          {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating with Gemini AI...</> : <><Sparkles className="w-5 h-5 mr-2" /> Generate Personalized Messages</>}
        </button>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div><p className="text-sm font-medium text-red-600">Generation Failed</p><p className="text-xs text-red-400 mt-0.5">{error}</p></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Skeletons */}
        {loading && (
          <div className="mt-8 space-y-4">
            {customers.map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-card border border-primary-100/20 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-surface-200" />
                  <div className="space-y-2"><div className="w-24 h-3 rounded bg-surface-200" /><div className="w-16 h-2 rounded bg-surface-100" /></div>
                </div>
                <div className="space-y-2"><div className="w-full h-3 rounded bg-surface-100" /><div className="w-3/4 h-3 rounded bg-surface-100" /></div>
              </div>
            ))}
          </div>
        )}

        {/* Generated Messages */}
        <AnimatePresence>
          {responses.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 space-y-4">
              <h3 className="font-display font-semibold text-lg text-gray-800 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Generated Messages
              </h3>
              {responses.map((res, index) => (
                <motion.div key={res.customer} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white rounded-2xl overflow-hidden shadow-card border border-primary-100/30">
                  <div className="p-4 border-b border-primary-100/20 flex items-center gap-3 bg-surface-50">
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${preferenceGradients[res.preference] || 'from-gray-400 to-gray-500'} flex items-center justify-center text-white text-xs font-bold`}>
                      {res.customer.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div><p className="text-sm font-semibold text-gray-800">{res.customer}</p><p className="text-xs text-gray-400">{res.room} · {res.preference}</p></div>
                  </div>
                  <div className="p-5"><p className="text-sm text-gray-600 leading-relaxed">{res.message}</p></div>
                </motion.div>
              ))}

              <div className="pt-4">
                {sendSuccess ? (
                  <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <p className="text-sm font-semibold text-emerald-600">Messages sent successfully! Redirecting...</p>
                  </div>
                ) : (
                  <button onClick={handleSendMessage} className="w-full py-4 rounded-xl font-semibold text-base bg-gradient-to-r from-emerald-400 to-emerald-500 text-white shadow-[0_4px_15px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2">
                    <Send className="w-5 h-5" /> Send All Messages
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
