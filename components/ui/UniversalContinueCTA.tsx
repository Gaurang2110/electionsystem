"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { Link, usePathname } from "@/i18n/navigation";
import { ArrowRight, Zap } from "lucide-react";
import { cn } from "@/utils/cn";
import { useVoiceGuidance } from "@/hooks/useVoiceGuidance";

export const UniversalContinueCTA: React.FC = () => {
  const { getNextBestAction, progress } = useAppStore();
  const { speak } = useVoiceGuidance();
  const pathname = usePathname();
  const nextAction = getNextBestAction();

  React.useEffect(() => {
    if (nextAction && pathname !== nextAction.link && progress < 100) {
      // Small delay to ensure page load is settled
      const timer = setTimeout(() => {
        speak(`Your next recommended step is ${nextAction.label}. Tap the button at the bottom to continue.`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [nextAction.label, pathname, progress, speak]);

  // Don't show if all steps are completed (100% progress)
  if (progress >= 100) return null;

  // Don't show if we are already on the target page
  // (Assuming nextAction.link is the relative path)
  if (pathname === nextAction.link) return null;

  return (
    <div className="fixed bottom-[20px] left-0 right-0 z-[40] flex justify-center px-6 pointer-events-none">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="pointer-events-auto"
      >
        <Link href={nextAction.link as any}>
          <motion.button
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-4 pl-6 pr-4 py-4 bg-slate-900 text-white rounded-[2rem] border border-white/10 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] group relative overflow-hidden"
          >

            <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />

            <div className="flex flex-col items-start leading-none gap-1 relative z-10">
              <span className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1.5">
                <Zap size={10} fill="currentColor" className="animate-pulse" />
                Recommended Next Step
              </span>
              <span className="text-sm font-black uppercase tracking-tight group-hover:text-primary transition-colors">
                {nextAction.label}
              </span>
            </div>

            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 relative z-10">
              <ArrowRight size={18} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
};
