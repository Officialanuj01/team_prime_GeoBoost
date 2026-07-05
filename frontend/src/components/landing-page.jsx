import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, Calendar, MessageSquare, Target, Zap, TrendingUp, 
  Globe, Users, ArrowRight, ChevronRight, Upload, Brain, 
  LineChart, Send, Check, Sparkles, MapPin, Building2,
  Rocket, Eye, Shield
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import GlassCard from './ui/GlassCard';
import AnimatedCounter from './ui/AnimatedCounter';

/* =============================================
   ANIMATION VARIANTS
   ============================================= */
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

/* =============================================
   SECTION HEADER
   ============================================= */
function SectionHeader({ badge, title, subtitle, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`text-center max-w-3xl mx-auto mb-16 ${className}`}
    >
      {badge && (
        <span className="badge mb-4 inline-flex">
          <Sparkles className="w-3 h-3 mr-1.5" />
          {badge}
        </span>
      )}
      <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-4 mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base sm:text-lg text-gray-500 leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

/* =============================================
   MAIN LANDING PAGE
   ============================================= */
export default function LandingPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you for subscribing with email: ${email}`);
    setEmail('');
  };

  /* ----- FEATURES DATA ----- */
  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'Tourism Campaign Optimization',
      description: 'ML algorithms analyze regional tourism data, local events, and hotel availability to recommend the most effective marketing strategies.',
      color: 'text-primary-500',
    },
    {
      icon: <LineChart className="w-6 h-6" />,
      title: 'Real-Time Regional Analytics',
      description: 'Live insights and analytics to help local boards and hoteliers track tourism performance and monitor local footfall.',
      color: 'text-accent-500',
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Hyper-Local Recommendations',
      description: 'Personalized recommendations for campaign optimization based on the synergy between local attractions and hotel data.',
      color: 'text-violet-500',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'User-Friendly Dashboard',
      description: 'An intuitive dashboard that makes it easy for both hoteliers and tourism promoters to navigate, collaborate, and launch campaigns.',
      color: 'text-emerald-500',
    },
  ];

  /* ----- HOW IT WORKS ----- */
  const steps = [
    { icon: <Upload className="w-6 h-6" />, title: 'Upload Data', description: 'Import hotel occupancy reports, event schedules, and regional tourism data.' },
    { icon: <Brain className="w-6 h-6" />, title: 'AI Analysis', description: 'Our ML models analyze patterns, trends, and correlations in your data.' },
    { icon: <Zap className="w-6 h-6" />, title: 'Generate Campaign', description: 'Receive optimized strategies with timing, content, and channel recommendations.' },
    { icon: <TrendingUp className="w-6 h-6" />, title: 'Track & Optimize', description: 'Monitor real-time performance and iterate with AI-driven insights.' },
  ];



  /* ----- ANCHOR NAV SECTIONS ----- */
  const sections = [
    { id: 'hero', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'cta', label: 'Get Started' },
  ];

  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative">
      {/* ===== Right-Side Sticky Anchor Nav ===== */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-end gap-3">
        {sections.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            className={`group flex items-center gap-2 transition-all duration-300 ${
              activeSection === id ? 'opacity-100' : 'opacity-40 hover:opacity-80'
            }`}
          >
            <span className={`text-[11px] font-medium transition-all duration-300 ${
              activeSection === id ? 'text-primary-600 translate-x-0' : 'text-gray-400 translate-x-2 group-hover:translate-x-0'
            }`}>
              {label}
            </span>
            <div className={`rounded-full transition-all duration-300 ${
              activeSection === id
                ? 'w-2.5 h-2.5 bg-gradient-to-br from-primary-400 to-accent-500 shadow-soft'
                : 'w-1.5 h-1.5 bg-gray-300 group-hover:bg-primary-300'
            }`} />
          </a>
        ))}
      </div>

      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section id="hero" className="relative min-h-screen flex items-center overflow-hidden bg-gradient-hero">
        {/* Floating Decoration Circles */}
        <div className="deco-circle deco-circle-cyan w-[500px] h-[500px] -top-40 -right-40 animate-pulse-soft" />
        <div className="deco-circle deco-circle-blue w-[400px] h-[400px] -bottom-40 -left-40 animate-pulse-soft" style={{ animationDelay: '1.5s' }} />
        <div className="deco-circle deco-circle-cyan w-[200px] h-[200px] top-1/3 right-1/4 animate-pulse-soft" style={{ animationDelay: '3s' }} />

        {/* Small floating sparkle dots */}
        <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-32 right-[20%] w-2 h-2 rounded-full bg-primary-300" />
        <motion.div animate={{ y: [5, -5, 5] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-60 left-[15%] w-1.5 h-1.5 rounded-full bg-accent-300" />
        <motion.div animate={{ y: [-3, 3, -3] }} transition={{ duration: 3.5, repeat: Infinity }} className="absolute bottom-40 right-[30%] w-2.5 h-2.5 rounded-full bg-primary-400" />

        {/* Hero Content */}
        <div className="relative z-10 section-container pt-32 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left: Text Content */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {/* Brand Title */}
              <motion.h1
                variants={fadeInUp}
                className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold gradient-text mb-4"
              >
                GeoBoost
              </motion.h1>

              {/* Tagline */}
              <motion.h2
                variants={fadeInUp}
                className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 flex items-center gap-2 flex-wrap"
              >
                🚀 AI-Powered Tourism Intelligence 📍
              </motion.h2>

              {/* Description */}
              <motion.p
                variants={fadeInUp}
                className="text-lg text-gray-500 max-w-lg mb-8 leading-relaxed"
              >
                Revolutionizing local tourism with{' '}
                <span className="text-primary-600 font-medium">AI-powered predictions</span>,{' '}
                <span className="text-primary-600 font-medium">real-time optimization</span>, and{' '}
                <span className="text-primary-600 font-medium">autonomous campaign management</span>.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/features"
                  className="btn-primary gap-2 !px-8 !py-3.5 text-base"
                >
                  <Zap className="w-4 h-4" />
                  Explore Features
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/upload" className="btn-secondary gap-2 !px-8 !py-3.5 text-base">
                  <Upload className="w-4 h-4" />
                  Upload Data
                </Link>
              </motion.div>
            </motion.div>

            {/* Right: Hero Visual */}
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              {/* Decorative Frame */}
              <div className="relative">
                {/* Outer glow border */}
                <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-primary-300/30 via-transparent to-accent-300/30 blur-sm" />
                
                {/* Card with dashboard preview */}
                <div className="relative bg-white rounded-2xl shadow-soft-lg border border-primary-100/50 overflow-hidden p-6">
                  {/* Mock Dashboard */}
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center">
                          <BarChart3 className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">Campaign Dashboard</span>
                      </div>
                      <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                      </div>
                    </div>

                    {/* Mini Stats */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Occupancy', value: '87%', color: 'text-emerald-500' },
                        { label: 'Campaigns', value: '24', color: 'text-primary-500' },
                        { label: 'Revenue', value: '+32%', color: 'text-accent-500' },
                      ].map((s) => (
                        <div key={s.label} className="bg-surface-100 rounded-xl p-3 text-center">
                          <p className="text-xs text-gray-400">{s.label}</p>
                          <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Mini Chart */}
                    <div className="bg-surface-100 rounded-xl p-4">
                      <p className="text-xs text-gray-400 mb-3">Regional Footfall Trend</p>
                      <div className="flex items-end gap-1.5 h-24">
                        {[35, 50, 42, 68, 55, 78, 62, 85, 72, 92, 80, 95].map((h, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ delay: 0.5 + i * 0.06, duration: 0.5, ease: 'easeOut' }}
                            className="flex-1 rounded-t bg-gradient-to-t from-primary-400 to-primary-300"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating accent elements */}
                <motion.div
                  animate={{ y: [-8, 8, -8] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute -top-6 -right-6 w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 border border-primary-200 flex items-center justify-center shadow-soft"
                >
                  <Globe className="w-5 h-5 text-primary-500" />
                </motion.div>
                <motion.div
                  animate={{ y: [6, -6, 6] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -bottom-4 -left-4 w-10 h-10 rounded-xl bg-gradient-to-br from-accent-100 to-accent-200 border border-accent-200 flex items-center justify-center shadow-soft"
                >
                  <MapPin className="w-4 h-4 text-accent-500" />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-20"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { end: 500, suffix: '+', label: 'Campaigns Optimized' },
                { end: 32, suffix: '%', label: 'Avg Occupancy Boost' },
                { end: 150, suffix: '+', label: 'Partner Hotels' },
                { end: 98, suffix: '%', label: 'Client Satisfaction' },
              ].map((stat) => (
                <div key={stat.label} className="glass-card p-5 text-center">
                  <AnimatedCounter end={stat.end} suffix={stat.suffix} label={stat.label} />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          FEATURES SECTION
          ============================================ */}
      <section id="features" className="relative py-24 lg:py-32 bg-gradient-section">
        <div className="section-container">
          <SectionHeader
            badge="Features"
            title="Everything You Need to Drive Local Tourism"
            subtitle="A comprehensive suite of AI-powered tools designed to transform how tourism boards and hotels collaborate on marketing."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {features.map((feature, index) => (
              <GlassCard key={feature.title} delay={index * 0.1} className="p-7">
                <div className="flex items-start gap-5">
                  <div className="icon-container shrink-0">
                    <span className={feature.color}>{feature.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-gray-800 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
                {/* Small dot accent */}
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary-200" />
              </GlassCard>
            ))}
          </div>
        </div>

        <div className="deco-circle deco-circle-cyan w-[300px] h-[300px] -right-20 top-20" />
      </section>

      {/* ============================================
          HOW IT WORKS SECTION
          ============================================ */}
      <section id="how-it-works" className="relative py-24 lg:py-32">
        <div className="section-container">
          <SectionHeader
            badge="How It Works"
            title="From Data to Results in 4 Steps"
            subtitle="Our streamlined pipeline transforms raw data into optimized, AI-driven marketing campaigns."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="relative text-center"
              >
                {/* Step Number */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white font-bold text-xl mx-auto mb-5 shadow-btn">
                  {index + 1}
                </div>

                {/* Connecting Line (desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-7 left-[calc(50%+35px)] w-[calc(100%-70px)] h-0.5 bg-gradient-to-r from-primary-200 to-accent-200" />
                )}

                <h3 className="font-display font-semibold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          ANALYTICS PREVIEW SECTION
          ============================================ */}
      <section id="analytics" className="relative py-24 lg:py-32 bg-gradient-section overflow-hidden">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="badge mb-4 inline-flex">
                <BarChart3 className="w-3 h-3 mr-1.5" />
                Analytics Dashboard
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Real-Time Insights at{' '}
                <span className="gradient-text">Your Fingertips</span>
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                Monitor campaign performance, track regional footfall, and analyze occupancy trends 
                with our intuitive analytics dashboard. Make data-driven decisions in real-time.
              </p>

              <ul className="space-y-4">
                {[
                  'Live campaign performance tracking',
                  'Regional footfall heatmaps',
                  'Occupancy rate forecasting',
                  'ROI analytics per channel',
                ].map((item, i) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-center gap-3 text-gray-600"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-emerald-500" />
                    </div>
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Right: Dashboard Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl p-6 shadow-soft-lg border border-primary-100/50">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700">Campaign Overview</h4>
                    <p className="text-xs text-gray-400">Last 30 days</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="w-3 h-3 rounded-full bg-primary-400" />
                  </div>
                </div>

                <div className="flex items-end gap-2 h-40 mb-6">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((height, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${height}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.05, duration: 0.5, ease: 'easeOut' }}
                      className="flex-1 rounded-t-md bg-gradient-to-t from-primary-500 to-primary-300"
                    />
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Impressions', value: '24.5K', change: '+12%' },
                    { label: 'Bookings', value: '1,847', change: '+28%' },
                    { label: 'Revenue', value: '$142K', change: '+18%' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-surface-100 rounded-xl p-3">
                      <p className="text-xs text-gray-400">{stat.label}</p>
                      <p className="text-lg font-bold text-gray-800">{stat.value}</p>
                      <p className="text-xs text-emerald-500">{stat.change}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute -inset-4 bg-primary-100/20 rounded-3xl blur-xl -z-10" />
            </motion.div>
          </div>
        </div>

        <div className="deco-circle deco-circle-blue w-[400px] h-[400px] -left-40 top-20" />
      </section>



      {/* ============================================
          CTA / NEWSLETTER
          ============================================ */}
      <section id="cta" className="relative py-24 lg:py-32 bg-gradient-section overflow-hidden">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-white rounded-3xl p-8 sm:p-12 lg:p-16 text-center shadow-soft-lg border border-primary-100/50 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400" />
            <div className="deco-circle deco-circle-cyan w-[200px] h-[200px] -top-20 -right-20" />
            <div className="deco-circle deco-circle-blue w-[150px] h-[150px] -bottom-20 -left-20" />

            <div className="relative z-10">
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Ready to Boost Your Region's Tourism?
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8 leading-relaxed">
                Join hundreds of tourism boards and hotels already using GeoBoost to drive regional 
                occupancy and create unforgettable visitor experiences.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your work email"
                  className="input-light flex-1"
                  required
                />
                <button type="submit" className="btn-primary whitespace-nowrap gap-2">
                  Get Early Access
                  <Send className="w-4 h-4" />
                </button>
              </form>

              <p className="text-xs text-gray-400 mt-4">
                Free to get started. No credit card required.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}