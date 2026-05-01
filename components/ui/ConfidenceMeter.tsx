"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { cn } from "@/utils/cn";

export const ConfidenceMeter: React.FC<{ className?: string }> = ({ className }) => {
  const { readinessCategory, progress } = useAppStore();

  const config = {
    Low: {
      label: "Low Confidence",
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-500/20",
      icon: ShieldAlert,
      width: "w-1/3"
    },
    Medium: {
      label: "Growing Confidence",
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
      icon: Shield,
      width: "w-2/3"
    },
    High: {
      label: "High Confidence",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      icon: ShieldCheck,
      width: "w-full"
    }
  };

  const current = config[readinessCategory];
  const Icon = current.icon;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn("p-2 rounded-lg", current.bgColor)}>
            <Icon size={16} className={current.color} />
          </div>
          <span className={cn("text-[11px] font-black uppercase tracking-widest", current.color)}>
            {current.label}
          </span>
        </div>
        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
          {progress}% Ready
        </span>
      </div>
      
      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5 p-[1px]">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className={cn(
            "h-full rounded-full transition-all duration-1000",
            readinessCategory === 'Low' ? "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" :
            readinessCategory === 'Medium' ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" :
            "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
          )}
        />
      </div>
    </div>
  );
};
