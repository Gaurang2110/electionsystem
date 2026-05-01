"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { getBadgeById } from "@/lib/gamificationService";
import { Star, Sparkles, X } from "lucide-react";

export const BadgeUnlockOverlay: React.FC = () => {
  const { gamification } = useAppStore();
  const [lastBadge, setLastBadge] = React.useState<string | null>(null);
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const latest = gamification.badges[gamification.badges.length - 1];
    if (latest && latest !== lastBadge) {
      setLastBadge(latest);
      setShow(true);
      const timer = setTimeout(() => setShow(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [gamification.badges]);

  const badge = lastBadge ? getBadgeById(lastBadge) : null;

  return (
    <AnimatePresence>
      {show && badge && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -50 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-sm"
        >
          <div className="relative p-8 rounded-[2.5rem] bg-slate-900 border border-amber-500/30 shadow-[0_30px_60px_-15px_rgba(245,158,11,0.3)] overflow-hidden text-center space-y-6">
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-12 -left-12 opacity-20"
            >
              <Sparkles size={120} className="text-amber-500" />
            </motion.div>

            <button 
              onClick={() => setShow(false)}
              className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="relative">
              <motion.div 
                initial={{ rotateY: 180 }}
                animate={{ rotateY: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 10, delay: 0.2 }}
                className="w-24 h-24 bg-amber-500/20 border border-amber-500/30 rounded-[2rem] flex items-center justify-center text-5xl mx-auto shadow-2xl"
              >
                {badge.icon}
              </motion.div>
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="absolute -bottom-2 -right-2 bg-amber-500 text-slate-900 text-[10px] font-black px-3 py-1 rounded-full shadow-lg border-2 border-slate-900"
              >
                +{badge.points} PTS
              </motion.div>
            </div>

            <div className="space-y-2 relative">
              <p className="text-amber-500 font-black uppercase text-[10px] tracking-[0.4em]">New Badge Unlocked</p>
              <h3 className="text-3xl font-black text-white font-display tracking-tight uppercase leading-tight">
                {badge.label}
              </h3>
              <p className="text-xs text-slate-400 font-bold leading-relaxed px-4">
                {badge.description}
              </p>
            </div>

            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 5, ease: "linear" }}
              className="absolute bottom-0 left-0 h-1 bg-amber-500"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
