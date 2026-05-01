"use client";
import * as React from "react";
import { 
  Compass, 
  MessageSquare, 
  CheckCircle2, 
  FileText, 
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Accessibility,
  Mic
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { QuickAction } from "./QuickAction";
import { useAppStore } from "@/store/useAppStore";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { DashboardSkeleton } from "@/components/ui/DashboardSkeleton";
import { VotingReadinessCard } from "./VotingReadinessCard";
import { ImpactCard } from "./ImpactCard";
import { LegalDisclaimer } from "@/components/ui/LegalDisclaimer";
import { HelpOthersCard } from "@/features/share/HelpOthersCard";
import { ElectionTimeline } from "@/features/timeline/ElectionTimeline";
import { MockBallot } from "@/features/ballot/MockBallot";
import { CandidateMatchSimulation } from "@/features/candidate-match/CandidateMatchSimulation";
import { HeatmapCard } from "@/features/results/HeatmapCard";
import { DiscussionSnapshot } from "@/features/community/DiscussionSnapshot";
import { SpeakerButton } from "@/components/ui/SpeakerButton";
import { SignLanguageGuide } from "@/components/ui/SignLanguageGuide";
import { ElectionQuest } from "@/features/gamification/quest/ElectionQuest";
import { ShareCard } from "@/features/gamification/share/ShareCard";
import { StickerGallery } from "@/features/gamification/stickers/StickerGallery";
import { BadgeUnlockOverlay } from "@/features/gamification/BadgeUnlockOverlay";
import { NeighbourhoodLeaderboard } from "@/features/gamification/leaderboard/NeighbourhoodLeaderboard";
import { StateStickers } from "@/features/gamification/stickers/StateStickers";
import { MiniQuiz } from "@/features/gamification/quiz/MiniQuiz";
import { GamificationFeedback } from "@/features/gamification/GamificationFeedback";
import { VotingDayMode } from "@/features/voting-day/VotingDayMode";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring", 
      stiffness: 150, 
      damping: 20 
    } 
  }
};

import { useVoiceGuidance } from "@/hooks/useVoiceGuidance";

