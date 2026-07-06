import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Send, ArrowLeft, AlertCircle, CheckCircle2, User, Loader2, Upload } from 'lucide-react';
import WhatsAppConnector from './WhatsAppConnector';

export default function NotificationSender({ user }) {
  const [isWhatsAppConnected, setIsWhatsAppConnected] = useState(false);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [sendError, setSendError] = useState(null);
  const [sendSuccess, setSendSuccess] = useState(false);
  const navigate = useNavigate();

  const rawUserId = user ? (user.email || user.name || 'guest_user') : 'guest_user';
  const userId = rawUserId.replace(/[^\w-]/g, '_');

  const backendUrl = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:5000';
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

  const [inputMethod, setInputMethod] = useState('manual'); // 'manual' or 'csv'
  const [customers, setCustomers] = useState([
    { name: 'John Doe', bookedRoom: 'Suite', preference: 'beach', phone: '+919755500507' }
  ]);

  const [manualName, setManualName] = useState('John Doe');
  const [manualPhone, setManualPhone] = useState('+919755500507');
  const [manualRoom, setManualRoom] = useState('Suite');
  const [manualPreference, setManualPreference] = useState('beach');

  useEffect(() => {
    try {
      const rawContext = localStorage.getItem('geoboost_campaign_context');
      if (!rawContext) return;

      const campaignContext = JSON.parse(rawContext);
      if (!campaignContext?.should_launch_campaign && !campaignContext?.forecast) return;

      const forecastCustomers = (campaignContext.forecast || []).slice(0, 3).map((row, index) => ({
        name: `Guest ${index + 1}`,
        phone: index === 0 ? '+919755500507' : index === 1 ? '+919755500508' : '+919755500509',
        bookedRoom: row.predicted_occupancy >= 80 ? 'Suite' : row.predicted_occupancy >= 70 ? 'Double' : 'Single',
        preference: row.predicted_occupancy >= 80 ? 'city' : row.predicted_occupancy >= 70 ? 'mountain' : 'beach',
      }));

      if (forecastCustomers.length > 0) {
        setInputMethod('csv');
        setCustomers(forecastCustomers);
        setResponses(forecastCustomers.map((customer) => ({
          customer: customer.name,
          room: customer.bookedRoom,
          preference: customer.preference,
          phone: customer.phone,
          message: campaignContext.suggested_message,
        })));
        setError(null);
      }
    } catch {
      localStorage.removeItem('geoboost_campaign_context');
    }
  }, []);

  useEffect(() => {
    if (inputMethod === 'manual') {
      const defaultMsg = `Hi ${manualName || 'Valued Customer'}, thank you for booking a ${manualRoom} room with us. We have a special offer for your preferred ${manualPreference} trips!`;
      setCustomers([
        { name: manualName, phone: manualPhone, bookedRoom: manualRoom, preference: manualPreference }
      ]);
      setResponses([
        { customer: manualName, room: manualRoom, preference: manualPreference, phone: manualPhone, message: defaultMsg }
      ]);
    }
  }, [manualName, manualPhone, manualRoom, manualPreference, inputMethod]);

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n').map(line => line.trim()).filter(line => line !== '');
      if (lines.length <= 1) {
        setError('CSV file is empty or missing data rows.');
        return;
      }

      // Parse headers
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const parsedCustomers = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length === 0 || (values.length === 1 && values[0] === '')) continue;

        let name = '';
        let phone = '';
        let room = 'Standard';
        let preference = 'beach';

        // Check if headers match standard keys
        const nameIdx = headers.indexOf('name');
        const phoneIdx = headers.indexOf('phone');
        const roomIdx = headers.findIndex(h => h === 'room' || h === 'bookedroom');
        const prefIdx = headers.indexOf('preference');

        if (nameIdx !== -1) name = values[nameIdx];
        else name = values[0] || '';

        if (phoneIdx !== -1) phone = values[phoneIdx];
        else phone = values[1] || '';

        if (roomIdx !== -1) room = values[roomIdx] || 'Standard';
        else if (values[2]) room = values[2];

        if (prefIdx !== -1) preference = values[prefIdx] || 'beach';
        else if (values[3]) preference = values[3];

        if (name && phone) {
          parsedCustomers.push({ name, phone, bookedRoom: room, preference });
        }
      }

      if (parsedCustomers.length === 0) {
        setError('No valid customer data found. Make sure your CSV contains "name" and "phone" fields.');
      } else {
        setCustomers(parsedCustomers);
        setResponses(parsedCustomers.map(c => ({
          customer: c.name,
          room: c.bookedRoom,
          preference: c.preference,
          phone: c.phone,
          message: `Hi ${c.name}, thank you for booking a ${c.bookedRoom} room with us. We have a special offer for your preferred ${c.preference} trips!`
        })));
        setError(null);
      }
    };

    reader.readAsText(file);
  };

  const preferenceGradients = {
    beach: 'from-cyan-400 to-cyan-500',
    mountain: 'from-emerald-400 to-emerald-500',
    city: 'from-purple-400 to-purple-500',
  };

  const handleGenerateMessages = async () => {
    if (inputMethod === 'manual') {
      if (!manualName || !manualPhone) {
        setError('Please enter both Name and Phone number.');
        return;
      }
    } else {
      if (customers.length === 0) {
        setError('Please upload a valid CSV file first.');
        return;
      }
    }

    setLoading(true);
    setError(null);
    setSendSuccess(false);
    const generatedResponses = [];

    for (const customer of customers) {
      const prompt = `Create a friendly marketing message for ${customer.name}, who booked a ${customer.bookedRoom} room and prefers ${customer.preference} trips, inviting them to visit again. Keep it under 120 characters, plain text only, absolutely NO emojis, and NO newlines.`;
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite' });
        const result = await model.generateContent(prompt);
        generatedResponses.push({
          customer: customer.name,
          room: customer.bookedRoom,
          preference: customer.preference,
          phone: customer.phone,
          message: result.response.text(),
        });
      } catch (err) {
        setError('Failed to generate message: ' + err.message);
      }
    }
    setResponses(generatedResponses);
    setLoading(false);
  };

  const handleSendMessage = async () => {
    setSendError(null);
    setSending(true);
    setSendSuccess(false);

    try {
      const payload = {
        userId,
        messages: responses.map((res) => ({
          customer: res.customer,
          phone: res.phone,
          message: res.message,
        })),
        campaignContext: (() => {
          try {
            return JSON.parse(localStorage.getItem('geoboost_campaign_context') || 'null');
          } catch {
            return null;
          }
        })(),
      };

      const response = await fetch(`${backendUrl}/api/notifications/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send notifications.');
      }

      if (result.failedCount > 0) {
        const firstFailed = result.results.find(r => !r.success);
        const detailMsg = firstFailed ? `: ${firstFailed.error}` : '';
        throw new Error(`Sent ${result.successCount} messages, ${result.failedCount} failed${detailMsg}`);
      }

      setSendSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setSendError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-hero">
      <div className="deco-circle deco-circle-cyan w-[300px] h-[300px] -top-20 -right-20 fixed" />
      
      <div className="section-container max-w-3xl relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary-600 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>

          {/* Journey breadcrumb */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">GeoBoost Flow</span>
            {['AI Forecast', 'Low Occupancy Alert', 'Tourism Coordination', 'Guest Notifications'].map((s, i, arr) => (
              <span key={i} className="flex items-center gap-2">
                <span className={`text-[10px] font-bold ${i === arr.length - 1 ? 'text-indigo-600' : 'text-slate-400'}`}>{s}</span>
                {i < arr.length - 1 && <span className="text-slate-200 text-xs">›</span>}
              </span>
            ))}
          </div>

          <span className="badge mb-3 inline-flex"><Sparkles className="w-3 h-3 mr-1.5" /> Step 4 of 4 — Guest Outreach</span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Send Personalised Notifications</h1>
          <p className="text-gray-500 text-base leading-relaxed max-w-xl">
            Low occupancy has been detected. Coordinate with the Tourism Department — generate AI-crafted messages tailored to each guest and deliver them via WhatsApp.
          </p>
        </motion.div>

        <div className="mb-8">
          <WhatsAppConnector userId={userId} onConnectionChange={setIsWhatsAppConnected} />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          {/* WhatsApp Not Linked Banner */}
          {!isWhatsAppConnected && (
            <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-amber-800">WhatsApp Status: <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-200 text-amber-700 text-[10px] font-bold uppercase tracking-wider ml-1">Unlinked</span></p>
                <p className="text-[11px] text-amber-600 mt-1 leading-relaxed">Link your WhatsApp account above to deliver messages directly to guests. For this demo, you can still generate and preview all messages below.</p>
              </div>
            </div>
          )}
            {/* Input Method Selector */}
            <div className="flex gap-2 mb-6 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/50 relative z-10">
          <button
            onClick={() => { setInputMethod('manual'); setResponses([]); }}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold text-xs transition-all ${inputMethod === 'manual' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Manual Phone Number
          </button>
          <button
            onClick={() => { setInputMethod('csv'); setCustomers([]); setResponses([]); }}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold text-xs transition-all ${inputMethod === 'csv' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Upload CSV
          </button>
        </div>

        {/* Forms depending on Input Method */}
        {inputMethod === 'manual' && (
          <div className="glass-card p-5 mb-8 space-y-4 relative z-10 text-left">
            <h3 className="text-sm font-bold text-slate-800 mb-2">Manual Customer Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Name</label>
                <input
                  type="text"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 px-3 font-medium text-slate-700 outline-none focus:border-slate-300 focus:bg-white"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Phone Number</label>
                <input
                  type="text"
                  value={manualPhone}
                  onChange={(e) => setManualPhone(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 px-3 font-medium text-slate-700 outline-none focus:border-slate-300 focus:bg-white"
                  placeholder="+919753768366"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Booked Room</label>
                <select
                  value={manualRoom}
                  onChange={(e) => setManualRoom(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 px-3 font-medium text-slate-700 outline-none focus:border-slate-300 focus:bg-white appearance-none cursor-pointer"
                >
                  <option value="Suite">Suite</option>
                  <option value="Double">Double Room</option>
                  <option value="Single">Single Room</option>
                  <option value="Deluxe">Deluxe Room</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Trip Preference</label>
                <select
                  value={manualPreference}
                  onChange={(e) => setManualPreference(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 px-3 font-medium text-slate-700 outline-none focus:border-slate-300 focus:bg-white appearance-none cursor-pointer"
                >
                  <option value="beach">Beach</option>
                  <option value="mountain">Mountain</option>
                  <option value="city">City</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {inputMethod === 'csv' && (
          <div className="glass-card p-5 mb-8 space-y-4 relative z-10 text-left">
            <h3 className="text-sm font-bold text-slate-800 mb-1">Upload Customer CSV</h3>
            <p className="text-[11px] text-slate-400 font-medium">CSV structure: Name, Phone, Room (optional), Preference (optional)</p>
            <div className="border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-xl p-6 transition-all bg-slate-50/50 flex flex-col items-center justify-center cursor-pointer relative">
              <Upload className="w-8 h-8 text-slate-400 mb-2" />
              <span className="text-xs font-bold text-slate-500">Drag and drop CSV here or click to browse</span>
              <input
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            {customers.length > 0 && (
              <div className="flex items-center justify-between text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 p-2.5 rounded-lg">
                <span>Parsed {customers.length} customer(s) successfully!</span>
                <button onClick={() => setCustomers([])} className="text-emerald-900 hover:underline">Clear</button>
              </div>
            )}
          </div>
        )}

        {/* Customer Preview Cards */}
        {customers.length > 0 && customers[0].name && customers[0].phone && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid gap-3 mb-8 relative z-10 text-left">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Recipient Preview</h3>
            {customers.map((customer) => (
              <div key={customer.name} className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-card border border-primary-100/30">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${preferenceGradients[customer.preference] || 'from-gray-400 to-gray-500'} flex items-center justify-center text-white shrink-0`}>
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{customer.name}</p>
                  <p className="text-xs text-gray-400">{customer.bookedRoom} room · Prefers {customer.preference} trips · {customer.phone}</p>
                </div>
                {responses.find((r) => r.customer === customer.name) && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
              </div>
            ))}
          </motion.div>
        )}

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
                  <div className="p-5 text-left">
                    <textarea
                      value={res.message}
                      onChange={(e) => {
                        const newResponses = [...responses];
                        newResponses[index].message = e.target.value;
                        setResponses(newResponses);
                      }}
                      className="w-full text-xs text-slate-600 leading-relaxed border border-slate-200/80 rounded-xl p-3 outline-none focus:border-slate-300 focus:bg-white resize-y min-h-[90px] font-sans"
                    />
                  </div>
                </motion.div>
              ))}

              <div className="pt-4">
                {sendSuccess ? (
                  <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <p className="text-sm font-semibold text-emerald-600">Messages sent successfully! Redirecting...</p>
                  </div>
                ) : (
                  <button
                    onClick={handleSendMessage}
                    disabled={sending || responses.length === 0}
                    className="w-full py-4 rounded-xl font-semibold text-base bg-gradient-to-r from-emerald-400 to-emerald-500 text-white shadow-[0_4px_15px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {sending ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Sending messages...</> : <><Send className="w-5 h-5" /> Send All Messages</>}
                  </button>
                )}
                {sendError && (
                  <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                    {sendError}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
