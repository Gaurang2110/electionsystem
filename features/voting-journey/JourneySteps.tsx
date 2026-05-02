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

      {/* PREMIUM HERO HEADER SECTION (REFINED LAYOUT) */}
      <div className="relative w-full rounded-[2.5rem] overflow-hidden bg-slate-950  min-h-[160px] flex flex-col md:flex-row items-start md:items-center justify-between p-6 md:p-10 border border-white/10 group">
        {/* Parliament Illustration Background (Right-Aligned, Small) */}
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/3 z-0 pointer-events-none">
          <img
            src="/header_civic_illustration_1777628116893.png"
            alt="Parliament Illustration"
            className="w-full h-full object-contain object-cover object-center opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent" />
        </div>

        <div className="relative z-10 max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-3"
          >
            <div className="px-3 py-0.5 bg-primary/20 border border-primary/30 rounded-full text-[9px] font-black text-primary uppercase tracking-[0.2em] backdrop-blur-md">
              72% Ready
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl md:text-4xl font-black text-white font-display tracking-tight leading-[1.1]"
          >
            Your Voting Journey, <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-indigo-400">
              {profile.name || "Aarav"} 👋
            </span>
          </motion.h1>

          <p className="mt-3 text-slate-400 font-medium text-sm leading-relaxed max-w-sm">
            You are <span className="text-white font-black">72% ready</span> to become a <span className="text-indigo-400 font-black">Responsible Citizen</span>.
          </p>
        </div>

        {/* Continue Button (Right-Aligned) */}
        <div className="relative z-20 mt-20 md:mt-30">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(99,102,241,0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push(nextAction.link as any)}
            className="px-6 py-4 bg-gradient-to-r from-primary to-accent text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-2xl shadow-primary/20 flex items-center gap-3"
          >
            Continue Journey <ArrowRight size={16} />
          </motion.button>
        </div>

        {/* Decorative Floating Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -10, 0],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{ repeat: Infinity, duration: 4 + i, delay: i }}
              className={cn(
                "absolute rounded-full bg-white/10 blur-lg",
                i === 1 ? "top-1/4 left-1/3 w-8 h-8" :
                  "bottom-1/3 left-1/4 w-6 h-6"
              )}
            />
          ))}
        </div>
      </div>

      {/* COMPACT RECOMMENDED STEP BANNER */}
      {nextAction.id !== 'ready' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative group mt-2"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-700 animate-pulse" />
          <Card
            className="relative bg-gradient-to-r from-emerald-600 to-teal-500 border-none p-4 md:p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 overflow-hidden shadow-xl"
          >
            {/* Subtle Background Pattern */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none" />

            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center text-white shadow-lg rotate-2 group-hover:rotate-0 transition-transform duration-300">
                <Sparkles size={24} className="animate-pulse" />
              </div>
              <div className="text-left">
                <p className="text-[8px] font-black text-emerald-100 uppercase tracking-[0.3em] mb-1">Recommended Next Step</p>
                <h3 className="text-xl md:text-2xl font-black text-white tracking-tight leading-none uppercase font-display">
                  {nextAction.label}
                </h3>
                <p className="text-emerald-50 font-medium text-[10px] mt-1 opacity-90">Boost your voter readiness by <span className="font-black text-white">15%</span></p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 8px 20px rgba(0,0,0,0.15)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(nextAction.link as any)}
              className="w-full md:w-auto px-6 py-2.5 bg-white text-emerald-600 font-black text-[9px] uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all mt-4"
            >
              Start Now <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Card>
        </motion.div>
      )}

      {/* MAIN JOURNEY CONTENT WITH SIDE PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-10">

        {/* LEFT: TIMELINE (8 cols) */}
        <div className="lg:col-span-8 relative py-4 space-y-12 px-1 md:px-4">
          {/* Vertical Progress Line (Premium) */}
          <div className="absolute left-[29px] md:left-[53px] top-20 bottom-20 w-[3px] bg-slate-100 rounded-full -z-0 overflow-hidden">
            <motion.div
              style={{ scaleY }}
              className="w-full h-full bg-gradient-to-b from-primary via-accent to-emerald-500 origin-top shadow-[0_0_10px_rgba(99,102,241,0.5)]"
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

        {/* RIGHT: PROGRESS WIDGETS (4 cols) */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">

          {/* Journey Progress Card */}
          <Card variant="glass" className="p-8 rounded-[2.5rem] bg-white border-white shadow-2xl overflow-hidden relative group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />

            <div className="relative z-10 flex flex-col items-center  bg-primary/">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Journey Progress</h3>

              <div className="relative w-52 h-52 flex items-center justify-center mb-6">
                <svg className="w-full h-full transform -rotate-90 ">
                  <circle cx="90" cy="90" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                  <motion.circle
                    cx="90" cy="90" r="80" stroke="url(#journeypurple)" strokeWidth="12" fill="transparent"
                    strokeDasharray={502.4}
                    strokeDashoffset={502.4 - (502.4 * progress) / 100}
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: 502.4 }}
                    animate={{ strokeDashoffset: 502.4 - (502.4 * progress) / 100 }}
                    transition={{ duration: 2 }}
                  />
                  <defs>
                    <linearGradient id="journeypurple" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366F1" />
                      <stop offset="100%" stopColor="#A855F7" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-black text-slate-900 leading-none">{progress}%</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Complete</span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-lg font-black text-slate-900 uppercase tracking-tight">Almost there!</p>
                <p className="text-[11px] text-slate-500 font-medium mt-1">Complete 2 more steps to reach 100%</p>
              </div>
            </div>
          </Card>

          {/* Gamification achievement card moved here for better hierarchy */}
          <Card variant="glass" className="p-8 rounded-[2.5rem] bg-slate-900 border-none text-white shadow-2xl overflow-hidden relative group h-full flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl -z-0" />

            <div className="relative z-10">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Recent Achievement</h3>
              <div className="flex items-center gap-5 mb-6">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-xl rotate-3">
                  <Trophy size={32} className="text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-black uppercase tracking-tight leading-none">State Explorer</h4>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">+25 Points Earned</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-300 font-medium leading-relaxed mb-6">
                You've demonstrated exceptional interest in constituency demographics!
              </p>
            </div>

            <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-colors">
              View Leaderboard
            </button>
          </Card>
        </div>
      </div>

      {/* MINI QUEST BAR (GAMIFICATION) */}
      <div className="mt-8">
        <ElectionQuest />
      </div>
    </div>
  );
};
