import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, LineChart, Target, Users, Sparkles, Zap, Globe, 
  ArrowRight, Check, TrendingUp, MapPin, BarChart3, Shield, 
  Clock, Cpu, Database, Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../ui/GlassCard';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

export default function FeaturesPage() {
  const navigate = useNavigate();

  const mainFeatures = [
    {
      icon: <Brain className="w-7 h-7" />,
      title: 'Tourism Campaign Optimization',
      description: 'ML algorithms analyze regional tourism data, local events, and hotel availability to recommend the most effective marketing strategies.',
      details: ['Demand forecasting with Prophet/LSTM', 'Multi-channel budget allocation', 'A/B testing recommendations', 'Seasonal pattern detection'],
      gradient: 'from-primary-400 to-primary-500',
    },
    {
      icon: <LineChart className="w-7 h-7" />,
      title: 'Real-Time Regional Analytics',
      description: 'Live insights and analytics to help local boards and hoteliers track tourism performance and monitor local footfall.',
      details: ['Live campaign dashboards', 'Footfall heatmaps', 'Conversion tracking', 'Competitor benchmarking'],
      gradient: 'from-accent-400 to-accent-500',
    },
    {
      icon: <Target className="w-7 h-7" />,
      title: 'Hyper-Local Recommendations',
      description: 'Personalized recommendations for campaign optimization based on the synergy between local attractions and hotel data.',
      details: ['Location-aware targeting', 'Event-driven triggers', 'Weather-adaptive campaigns', 'Audience micro-segments'],
      gradient: 'from-violet-400 to-violet-500',
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: 'Collaborative Dashboard',
      description: 'An intuitive dashboard that makes it easy for both hoteliers and tourism promoters to navigate, collaborate, and launch campaigns.',
      details: ['Role-based access control', 'Real-time collaboration', 'Shared campaign templates', 'Comment & approval workflows'],
      gradient: 'from-emerald-400 to-emerald-500',
    },
  ];

  const capabilities = [
    { icon: <Cpu className="w-5 h-5" />, label: 'AI/ML Core', value: 'Gemini + Custom Models' },
    { icon: <Database className="w-5 h-5" />, label: 'Data Sources', value: '15+ Integrations' },
    { icon: <Shield className="w-5 h-5" />, label: 'Security', value: 'SOC2 Compliant' },
    { icon: <Clock className="w-5 h-5" />, label: 'Processing', value: '< 2s Response Time' },
    { icon: <Globe className="w-5 h-5" />, label: 'Coverage', value: '50+ Regions' },
    { icon: <Layers className="w-5 h-5" />, label: 'API', value: 'RESTful + WebSocket' },
  ];

  return (
    <div className="relative min-h-screen pt-24 pb-16 bg-gradient-hero">
      <div className="deco-circle deco-circle-cyan w-[400px] h-[400px] -top-40 -right-40 fixed" />
      <div className="deco-circle deco-circle-blue w-[300px] h-[300px] bottom-20 -left-40 fixed" />

      <div className="section-container relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-20">
          <span className="badge mb-4 inline-flex"><Sparkles className="w-3 h-3 mr-1.5" /> Platform Features</span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Everything You Need to{' '}
            <span className="gradient-text">Boost Tourism</span>
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            A comprehensive AI-powered suite designed to transform how tourism boards and hotels collaborate on data-driven marketing campaigns.
          </p>
        </motion.div>

        {/* Main Feature Cards */}
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-2 gap-6 mb-24">
          {mainFeatures.map((feature, index) => (
            <motion.div key={feature.title} variants={fadeInUp}>
              <GlassCard className="p-8 h-full" hover={true}>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-6 shadow-btn`}>
                  {feature.icon}
                </div>
                <h3 className="font-display font-bold text-xl text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail) => (
                    <li key={detail} className="flex items-center gap-2.5 text-sm text-gray-600">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-emerald-500" />
                      </div>
                      {detail}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Capabilities Grid */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="font-display text-3xl font-bold text-gray-900 text-center mb-12">
            Platform <span className="gradient-text">Capabilities</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {capabilities.map((cap, i) => (
              <motion.div
                key={cap.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-5 text-center border border-primary-100/30 shadow-card hover:shadow-card-hover hover:-translate-y-2 transition-all duration-300"
              >
                <div className="icon-container mx-auto mb-3 text-primary-500">{cap.icon}</div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">{cap.label}</p>
                <p className="text-sm font-semibold text-gray-700">{cap.value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          <button onClick={() => navigate('/upload')} className="btn-glow gap-2">
            <Zap className="w-5 h-5" /> Start Your First Campaign <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
