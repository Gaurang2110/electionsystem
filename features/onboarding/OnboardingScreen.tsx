"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/store/useAppStore";
import { ShieldCheck, Vote, Globe, UserCheck, Star, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/utils/cn";

export const OnboardingScreen: React.FC = () => {
  const { setOnboarded, setVoterType, voterType } = useAppStore();
  const t = useTranslations('onboarding');
  const [step, setStep] = React.useState<'welcome' | 'selection'>('welcome');
  const [selectedType, setSelectedType] = React.useState<'first-time' | 'regular' | null>(null);

  const handleComplete = () => {
    if (selectedType) {
      setVoterType(selectedType);
      setOnboarded(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0B0E14] z-[100] flex flex-col p-8 md:p-16 overflow-hidden">
      <AnimatePresence mode="wait">
        {step === 'welcome' ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col justify-center gap-12 max-w-2xl mx-auto w-full"
          >
            <div className="relative">
              <div className="w-24 h-24 bg-primary rounded-[2rem] flex items-center justify-center shadow-2xl shadow-primary/20 mb-8">
                <Vote size={48} className="text-white" />
              </div>
              <h1 className="text-5xl font-black text-white leading-[1.1] font-display">
                {t('title_part1')} <br />
                <span className="text-primary">{t('title_part2')}</span>
              </h1>
              <p className="text-xl text-slate-400 mt-6 font-medium max-w-[320px]">
                {t('subtitle')}
              </p>
            </div>

            <div className="grid gap-6">
              {[
                { icon: Globe, key: "multilingual" },
                { icon: ShieldCheck, key: "verified" },
              ].map((item, i) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/40 border border-white/5"
                >
                  <div className="p-3 bg-slate-800 rounded-2xl text-primary">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{t(`features.${item.key}.title`)}</h3>
                    <p className="text-sm text-slate-400 font-medium">{t(`features.${item.key}.desc`)}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8"
            >
              <Button size="lg" className="w-full h-16 text-lg" onClick={() => setStep('selection')}>
                {t('cta')}
                <ArrowRight className="ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="selection"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col justify-center gap-10 max-w-2xl mx-auto w-full"
          >
            <div>
              <h2 className="text-3xl font-black text-white mb-3 font-display">
                {t('voter_selection.title')}
              </h2>
              <p className="text-slate-400 font-medium">
                {t('voter_selection.subtitle')}
              </p>
            </div>

            <div className="grid gap-4">
              <button
                onClick={() => setSelectedType('first-time')}
                className={cn(
                  "p-6 rounded-[2rem] border transition-all text-left group relative overflow-hidden",
                  selectedType === 'first-time' 
                    ? "bg-primary/20 border-primary shadow-2xl shadow-primary/10" 
                    : "bg-slate-900/40 border-white/5 hover:bg-slate-900/60"
                )}
              >
                <div className="flex items-start gap-5 relative z-10">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors",
                    selectedType === 'first-time' ? "bg-primary text-white" : "bg-slate-800 text-slate-400 group-hover:text-primary"
                  )}>
                    <Star size={28} />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-xl mb-1">{t('voter_selection.yes_title')}</h3>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed">{t('voter_selection.yes_desc')}</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setSelectedType('regular')}
                className={cn(
                  "p-6 rounded-[2rem] border transition-all text-left group relative overflow-hidden",
                  selectedType === 'regular' 
                    ? "bg-emerald-500/20 border-emerald-500 shadow-2xl shadow-emerald-500/10" 
                    : "bg-slate-900/40 border-white/5 hover:bg-slate-900/60"
                )}
              >
                <div className="flex items-start gap-5 relative z-10">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors",
                    selectedType === 'regular' ? "bg-emerald-500 text-white" : "bg-slate-800 text-slate-400 group-hover:text-emerald-500"
                  )}>
                    <UserCheck size={28} />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-xl mb-1">{t('voter_selection.no_title')}</h3>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed">{t('voter_selection.no_desc')}</p>
                  </div>
                </div>
              </button>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: selectedType ? 1 : 0.5 }}
              className="mt-6"
            >
              <Button 
                size="lg" 
                className="w-full h-16 text-lg" 
                disabled={!selectedType}
                onClick={handleComplete}
              >
                {t('voter_selection.button')}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
