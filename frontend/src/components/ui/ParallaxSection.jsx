import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ParallaxSection({ 
  children, 
  className = '',
  speed = 0.3,
  direction = 'up',
  ...props 
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const multiplier = direction === 'up' ? -1 : 1;
  const y = useTransform(scrollYProgress, [0, 1], [100 * speed * multiplier, -100 * speed * multiplier]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`} {...props}>
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
}

export function ParallaxElement({ 
  children, 
  speed = 0.5, 
  className = '',
  rotate = false,
  ...props 
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [80 * speed, -80 * speed]);
  const rotation = useTransform(scrollYProgress, [0, 1], [0, rotate ? 360 * speed : 0]);

  return (
    <motion.div
      ref={ref}
      style={{ y, rotate: rotation }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
