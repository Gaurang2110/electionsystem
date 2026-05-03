"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";

export const NextStepBar = () => {
  const { getNextBestAction, progress } = useAppStore();
  const [mounted, setMounted] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const nextAction = getNextBestAction();

  if (!nextAction || nextAction.id === 'ready' || progress >= 100) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 shadow-sm"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-200">
            <Sparkles size={20} />
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Recommended Next Step</h4>
            <p className="text-base font-bold text-slate-800 mt-1">{nextAction.label}</p>
          </div>
        </div>
        
        <button 
          onClick={() => router.push(nextAction.link)}
          className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all active:scale-95 flex items-center justify-center gap-2 group"
        >
          Continue <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
