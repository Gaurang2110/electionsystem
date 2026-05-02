"use client";
import * as React from "react";
import { StepItem } from "@/features/dashboard/StepItem";
import { useAppStore } from "@/store/useAppStore";
import { useTranslations } from "next-intl";
import { motion, useScroll, useSpring } from "framer-motion";
import journeySteps from "@/data/journey.json";
import { ArrowRight, Sparkles, Trophy, Zap, ShieldCheck, Heart } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { ElectionQuest } from "@/features/gamification/quest/ElectionQuest";
import { Card } from "@/components/ui/Card";
import { cn } from "@/utils/cn";

export const JourneySteps: React.FC = () => {
  const { completedSteps, toggleStep, profile, progress, getNextBestAction } = useAppStore();
  const t = useTranslations('journey');
  const router = useRouter();
  const nextAction = getNextBestAction();

  // Determine current active step (first non-completed step)
  const activeStepId = journeySteps.find(s => !completedSteps.includes(s.id))?.id;

  // Animated progress line
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="flex flex-col gap-6 pb-32 max-w-[1200px] mx-auto px-4 md:px-8 ">

      {/* ULTRA-COMPACT PREMIUM HEADER SECTION */}
      <div className="relative w-full rounded-[2.5rem] overflow-hidden bg-[#0A0F1D] shadow-2xl min-h-[180px] flex items-center p-5 md:p-8 border border-white/5">
        {/* User Provided Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/parliment_illustaration.png"
            alt="Parliament Illustration"
            className="w-full h-full object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0F1D] via-[#0A0F1D]/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-xl">
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-3"
          >
            <div className="px-2 py-0.5 bg-primary/20 border border-primary/30 rounded-full text-[8px] font-black text-primary uppercase tracking-[0.2em]">
              Active Journey
            </div>
            <div className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-[8px] font-black text-white/60 uppercase tracking-[0.2em] flex items-center gap-1.5">
              <ShieldCheck size={9} />
              Verified
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-black text-white font-display tracking-tight leading-none"
          >
            Your Voting Journey, <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">{profile.name || "Aarav"}</span>!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 font-medium text-sm mt-3 max-w-sm leading-relaxed"
          >
            Your vote is your power. You are <span className="text-white font-black">{progress}%</span> prepared. <span className="text-primary font-black">Almost there!</span>
          </motion.p>
        </div>



      </div>

      {/* COMPACT NEXT STEP CARD */}
      {nextAction.id !== 'ready' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-[1.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000" />
          <Card
            variant="glass"
            className="relative bg-white border-white p-4 md:p-5 rounded-[1.5rem] flex flex-col md:flex-row items-center justify-between gap-4 overflow-hidden shadow-xl"
          >
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/10 rotate-2 group-hover:rotate-0 transition-transform">
                <Zap size={20} fill="currentColor" />
              </div>
              <div>
                <p className="text-[8px] font-black text-primary uppercase tracking-[0.3em] mb-1 flex items-center gap-2">
                  <Sparkles size={10} fill="currentColor" />
                  Next Step
                </p>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight font-display">{nextAction.label}</h3>
                <p className="text-slate-500 font-medium text-[10px] mt-0.5">Boost readiness by 15%</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(nextAction.link as any)}
              className="w-full md:w-auto px-6 py-2.5 bg-slate-900 text-white font-black text-[9px] uppercase tracking-[0.2em] rounded-lg flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all"
            >
              Start {nextAction.label} <ArrowRight size={12} />
            </motion.button>
          </Card>
        </motion.div>
      )}

      {/* COMPACT TIMELINE SECTION */}
      <div className="relative py-8 space-y-8 px-1 md:px-6">
        {/* Animated Progress Line */}
        <div className="absolute left-[29px] md:left-[53px] top-16 bottom-16 w-0.5 bg-slate-100 rounded-full -z-0 overflow-hidden">
          <motion.div
            style={{ scaleY }}
            className="w-full h-full bg-gradient-to-b from-primary via-accent to-emerald-500 origin-top"
          />
        </div>

        {journeySteps.map((step, index) => {
          const status = completedSteps.includes(step.id) ? "complete" : (step.id === activeStepId ? "active" : "pending");
          return (
            <StepItem
              key={step.id}
              id={step.id}
              index={index}
              title={t(`steps.${step.id}.title`)}
              description={t(`steps.${step.id}.desc`)}
              time={t(`steps.${step.id}.time`)}
              status={status}
              onComplete={() => toggleStep(step.id)}
            />
          );
        })}
      </div>

      {/* BOTTOM ROW: MOTIVATIONAL QUEST & ACHIEVEMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch pt-8">
        <div className="lg:col-span-8 group">
          <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 md:p-5 rounded-2xl mb-5 flex items-center gap-4 transition-all hover:bg-emerald-500/[0.08]">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Heart size={18} fill="currentColor" />
            </div>
            <p className="text-sm font-bold text-emerald-700 italic">"Every vote is a seed of democracy. You are doing a great job!"</p>
          </div>
          <ElectionQuest />
        </div>
        <div className="lg:col-span-4">
          <Card variant="glass" className="h-full bg-white border-white p-6 flex flex-col justify-between shadow-2xl rounded-[2rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10 group-hover:bg-primary/10 transition-colors" />
            <div>
              <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Recent Achievement</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
                    <Trophy size={28} />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900 uppercase tracking-tight leading-none">State Explorer</h4>
                    <p className="text-[10px] text-slate-500 font-bold mt-1.5">Unlocked 5 States</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  You've demonstrated exceptional interest in constituency demographics!
                </p>
              </div>
            </div>
            <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">+25 Points Earned</span>
              </div>
              <motion.button
                whileHover={{ x: 3 }}
                className="flex items-center gap-2 text-[9px] font-black text-primary uppercase tracking-widest"
              >
                Leaderboard <ArrowRight size={12} />
              </motion.button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
