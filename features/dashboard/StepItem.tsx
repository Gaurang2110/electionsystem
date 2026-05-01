"use client";
import * as React from "react";
import { Check, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { SpeakerButton } from "@/components/ui/SpeakerButton";

interface StepItemProps {
  id: string;
  index: number;
  title: string;
  description: string;
  time: string;
  status: "pending" | "complete";
  tip?: string;
  onComplete: () => void;
}

export const StepItem: React.FC<StepItemProps> = ({ id, index, title, description, time, status, tip, onComplete }) => {
  const isComplete = status === "complete";
  const t = useTranslations('journey');

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative pl-24 pb-12 last:pb-0"
    >
      {/* Connector Dot */}
      <div className={cn(
        "absolute left-[30px] top-4 w-5 h-5 rounded-full border-4 z-10 transition-all duration-500",
        isComplete ? "bg-emerald-500 border-emerald-500/30 scale-110 shadow-[0_0_15px_rgba(16,185,129,0.5)]" : "bg-slate-900 border-slate-700"
      )} />

      <Card 
        className={cn(
          "relative overflow-hidden transition-all duration-500 p-6 group",
          isComplete ? "bg-emerald-500/5 border-emerald-500/20 shadow-none" : "bg-slate-900/40 border-white/5 shadow-2xl hover:bg-slate-900/60"
        )}
        hover={!isComplete}
      >
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h3 className={cn(
                  "font-bold text-xl leading-tight transition-colors duration-500 font-display flex items-center gap-2",
                  isComplete ? "text-emerald-400" : "text-white"
                )}>
                  {title}
                  <SpeakerButton text={`${title}. ${description}`} className="p-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                {isComplete && <Check size={18} className="text-emerald-400" strokeWidth={3} />}
              </div>
              <p className={cn(
                "text-sm font-medium leading-relaxed transition-colors duration-500",
                isComplete ? "text-emerald-400/60" : "text-slate-500"
              )}>
                {description}
              </p>
            </div>
            <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest shrink-0">
              {time}
            </div>
          </div>

          {tip && !isComplete && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-primary/10 border border-primary/20 relative group/tip"
            >
              <div className="flex items-start justify-between gap-4">
                <p className="text-xs font-bold text-primary leading-relaxed">
                  {tip}
                </p>
                <SpeakerButton text={tip} className="text-primary hover:bg-primary/10" />
              </div>
            </motion.div>
          )}
          
          <AnimatePresence>
            {!isComplete && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="w-full sm:w-fit gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20" 
                  onClick={onComplete}
                >
                  {t('mark_complete')}
                  <ArrowRight size={16} />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Subtle 3D Reflection */}
        {!isComplete && (
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        )}
      </Card>
    </motion.div>
  );
};
