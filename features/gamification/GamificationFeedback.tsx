"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { Sparkles, TrendingUp } from "lucide-react";

export const GamificationFeedback: React.FC = () => {
  const { gamification } = useAppStore();
  const [lastPoints, setLastPoints] = React.useState(gamification.points);
  const [pointDiff, setPointDiff] = React.useState<number | null>(null);
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    if (gamification.points > lastPoints) {
      const diff = gamification.points - lastPoints;
      setPointDiff(diff);
      setLastPoints(gamification.points);
      setShow(true);
      
      const timer = setTimeout(() => {
        setShow(false);
      }, 2500);
      
      return () => clearTimeout(timer);
    }
  }, [gamification.points]);

  return (
    <AnimatePresence>
      {show && pointDiff && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9, transition: { duration: 0.2 } }}
          className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[100] pointer-events-none"
        >
          <div className="bg-slate-900/90 backdrop-blur-2xl border border-emerald-500/30 px-8 py-4 rounded-[2rem] shadow-[0_20px_50px_-10px_rgba(16,185,129,0.3)] flex items-center gap-4 border-l-[6px] border-l-emerald-500">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-500 shadow-3d">
              <TrendingUp size={20} className="animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-white font-display">+{pointDiff}</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Democracy Points</span>
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Contribution Recognized</p>
            </div>
            <Sparkles size={18} className="text-emerald-500 animate-pulse ml-2" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
