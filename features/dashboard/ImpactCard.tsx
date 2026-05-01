"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { Card } from "@/components/ui/Card";
import { Users, Zap, TrendingUp, Heart } from "lucide-react";
import { cn } from "@/utils/cn";

export const ImpactCard: React.FC = () => {
  const { progress, readinessCategory } = useAppStore();

  const impactData = {
    Low: {
      message: "Every vote counts. Your readiness can boost your local booth turnout by 2%.",
      stat: "124 voters in your area are currently active.",
      icon: Zap,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10"
    },
    Medium: {
      message: "You're a catalyst! Your progress is helping your ward reach its 80% goal.",
      stat: "You've inspired 3 neighbors to start their journey.",
      icon: TrendingUp,
      color: "text-amber-400",
      bgColor: "bg-amber-400/10"
    },
    High: {
      message: "Democracy Champion! Your 100% readiness sets the gold standard for your district.",
      stat: "Top 5% of prepared citizens in your constituency.",
      icon: Heart,
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/10"
    }
  }[readinessCategory];

  const Icon = impactData.icon;

  return (
    <Card className="p-8 bg-slate-900 border-white/5 relative overflow-hidden group">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
        <div className={cn("w-20 h-20 rounded-[2rem] flex items-center justify-center shrink-0 shadow-2xl", impactData.bgColor)}>
          <Icon size={40} className={impactData.color} />
        </div>
        
        <div className="flex-1 space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Users size={14} className="text-slate-500" />
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em]">Community Impact</span>
          </div>
          <h3 className="text-xl font-black text-white font-display leading-tight">
            {impactData.message}
          </h3>
          <p className="text-slate-400 text-sm font-medium">
            {impactData.stat}
          </p>
        </div>

        <div className="shrink-0 bg-white/5 p-6 rounded-3xl border border-white/5 text-center min-w-[140px]">
          <span className="text-[10px] font-black uppercase text-slate-500 block mb-1 tracking-widest">Local Readiness</span>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-3xl font-black text-white">74</span>
            <span className="text-sm font-bold text-slate-500">%</span>
          </div>
          <div className="mt-2 w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "74%" }}
              className="h-full bg-primary"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
