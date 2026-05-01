import * as React from "react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number;
  className?: string;
  label?: string;
  variant?: 'default' | 'premium';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, className, label, variant = 'default' }) => {
  return (
    <div className={cn("w-full", className)}>
      {(label || value !== undefined) && (
        <div className="flex justify-between items-end mb-3 px-1">
          {label && <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</span>}
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900 font-display leading-none">{value}</span>
            <span className="text-[10px] font-black text-slate-400 uppercase">%</span>
          </div>
        </div>
      )}
      <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden relative border border-slate-200/50 shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "h-full rounded-full relative shadow-[0_2px_10px_-2px_rgba(37,99,235,0.3)]",
            value >= 80 ? "bg-gradient-to-r from-emerald-500 to-emerald-400" : "bg-gradient-to-r from-blue-600 to-indigo-500"
          )}
        >
          {/* Animated Reflection */}
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/2 skew-x-[-20deg]"
          />
        </motion.div>
      </div>
    </div>
  );
};
