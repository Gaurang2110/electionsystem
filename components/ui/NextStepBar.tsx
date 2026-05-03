"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/utils/cn";

interface NextStepBarProps {
  className?: string;
}

export const NextStepBar: React.FC<NextStepBarProps> = ({ className }) => {
  const { getNextBestAction, mounted } = useAppStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const nextAction = getNextBestAction();

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        "bg-slate-900 text-white p-6 rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden relative group",
        className
      )}
    >
      <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
        <Sparkles size={100} />
      </div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-inner shrink-0">
            <Sparkles size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Guided Next Step</span>
              <div className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase rounded-md border border-emerald-500/20">
                {nextAction.impact} Readiness
              </div>
            </div>
            <h4 className="text-lg font-black text-white uppercase tracking-tight">{nextAction.label}</h4>
          </div>
        </div>
        
        <Button 
          size="lg" 
          onClick={() => router.push(nextAction.link)}
          className="w-full md:w-auto h-14 px-10 bg-white text-slate-900 hover:bg-slate-50 rounded-2xl font-black text-xs uppercase tracking-widest group/btn"
        >
          Continue Journey
          <ArrowRight size={18} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </div>
    </motion.div>
  );
};
