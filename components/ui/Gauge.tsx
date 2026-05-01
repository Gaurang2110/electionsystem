"use client";
import React from "react";
import { motion } from "framer-motion";

interface GaugeProps {
  value: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  label?: string;
  subLabel?: string;
}

export const Gauge: React.FC<GaugeProps> = ({ 
  value, 
  size = 120, 
  strokeWidth = 10,
  label,
  subLabel
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  // We want a semi-circle or arc, but Stitch uses a specific offset arc
  // Let's use a 270 degree arc starting from bottom-left
  const arcLength = circumference * 0.75; 
  const dashOffset = arcLength * (1 - value / 100);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-[135deg]">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
        />
        {/* Progress track */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#gauge-gradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          initial={{ strokeDashoffset: arcLength }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 2, ease: "easeOut" }}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <span className="text-3xl font-black font-display leading-none">{value}%</span>
        {subLabel && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{subLabel}</span>}
      </div>
    </div>
  );
};
