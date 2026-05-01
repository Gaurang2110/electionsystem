"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/utils/cn";

export const PersistentProgressBar: React.FC = () => {
  const { progress, readinessCategory } = useAppStore();

  const colors = {
    Low: "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]",
    Medium: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]",
    High: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
  };

  return (
    <div id="tour-readiness" className="fixed top-0 left-0 w-full z-[100] h-1.5 bg-slate-900/50 backdrop-blur-sm">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={cn(
          "h-full relative",
          colors[readinessCategory]
        )}
      >
        <div className="absolute right-0 top-3 px-2 py-0.5 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-md shadow-xl">
          <span className="text-[8px] font-black text-white uppercase tracking-tighter">
            {progress}% Ready
          </span>
        </div>
      </motion.div>
    </div>
  );
};
