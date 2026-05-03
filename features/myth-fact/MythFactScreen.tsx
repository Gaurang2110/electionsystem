"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { ChevronDown, AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";
import { cn } from "@/utils/cn";

interface MythFactItemProps {
  myth: string;
  fact: string;
  mythLabel: string;
  factLabel: string;
  index: number;
}

const MythFactItem: React.FC<MythFactItemProps> = ({ myth, fact, mythLabel, factLabel, index }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full text-left p-6 rounded-[2rem] transition-all duration-500 border",
          isExpanded 
            ? "bg-slate-900 border-primary/20 shadow-2xl" 
            : "bg-slate-900/40 border-white/5 hover:bg-slate-900/60"
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-4">
            <div className={cn(
              "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border transition-colors",
              isExpanded ? "bg-rose-500/20 border-rose-500/30 text-rose-500" : "bg-slate-800 border-white/5 text-slate-400"
            )}>
              <AlertCircle size={20} />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500/80">
                {mythLabel}
              </span>
              <h3 className="text-lg font-bold text-white leading-tight">
                {myth}
              </h3>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 shrink-0"
          >
            <ChevronDown size={18} />
          </motion.div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
              className="overflow-hidden"
            >
              <div className="pt-6 mt-6 border-t border-white/5">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-500">
                    <CheckCircle2 size={20} />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/80">
                      {factLabel}
                    </span>
                    <p className="text-slate-300 leading-relaxed font-medium">
                      {fact}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  );
};

export const MythFactScreen: React.FC = () => {
  const t = useTranslations('myth_fact');
  
  const items = [
    { myth: t('items.item1.myth'), fact: t('items.item1.fact') },
    { myth: t('items.item2.myth'), fact: t('items.item2.fact') },
    { myth: t('items.item3.myth'), fact: t('items.item3.fact') },
  ];

  return (
    <div className="min-h-screen pb-32">
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 pt-12">
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 rounded-[2rem] bg-primary/20 flex items-center justify-center text-primary mb-6 shadow-2xl shadow-primary/20"
          >
            <ShieldCheck size={32} />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-white font-display mb-4"
          >
            {t('title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg max-w-2xl font-medium"
          >
            {t('subtitle')}
          </motion.p>
        </header>

        <div className="grid gap-4 max-w-3xl">
          {items.map((item, idx) => (
            <MythFactItem
              key={idx}
              index={idx}
              myth={item.myth}
              fact={item.fact}
              mythLabel={t('myth_label')}
              factLabel={t('fact_label')}
            />
          ))}
        </div>

        {/* Safety Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 relative overflow-hidden group"
        >
          <div className="relative z-10">
            <h4 className="text-white font-bold text-lg mb-2">{t('verify_title')}</h4>
            <p className="text-slate-400 text-sm leading-relaxed max-w-lg">
              {t('verify_desc')}
            </p>
          </div>
          <div className="absolute right-0 bottom-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShieldCheck size={120} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};
