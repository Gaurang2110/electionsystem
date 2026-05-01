"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import turnoutData from "@/data/turnout.json";
import { Info, TrendingUp } from "lucide-react";

export const HeatmapCard: React.FC = () => {
  const [hoveredState, setHoveredState] = React.useState<string | null>(null);

  const getStatus = (val: number) => {
    if (val < 50) return { label: 'Low', color: 'bg-rose-500', text: 'text-rose-400', glow: 'shadow-[0_0_15px_rgba(244,63,94,0.3)]' };
    if (val <= 70) return { label: 'Medium', color: 'bg-amber-500', text: 'text-amber-400', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]' };
    return { label: 'High', color: 'bg-emerald-500', text: 'text-emerald-400', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)]' };
  };

  return (
    <Card className="p-8 bg-slate-900/40 backdrop-blur-3xl border-white/5 relative overflow-hidden group">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-xl font-black text-white font-display uppercase tracking-wider mb-1">Turnout Forecast</h3>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Expected Voter Engagement • 2026</p>
        </div>
        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
          <TrendingUp className="text-primary" size={24} />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {turnoutData.map((item, i) => {
          const status = getStatus(item.turnout);
          const isHovered = hoveredState === item.state;

          return (
            <div 
              key={item.state} 
              className="group/item relative"
              onMouseEnter={() => setHoveredState(item.state)}
              onMouseLeave={() => setHoveredState(null)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-black text-white uppercase tracking-wider">{item.state}</span>
                  <AnimatePresence>
                    {isHovered && (
                      <motion.span 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${status.color} text-white`}
                      >
                        {status.label} Focus
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <span className={`text-xs font-black font-display ${status.text}`}>{item.turnout}%</span>
              </div>
              
              <div className="h-2.5 bg-slate-800/50 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${item.turnout}%` }}
                  transition={{ delay: i * 0.05, duration: 1, ease: "circOut" }}
                  className={`h-full ${status.color} ${status.glow} rounded-full relative`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] animate-[shimmer_2s_infinite]" />
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Med</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">High</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-500 group-hover:text-primary transition-colors">
          <Info size={14} />
          <span className="text-[9px] font-bold uppercase tracking-widest">Mock Forecast Data</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </Card>
  );
};
