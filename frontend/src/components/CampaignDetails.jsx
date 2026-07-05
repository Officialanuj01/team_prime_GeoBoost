import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Send, CheckCircle2, Mail, Heart, ArrowLeft } from 'lucide-react';

const customers = [
  { name: 'John Smith', email: 'john.smith@example.com', preference: 'eco-friendly hotels', avatar: 'JS' },
  { name: 'Emma Johnson', email: 'emma.johnson@example.com', preference: 'luxury hotels', avatar: 'EJ' },
  { name: 'Liam Williams', email: 'liam.williams@example.com', preference: 'budget-friendly hotels', avatar: 'LW' },
  { name: 'Ava Brown', email: 'ava.brown@example.com', preference: 'beach resorts', avatar: 'AB' },
  { name: 'Noah Davis', email: 'noah.davis@example.com', preference: 'boutique hotels', avatar: 'ND' },
  { name: 'Mia Garcia', email: 'mia.garcia@example.com', preference: 'family-friendly hotels', avatar: 'MG' },
  { name: 'Oliver Martinez', email: 'oliver.martinez@example.com', preference: 'city hotels', avatar: 'OM' },
  { name: 'Sophia Rodriguez', email: 'sophia.rodriguez@example.com', preference: 'wellness retreats', avatar: 'SR' },
  { name: 'Elijah Wilson', email: 'elijah.wilson@example.com', preference: 'adventure trips', avatar: 'EW' },
  { name: 'Isabella Anderson', email: 'isabella.anderson@example.com', preference: 'cultural experiences', avatar: 'IA' },
  { name: 'Mia Patel', email: 'mia.patel@example.com', preference: 'urban hotels', avatar: 'MP' },
];

const preferenceColors = {
  'eco-friendly hotels': 'from-emerald-400 to-green-500',
  'luxury hotels': 'from-amber-400 to-yellow-500',
  'budget-friendly hotels': 'from-blue-400 to-blue-500',
  'beach resorts': 'from-cyan-400 to-cyan-500',
  'boutique hotels': 'from-purple-400 to-purple-500',
  'family-friendly hotels': 'from-rose-400 to-pink-500',
  'city hotels': 'from-slate-400 to-slate-500',
  'wellness retreats': 'from-teal-400 to-teal-500',
  'adventure trips': 'from-orange-400 to-orange-500',
  'cultural experiences': 'from-indigo-400 to-indigo-500',
  'urban hotels': 'from-violet-400 to-violet-500',
};

export default function CampaignDetails() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedCustomers, setSelectedCustomers] = useState(new Set());

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || c.preference.includes(selectedFilter);
    return matchesSearch && matchesFilter;
  });

  const toggleCustomer = (email) => {
    setSelectedCustomers((prev) => {
      const next = new Set(prev);
      if (next.has(email)) next.delete(email);
      else next.add(email);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedCustomers.size === filteredCustomers.length) setSelectedCustomers(new Set());
    else setSelectedCustomers(new Set(filteredCustomers.map((c) => c.email)));
  };

  const handleSendMessage = () => {
    const count = selectedCustomers.size || filteredCustomers.length;
    alert(`Campaign messages sent to ${count} recipients!`);
    navigate('/');
  };

  const filters = ['all', 'hotel', 'resort', 'retreat', 'trip', 'experience'];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-hero">
      <div className="section-container max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary-600 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold text-gray-900 mb-1">Campaign Recipients</h1>
              <p className="text-gray-500">{customers.length} targeted customers ready for outreach</p>
            </div>
            <span className="badge"><Users className="w-3 h-3 mr-1.5" />{filteredCustomers.length} shown</span>
          </div>
        </motion.div>

        {/* Search & Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-4 mb-6 shadow-card border border-primary-100/30">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search customers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-light !pl-10 w-full" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {filters.map((f) => (
                <button key={f} onClick={() => setSelectedFilter(f)} className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 capitalize ${
                  selectedFilter === f ? 'bg-primary-100 text-primary-600 border border-primary-200' : 'bg-surface-100 text-gray-500 border border-gray-100 hover:bg-primary-50'
                }`}>{f}</button>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="flex items-center justify-between mb-4 px-1">
          <button onClick={selectAll} className="text-xs text-primary-500 hover:text-primary-600 transition-colors font-medium">
            {selectedCustomers.size === filteredCustomers.length ? 'Deselect All' : 'Select All'}
          </button>
          {selectedCustomers.size > 0 && <span className="text-xs text-gray-400">{selectedCustomers.size} selected</span>}
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {filteredCustomers.map((customer, index) => (
              <motion.div key={customer.email} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: index * 0.03 }}
                onClick={() => toggleCustomer(customer.email)}
                className={`bg-white rounded-2xl p-5 cursor-pointer border transition-all duration-300 shadow-card hover:shadow-card-hover hover:-translate-y-1 ${
                  selectedCustomers.has(customer.email) ? 'border-primary-300 bg-primary-50/30' : 'border-primary-100/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${preferenceColors[customer.preference] || 'from-gray-400 to-gray-500'} flex items-center justify-center text-white font-bold text-xs shrink-0`}>
                    {customer.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-gray-800 truncate">{customer.name}</p>
                      {selectedCustomers.has(customer.email) && <CheckCircle2 className="w-4 h-4 text-primary-500 shrink-0" />}
                    </div>
                    <p className="text-xs text-gray-400 flex items-center gap-1.5"><Mail className="w-3 h-3" /> {customer.email}</p>
                  </div>
                  <span className="hidden sm:inline-flex text-xs text-gray-500 px-3 py-1.5 rounded-lg bg-surface-100 border border-gray-100 capitalize">
                    <Heart className="w-3 h-3 mr-1.5 text-rose-400" />{customer.preference}
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-50">
                  <p className="text-xs text-gray-400 leading-relaxed">
                    <span className="text-gray-500 font-medium">AI Message:</span> Hello {customer.name.split(' ')[0]}, based on your preference for {customer.preference}, we have a special offer just for you!
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-8">
          <button onClick={handleSendMessage} className="btn-glow w-full group">
            <Send className="w-5 h-5 mr-2" /> Send Campaign to {selectedCustomers.size || filteredCustomers.length} Recipients
          </button>
        </motion.div>
      </div>
    </div>
  );
}
