import React from 'react';
import { motion } from 'framer-motion';

export default function GlassCard({ 
  children, 
  className = '', 
  hover = true,
  delay = 0,
  ...props 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}
      whileHover={hover ? { y: -6, scale: 1.02 } : {}}
      className={`
        relative overflow-hidden rounded-2xl
        bg-white/70 backdrop-blur-xl
        border border-primary-100/30
        shadow-card
        transition-all duration-400
        ${hover ? 'hover:shadow-card-hover hover:border-primary-200/50' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
}
