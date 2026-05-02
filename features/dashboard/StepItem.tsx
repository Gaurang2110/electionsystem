"use client";
import * as React from "react";
import { Check, Clock, UserPlus, ShieldCheck, MapPin, CheckSquare, LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

interface StepItemProps {
  id: string;
  index: number;
  title: string;
  description: string;
  time: string;
  status: "pending" | "complete" | "active";
  onComplete: () => void;
}

const IconMap: Record<string, LucideIcon> = {
  registration: UserPlus,
  verification: ShieldCheck,
  booth: MapPin,
  vote: CheckSquare,
};

export const StepItem: React.FC<StepItemProps> = ({ id, index, title, description, time, status, onComplete }) => {
  const isComplete = status === "complete";
  const isActive = status === "active";
  const t = useTranslations('journey');
  const Icon = IconMap[id] || CheckSquare;

  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "relative flex items-center gap-4 md:gap-8 group transition-all duration-500",
        isActive ? "z-20 scale-[1.01]" : "z-10"
      )}
    >
      {/* PREMIUM TIMELINE INDICATOR */}
      <div className="relative z-10 flex flex-col items-center">
        <div className={cn(
          "w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center border-[4px] transition-all duration-700 relative",
          isComplete ? "bg-emerald-500 border-emerald-100/50 text-white shadow-[0_0_30px_rgba(16,185,129,0.3)]" :
            isActive ? "bg-slate-900 border-primary/40 text-primary shadow-[0_0_40px_rgba(99,102,241,0.4)] ring-8 ring-primary/5" :
              "bg-slate-100 border-slate-50 text-slate-300"
        )}>
          {isComplete ? (
            <Check size={24} strokeWidth={3} />
          ) : (
            <div className="relative">
              <Icon size={isActive ? 28 : 20} className={isActive ? "text-primary" : "text-slate-300"} />
              {isActive && (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 bg-primary/30 rounded-full -m-3"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}
                    className="absolute inset-0 bg-primary/20 rounded-full -m-1.5"
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* PREMIUM STEP CARD */}
      <Card
        variant="glass"
        className={cn(
          "flex-1 p-6 md:p-8 transition-all duration-700 border rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative group",
          isComplete ? "bg-white/60 border-emerald-100 shadow-xl opacity-90" :
            isActive ? "bg-white border-primary/20 shadow-2xl ring-1 ring-primary/5 -translate-y-1" :
              "bg-slate-50/40 border-slate-100 opacity-60 grayscale-[0.3]"
        )}
      >
        {/* Decorative Background Elements */}
        {isActive && (
          <div className="absolute top-0 right-0 w-30 h-30 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10" />
        )}

        <div className="flex items-center gap-4 flex-1 w-full md:w-auto">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 shadow-lg",
            isComplete ? "bg-emerald-50 text-emerald-500 rotate-0" :
              isActive ? "bg-slate-900 text-white rotate-3 group-hover:rotate-0" :
                "bg-slate-100 text-slate-400"
          )}>
            <Icon size={20} />
          </div>

          <div className="text-center md:text-left flex-1">
            <div className="flex items-center  mb-2 justify-center md:justify-start">
              <h3 className={cn(
                "font-black text-xl md:text-2xl font-display tracking-tight leading-none",
                isComplete ? "text-slate-900" : isActive ? "text-slate-900" : "text-slate-400"
              )}>
                {title}
              </h3>
              {isActive && (
                <span className="px-3 py-0.5 bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest rounded-full">Current Focus</span>
              )}
            </div>
            <p className={cn(
              "text-xs md:text-sm font-medium leading-relaxed max-w-lg",
              isComplete ? "text-slate-500" : isActive ? "text-slate-600" : "text-slate-400"
            )}>
              {description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 mt-1 md:mt-0 border-slate-100">
          <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2">
            <Clock size={10} className="text-slate-400" />
            {time}
          </div>

          <AnimatePresence mode="wait">
            {isActive ? (
              <motion.button
                key="active-btn"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onComplete}
                className="px-6 py-2 bg-primary text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/10 transition-all mt-2"
              >
                {t('mark_complete')}
              </motion.button>
            ) : isComplete ? (
              <motion.div
                key="complete-badge"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100"
              >
                <Check size={12} strokeWidth={3} />
                <span className="text-[9px] font-black uppercase tracking-widest">Done</span>
              </motion.div>
            ) : (
              <div key="pending-badge" className="px-4 py-2 bg-slate-100 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest">
                Locked
              </div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
};
