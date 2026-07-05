import React from 'react';
import { motion } from 'framer-motion';
import { Users, Globe, MapPin, Sparkles, Heart, Rocket, Target, Code, ArrowRight, Linkedin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AboutPage() {
  const navigate = useNavigate();

  const team = [
    { name: 'Team Prime', role: 'Development Team', emoji: '🚀' },
  ];

  const values = [
    { icon: <Target className="w-6 h-6" />, title: 'Data-Driven', description: 'Every recommendation is backed by real regional data and ML models.' },
    { icon: <Heart className="w-6 h-6" />, title: 'Community First', description: 'Built to empower local economies and boost regional tourism sustainably.' },
    { icon: <Globe className="w-6 h-6" />, title: 'Hyperlocal Focus', description: 'Deep understanding of local attractions, events, and seasonal patterns.' },
    { icon: <Code className="w-6 h-6" />, title: 'Innovation', description: 'Leveraging cutting-edge AI — Gemini, Prophet, and real-time analytics.' },
  ];

  const timeline = [
    { title: 'Problem Identified', description: 'Tourism boards and hotels run siloed, poorly timed campaigns — wasting budgets.', year: 'Phase 1' },
    { title: 'GeoBoost Concept', description: 'An AI platform that unifies tourism data to optimize joint marketing campaigns.', year: 'Phase 2' },
    { title: 'MVP Built', description: 'Campaign upload, AI analysis, personalized notifications, and analytics dashboard.', year: 'Phase 3' },
    { title: 'Scaling Up', description: 'Expanding to 50+ regions, adding real-time event tracking and weather-adaptive campaigns.', year: 'Phase 4' },
  ];

  return (
    <div className="relative min-h-screen pt-24 pb-16 bg-gradient-hero">
      <div className="deco-circle deco-circle-cyan w-[300px] h-[300px] top-20 -right-20 fixed" />

      <div className="section-container relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-20">
          <span className="badge mb-4 inline-flex"><Users className="w-3 h-3 mr-1.5" /> About GeoBoost</span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Boosting Local Tourism with{' '}
            <span className="gradient-text">AI Intelligence</span>
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed">
            GeoBoost is designed to help local tourism boards, municipalities, and partner hotels optimize their joint marketing campaigns to drive local tourism and boost regional occupancy rates.
          </p>
        </motion.div>

        {/* Values */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-24">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-7 border border-primary-100/30 shadow-card hover:shadow-card-hover hover:-translate-y-2 transition-all duration-300 text-center"
            >
              <div className="icon-container mx-auto mb-4 text-primary-500">{v.icon}</div>
              <h3 className="font-display font-semibold text-gray-800 mb-2">{v.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{v.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Journey Timeline */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-24">
          <h2 className="font-display text-3xl font-bold text-gray-900 text-center mb-12">
            Our <span className="gradient-text">Journey</span>
          </h2>
          <div className="relative max-w-2xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-300 via-accent-300 to-primary-300" />

            <div className="space-y-8">
              {timeline.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative pl-16"
                >
                  {/* Dot */}
                  <div className="absolute left-[17px] top-1 w-5 h-5 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 border-4 border-white shadow-soft" />
                  <div className="bg-white rounded-2xl p-5 border border-primary-100/30 shadow-card">
                    <span className="badge text-[10px] mb-2 inline-flex">{step.year}</span>
                    <h3 className="font-display font-semibold text-gray-800 mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-500">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Team */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">Built by <span className="gradient-text">Team Prime</span></h2>
          <p className="text-gray-500 max-w-lg mx-auto mb-8">
            A passionate team of developers competing in the Google Solution Challenge 2026, building solutions that matter.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            {[
              { name: 'Anuj Sahu', role: 'Full Stack Developer', linkedin: 'https://www.linkedin.com/in/anuj-sahu-4059bb253/' },
              { name: 'Saksham Gupta', role: 'Full Stack Developer', linkedin: 'https://www.linkedin.com/in/saksham-gupta-87a1a427b/' },
              { name: 'Devraj Patil', role: 'Full Stack Developer', linkedin: 'https://www.linkedin.com/in/devraj-patil-0944b22b5/' },
            ].map((member, i) => (
              <a 
                key={member.name}
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-white rounded-2xl px-6 py-4 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 border border-primary-100/30 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white text-lg font-bold group-hover:scale-110 transition-transform duration-300">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="text-left">
                  <p className="font-display font-bold text-gray-800">{member.name}</p>
                  <p className="text-xs text-primary-500 font-medium">{member.role}</p>
                </div>
                <Linkedin className="w-4 h-4 text-gray-300 group-hover:text-primary-500 transition-colors ml-auto" />
              </a>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          <button onClick={() => navigate('/upload')} className="btn-glow gap-2">
            <Rocket className="w-5 h-5" /> Get Started with GeoBoost <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
