"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, WifiOff, Lock } from "lucide-react";
import { cn } from "@/utils/cn";

export const TrustBadges: React.FC<{ variant?: 'minimal' | 'full', className?: string }> = ({ variant = 'full', className }) => {
  const badges = [
    { icon: WifiOff, label: "Offline Support", desc: "Works without active internet" },
    { icon: ShieldCheck, label: "Privacy First", desc: "Local data, no cloud storage" },
    { icon: Lock, label: "Secure System", desc: "End-to-end encrypted safety" },
  ];

  if (variant === 'minimal') {
    return (
      <div className={cn("flex items-center justify-center gap-8 opacity-40 hover:opacity-100 transition-opacity", className)}>
        {badges.map((badge, i) => (
          <div key={i} className="flex items-center gap-2">
            <badge.icon size={12} className="text-slate-400" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">{badge.label}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", className)}>
      {badges.map((badge, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + i * 0.1 }}
          className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <badge.icon size={20} />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-black text-white uppercase tracking-widest">{badge.label}</p>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">{badge.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