export const DashboardScreen: React.FC = () => {
  const { 
    progress, 
    voterType, 
    isSimpleMode, 
    isHighContrast,
    toggleHighContrast,
    getMissingSteps 
  } = useAppStore();
  const { speak } = useVoiceGuidance();
  const missingSteps = getMissingSteps();
  const t = useTranslations('dashboard');
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (isSimpleMode) {
        speak(`Welcome to your Dashboard. Your voting readiness is ${progress} percent. ${missingSteps.length > 0 ? 'You have ' + missingSteps.length + ' tasks to complete.' : 'You are all set to vote!'}`);
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [isSimpleMode, progress, missingSteps.length, speak]);

  if (isLoading) return <div className="px-6 md:px-16 lg:px-24 xl:px-32"><DashboardSkeleton /></div>;

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-16 pb-32 px-6 md:px-16 lg:px-24 xl:px-32 relative"
    >
      <SignLanguageGuide type="voting" className="absolute top-0 right-0" />
      <VotingDayMode />
      <BadgeUnlockOverlay />
      <GamificationFeedback />
      <motion.div variants={item}>
        <VotingReadinessCard />
      </motion.div>

      <motion.div variants={item}>
        <ImpactCard />
      </motion.div>
      
      {/* Accessibility Hub */}
      <motion.div variants={item} className="space-y-6">
        <div className="flex items-center gap-2 px-2">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">Accessibility Hub</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card 
            className={cn(
              "p-6 cursor-pointer transition-all border-2",
              isSimpleMode ? "bg-primary/20 border-primary" : "bg-slate-900/40 border-white/5 hover:border-white/10"
            )}
            onClick={toggleSimpleMode}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-primary">
                <Accessibility size={24} />
              </div>
              <div>
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Simple Mode</p>
                <h4 className="text-white font-bold">{isSimpleMode ? "Enabled" : "Disabled"}</h4>
              </div>
            </div>
          </Card>

          <Card 
            className={cn(
              "p-6 cursor-pointer transition-all border-2",
              isHighContrast ? "bg-yellow-400/20 border-yellow-400" : "bg-slate-900/40 border-white/5 hover:border-white/10"
            )}
            onClick={toggleHighContrast}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-yellow-400">
                <Sparkles size={24} />
              </div>
              <div>
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">High Contrast</p>
                <h4 className="text-white font-bold">{isHighContrast ? "Enabled" : "Disabled"}</h4>
              </div>
            </div>
          </Card>

          <Card 
            className="p-6 cursor-pointer transition-all bg-slate-900/40 border-2 border-white/5 hover:border-white/10"
            onClick={() => {
              const btn = document.getElementById('voice-trigger');
              if (btn) btn.click();
            }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-emerald-400">
                <Mic size={24} />
              </div>
              <div>
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Voice Control</p>
                <h4 className="text-white font-bold">Start Listening</h4>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* High-Frequency Quick Actions */}
      <motion.div 
        variants={item} 
        className={cn(
          "grid gap-6",
          isSimpleMode ? "grid-cols-1 md:grid-cols-2" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        )}
      >
        <Link href="/assistant" className="h-full">
          <QuickAction icon={MessageSquare} label={t('actions.assistant') || "AI Assistant"} color="bg-blue-500/20 text-blue-400" />
        </Link>
        <Link href="/map" className="h-full">
          <QuickAction icon={Compass} label={t('actions.map') || "Booth Map"} color="bg-indigo-500/20 text-indigo-400" />
        </Link>
        <Link href="/documents" className="h-full">
          <QuickAction icon={FileText} label={t('actions.documents') || "Documents"} color="bg-rose-500/20 text-rose-400" />
        </Link>
        <Link href="/journey" className="h-full">
          <QuickAction icon={Sparkles} label={t('actions.journey') || "Journey"} color="bg-purple-500/20 text-purple-400" />
        </Link>
      </motion.div>

      {/* Gamification Quest */}
      <motion.div variants={item}>
        <ElectionQuest />
      </motion.div>

      {/* Share Progress */}
      <motion.div variants={item} id="share-card">
        <ShareCard />
      </motion.div>

      {/* Special Guidance Segment */}
      {voterType === 'first-time' && (
        <motion.div 
          variants={item}
          className="p-10 rounded-[3rem] bg-amber-500/10 border border-amber-500/20 relative overflow-hidden group shadow-3d"
        >
          <div className="absolute -right-8 -top-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <ShieldCheck size={200} className="text-amber-500" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.6)]" />
              <h3 className="text-amber-500 font-black uppercase text-[11px] tracking-[0.3em]">
                First-Timer Elite Guide
              </h3>
            </div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-black text-3xl leading-tight max-w-xl">
                Building the future? <br/><span className="text-amber-500">We&apos;ve built your roadmap.</span>
              </h2>
              <SpeakerButton text="Building the future? We've built your roadmap." className="bg-amber-500/20 text-amber-500 hover:bg-amber-500/30" />
            </div>
            <Link href="/journey" className="inline-flex items-center gap-3 px-8 py-4 bg-amber-500 text-amber-950 font-black text-sm uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-500/20">
              Start Simplified Journey
              <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      )}

      {/* Constituency Insights Shortcut */}
      <motion.div variants={item}>
        <Link href="/insights">
          <Card className="p-10 bg-slate-900/40 backdrop-blur-3xl border-white/5 group relative overflow-hidden" hover={true}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] group-hover:bg-primary/10 transition-all duration-700" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
              <div className="flex items-center gap-8">
                <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary shadow-3d border border-primary/20 group-hover:scale-110 transition-transform duration-500">
                  <Compass size={40} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[11px] font-black uppercase text-emerald-400 tracking-[0.3em]">Area Analytics</p>
                  </div>
                  <h3 className="font-black text-white text-3xl font-display tracking-tight group-hover:text-primary transition-colors">Explore Your Area</h3>
                  <p className="text-slate-500 text-sm font-medium mt-1">Track representative performance, budgets, and active projects.</p>
                </div>
              </div>
              <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white group-hover:rotate-[-45deg] transition-all duration-700 border border-white/5">
                <ArrowRight size={28} />
              </div>
            </div>
          </Card>
        </Link>
      </motion.div>

      {/* Interactive Practice Core */}
      <motion.div variants={item} id="mock-ballot">
        <div className="flex items-end justify-between mb-8 px-2">
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-white font-display">Election Laboratory</h3>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Interactive simulation modules</p>
          </div>
          <Sparkles className="text-primary opacity-20" size={32} />
        </div>
        <MockBallot />
      </motion.div>

      {/* Candidate Match Simulation */}
      <motion.div variants={item}>
        <CandidateMatchSimulation />
      </motion.div>

      {/* Smart Suggestions Engine */}
      <motion.div variants={item}>
        <div className="flex items-center gap-3 mb-6 px-2">
          <Sparkles className="text-emerald-500 animate-pulse" size={20} />
          <h3 className="text-xl font-black text-white font-display uppercase tracking-wider">Smart Suggestions</h3>
        </div>
        <Link href={missingSteps[0]?.link || "/journey"}>
          <Card className="flex items-center justify-between py-10 px-10 bg-slate-900/40 backdrop-blur-2xl border-white/5 group overflow-hidden" hover={true}>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <div className="flex items-center gap-8 relative z-10">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-[1.5rem] flex items-center justify-center text-emerald-500 shadow-3d border border-emerald-500/20 group-hover:scale-110 transition-transform duration-500">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase text-emerald-500 tracking-[0.3em] mb-2">Priority Task</p>
                <h3 className="font-black text-white text-2xl font-display tracking-tight group-hover:text-emerald-400 transition-colors">
                  {missingSteps[0]?.label || "System Optimized: You are Ready!"}
                </h3>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Impact: +25% Readiness Boost</p>
              </div>
            </div>
            <div className="w-14 h-14 rounded-full bg-slate-800/50 text-slate-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white group-hover:scale-110 group-hover:rotate-[-45deg] transition-all duration-500 shadow-3d relative z-10">
              <ArrowRight size={24} />
            </div>
          </Card>
        </Link>
      </motion.div>

      {/* Live Data Visuals */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="px-2">
            <h3 className="text-xl font-black text-white font-display uppercase tracking-wider">National Trends</h3>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Live Turnout Intelligence</p>
          </div>
          <HeatmapCard />
        </div>
        <DiscussionSnapshot />
      </motion.div>

      {/* Event Horizon */}
      <motion.div variants={item}>
        <div className="mb-8 px-2">
          <h3 className="text-xl font-black text-white font-display uppercase tracking-wider">Event Horizon</h3>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Election Timeline & Deadlines</p>
        </div>
        <ElectionTimeline />
      </motion.div>


      {/* Achievement Stickers */}
      <motion.div variants={item}>
        <StickerGallery />
      </motion.div>

      {/* Local Leaderboard Simulation */}
      <motion.div variants={item}>
        <NeighbourhoodLeaderboard />
      </motion.div>

      {/* Gamification Grid (Quiz & Stickers) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.div variants={item}>
          <MiniQuiz />
        </motion.div>
        <motion.div variants={item}>
          <StateStickers />
        </motion.div>
      </div>

      <motion.div variants={item}>
        <HelpOthersCard />
      </motion.div>

      <motion.div variants={item} className="pb-10 opacity-60">
        <LegalDisclaimer />
      </motion.div>
    </motion.div>
  );
};
