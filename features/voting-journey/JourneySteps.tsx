"use client";
import * as React from "react";
import { StepItem } from "@/features/dashboard/StepItem";
import { useAppStore } from "@/store/useAppStore";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import journeySteps from "@/data/journey.json";
import { systemOrchestrator } from "@/lib/systemOrchestrator";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { useRouter } from "@/i18n/navigation";

export const JourneySteps: React.FC = () => {
  const { completedSteps, toggleStep, voterType, getNextBestAction } = useAppStore();
  const t = useTranslations('journey');
  const router = useRouter();
  const nextAction = getNextBestAction();
  const isFirstTimer = voterType === 'first-time';

  const allCompleted = journeySteps.every(s => completedSteps.includes(s.id));

  const handleMilestoneComplete = () => {
    systemOrchestrator.onStepComplete('register');
    router.push('/'); // Back to dashboard to see next step
  };

  return (
    <div className="flex flex-col gap-10 animate-in slide-in-from-bottom-4 duration-500 pb-32">
      {/* Recommendation Banner */}
      {nextAction.id !== 'ready' && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-2 mt-8 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-2xl" />
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500 shadow-3d">
              <Sparkles size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-emerald-500 tracking-[0.3em] mb-1">Recommended Next Step</p>
              <h3 className="text-white font-black text-xl font-display">{nextAction.label}</h3>
            </div>
          </div>
          <button 
            onClick={() => router.push(nextAction.link as any)}
            className="w-full md:w-auto px-8 py-3 bg-emerald-500 text-emerald-950 font-black text-xs uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            Go Now <ArrowRight size={14} />
          </button>
        </motion.div>
      )}

      <div className="px-2 pt-8">
        <h2 className="text-3xl font-black text-white leading-none font-display mb-3">{t('title')}</h2>
        <p className="text-slate-500 font-medium text-lg">{t('subtitle')}</p>
        {isFirstTimer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 p-5 rounded-[2rem] bg-gradient-to-br from-primary/20 to-transparent border border-primary/30"
          >
            <p className="text-sm font-bold text-slate-200">
              👋 <span className="text-primary font-black uppercase tracking-wider ml-1">First-Timer Mode Active:</span> We&apos;ve added extra tips below to help you navigate your first vote!
            </p>
          </motion.div>
        )}
      </div>

      <div className="relative flex flex-col gap-0">
        {/* Timeline Line */}
        <div className="absolute left-[39px] top-10 bottom-10 w-[2px] bg-gradient-to-b from-primary/30 via-primary/10 to-transparent" />
        
        {journeySteps.map((step, index) => (
          <StepItem
            key={step.id}
            id={step.id}
            index={index}
            title={t(`steps.${step.id}.title`)}
            description={t(`steps.${step.id}.desc`)}
            time={t(`steps.${step.id}.time`)}
            tip={isFirstTimer ? t(`tips.${step.id}`) : undefined}
            status={completedSteps.includes(step.id) ? "complete" : "pending"}
            onComplete={() => toggleStep(step.id)}
          />
        ))}
      </div>

      {allCompleted && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-8 bg-slate-900 border-2 border-primary/30 rounded-[2.5rem] shadow-2xl shadow-primary/10 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl -z-10" />
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30 animate-pulse">
              <Sparkles size={28} />
            </div>
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Milestone Reached!</h3>
              <p className="text-slate-500 text-xs font-black uppercase tracking-widest mt-1">Registration Verified</p>
            </div>
          </div>

          <p className="text-slate-400 text-sm font-bold leading-relaxed mb-8">
            You've successfully verified all registration details. Complete this milestone to earn <span className="text-white">+20 Democracy Points</span> and unlock your first badge.
          </p>

          <button 
            onClick={handleMilestoneComplete}
            className="w-full py-5 bg-white text-slate-900 rounded-3xl text-sm font-black uppercase tracking-[0.1em] flex items-center justify-center gap-3 hover:bg-slate-100 transition-all shadow-xl shadow-white/10"
          >
            Complete Milestone <ArrowRight size={20} />
          </button>
        </motion.div>
      )}
    </div>
  );
};
