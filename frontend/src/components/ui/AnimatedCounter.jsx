import React from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

export default function AnimatedCounter({ 
  end, 
  suffix = '', 
  prefix = '', 
  duration = 2.5,
  label,
  className = '' 
}) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <div ref={ref} className={`text-center ${className}`}>
      <div className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display gradient-text">
        {inView ? (
          <CountUp
            start={0}
            end={end}
            duration={duration}
            prefix={prefix}
            suffix={suffix}
            separator=","
          />
        ) : (
          <span>{prefix}0{suffix}</span>
        )}
      </div>
      {label && (
        <p className="mt-1.5 text-xs sm:text-sm text-gray-500 font-medium">{label}</p>
      )}
    </div>
  );
}
