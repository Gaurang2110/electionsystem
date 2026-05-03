"use client";
import * as React from "react";
import { motion } from "framer-motion";
import {
  Compass,
  Map as MapIcon,
  HelpCircle,
  ShieldCheck,
  FileText,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Zap,
  TrendingUp,
  Award,
  Globe,
  Clock
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useAppStore } from "@/store/useAppStore";
import { Link } from "@/i18n/navigation";
import { ElectionQuest } from "@/features/gamification/quest/ElectionQuest";
import { NeighbourhoodLeaderboard } from "@/features/gamification/leaderboard/NeighbourhoodLeaderboard";
import { AchievementsWidget } from "@/features/gamification/achievements/AchievementsWidget";
import { StickerGallery } from "@/features/gamification/stickers/StickerGallery";
import { HeatmapCard } from "@/features/results/HeatmapCard";
import { LegalDisclaimer } from "@/components/ui/LegalDisclaimer";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20
    }
  }
} as const;

import { Gauge } from "@/components/ui/Gauge";

export const DashboardScreen: React.FC = () => {
  const t = useTranslations('dashboard');
  const { profile, progress, notifications, getNextBestAction, getUserInsights } = useAppStore();
  const nextBestAction = getNextBestAction();
  const insights = getUserInsights();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-6 pb-20 relative"
    >
      {/* Background Decoration from Stitch */}
      <div className="absolute -top-40 right-0  pointer-events-none opacity-30 -z-10 overflow-hidden select-none">
        <img
          src="/eligibity_header.png"
          alt="Parliament Decoration"
          className="w-full h-full object-cover object-right-top"
          style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 80%)' }}
        />
      </div>

      {/* GREETING SECTION */}
      <motion.div variants={itemVariants} className="mb-2">
        <h2 className="text-3xl font-black text-slate-900 font-display flex items-center gap-3">
          Namaste, {!mounted ? "Aarav" : (profile.name || "Aarav")}! <span className="text-2xl animate-bounce">👋</span>
        </h2>
        <p className="text-slate-500 text-sm font-medium mt-1">
          Let's make every vote count. You are <span className="text-primary font-black">{!mounted ? 0 : progress}%</span> of the way to be a <span className="text-primary font-black uppercase tracking-tighter">Ready Citizen!</span>
        </p>
      </motion.div>

      {/* TWO COLUMN GRID LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">

        {/* LEFT COLUMN: MAIN CONTENT (SPAN 8) */}
        <div className="xl:col-span-8 space-y-8">

          {/* HERO ROW */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Readiness Card */}
            <motion.div variants={itemVariants}>
              <Card variant="premium" className="p-8 h-full bg-[#0F172A] relative overflow-hidden group">
                <div className="absolute -right-20 -top-20 w-60 h-60 bg-primary/20 rounded-full blur-[80px]" />
                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-saffron/10 rounded-full blur-[60px]" />

                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 relative z-10">Your Voting Readiness</h3>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-8 relative z-10">
                  <div className="flex-shrink-0">
                    <Gauge value={progress} size={140} strokeWidth={12} subLabel="Almost There!" />
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-slate-400 font-medium mb-1">Keep going!</p>
                    <p className="text-sm font-black text-white mb-4">You're doing great.</p>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-secondary border border-secondary/20 rounded-lg text-[10px] font-black uppercase tracking-widest">
                      <CheckCircle2 size={12} />
                      <span>High Readiness</span>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                  className="w-full mt-8 py-3 bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all"
                >
                  View Full Report
                </motion.button>
              </Card>
            </motion.div>

            {/* Next Step Card - Dynamic */}
            <motion.div variants={itemVariants}>
              <Card variant="glass" className="p-8 h-full bg-white/60 border-white/40 shadow-premium flex flex-col justify-between group">
                <div>
                  <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest mb-6">
                    <Sparkles size={14} className="animate-pulse" />
                    <span>Next Step for You</span>
                  </div>

                  <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-100/50 flex items-center gap-5">
                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-3xl group-hover:rotate-3 transition-transform">
                      {!mounted ? '📋' : (
                        nextBestAction.id === 'eligibility' ? '📋' :
                          nextBestAction.id === 'registration' ? '📝' :
                            nextBestAction.id === 'locate' ? '🗺️' :
                              nextBestAction.id === 'documents' ? '📂' :
                                nextBestAction.id === 'quiz' ? '🧠' : '✅'
                      )}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-base leading-tight">
                        {!mounted ? 'Check Eligibility' : nextBestAction.label}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        Impact: <span className="text-secondary font-black">{!mounted ? '+20%' : nextBestAction.impact}</span> on your readiness
                      </p>
                    </div>
                  </div>

                  {/* Why this step? - Transparency Logic */}
                  <div className="mt-4 px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
                    <div className="mt-0.5 p-1 bg-white rounded-md shadow-sm">
                      <HelpCircle size={10} className="text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Why this step?</p>
                      <p className="text-[10px] font-bold text-slate-600 leading-tight">
                        {mounted ? (
                          nextBestAction.id === 'eligibility' ? "You haven't verified your voting eligibility yet." :
                          nextBestAction.id === 'registration' ? "Your registration status is pending in your profile." :
                          nextBestAction.id === 'locate' ? "You haven't identified your polling station yet." :
                          nextBestAction.id === 'documents' ? "You have pending items in your document checklist." :
                          nextBestAction.id === 'ballot' ? "You haven't practiced the voting process on a mock ballot." :
                          nextBestAction.id === 'quiz' ? "Testing your knowledge helps ensure a smooth voting day." :
                          nextBestAction.id === 'laboratory' ? "Technical familiarity with EVM machines builds confidence." :
                          nextBestAction.id === 'ready' ? "Congratulations! You have completed all essential readiness milestones." :
                          "This step will help you reach 100% voting readiness."
                        ) : "Identifying your current missing requirements."}
                      </p>
                    </div>
                  </div>
                </div>

                <Link href={!mounted ? '/eligibility' : nextBestAction.link} className="w-full mt-6">
                  <button className="w-full py-3.5 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group">
                    <span>{!mounted ? 'Check Eligibility' : (nextBestAction.id === 'ready' ? 'View Journey' : nextBestAction.label)}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </Card>
            </motion.div>
          </div>

          {/* USER INSIGHTS ROW (Minimal Addition) */}
          <motion.div variants={itemVariants}>
            <Card variant="glass" className="p-6 bg-white/40 border-white/40 shadow-sm flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">User Insights</h4>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-400 uppercase font-bold">Actions</span>
                      <span className="text-sm font-black text-slate-900">{insights.totalActions}</span>
                    </div>
                    <div className="w-px h-6 bg-slate-200" />
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-400 uppercase font-bold">Engagement</span>
                      <span className={cn(
                        "text-sm font-black uppercase tracking-tight",
                        insights.engagement === 'High' ? "text-emerald-500" : 
                        insights.engagement === 'Medium' ? "text-amber-500" : "text-slate-500"
                      )}>{insights.engagement}</span>
                    </div>
                    <div className="w-px h-6 bg-slate-200" />
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-400 uppercase font-bold">Most Used</span>
                      <span className="text-sm font-black text-indigo-600">{insights.mostUsed}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="px-3 py-1 bg-primary/10 rounded-full">
                  <p className="text-[8px] font-black text-primary uppercase tracking-widest">Intelligence Live</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* MISSION CONTROL (QUICK ACTIONS) */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] px-2">Mission Control</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { id: "map", label: "Booth Map", icon: MapIcon, color: "text-emerald-500 bg-emerald-50 border-emerald-100", desc: "Find area" },
                { id: "docs", label: "Documents", icon: FileText, color: "text-orange-500 bg-orange-50 border-orange-100", desc: "Verify docs" },
                { id: "assistant", label: "AI Assistant", icon: HelpCircle, color: "text-indigo-500 bg-indigo-50 border-indigo-100", desc: "Ask anything" },
                { id: "journey", label: "Journey", icon: Sparkles, color: "text-purple-500 bg-purple-50 border-purple-100", desc: "Track path" },
              ].map((action) => (
                <Link key={action.id} href={`/${action.id}`}>
                  <motion.div
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="glass-card bg-white/80 p-5 rounded-2xl border-white/50 shadow-sm flex flex-col items-center text-center gap-3 group transition-all"
                  >
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 group-hover:rotate-6", action.color)}>
                      <action.icon size={20} />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{action.label}</h4>
                      <p className="text-[8px] text-slate-500 font-bold mt-1 opacity-0 group-hover:opacity-100 transition-opacity">{action.desc}</p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* ELECTION QUEST TRACKER */}
          <motion.div variants={itemVariants}>
            <ElectionQuest />
          </motion.div>

          {/* HEATMAP/RESULTS PREVIEW */}
          {/* <motion.div variants={itemVariants}>
            <HeatmapCard />
          </motion.div> */}
        </div>

        {/* RIGHT COLUMN: WIDGETS (SPAN 4) */}
        <div className="xl:col-span-4 space-y-8">
          {/* LEADERBOARD WIDGET */}
          <motion.div variants={itemVariants}>
            <NeighbourhoodLeaderboard />
          </motion.div>

          {/* ELECTION INSIGHTS WIDGET */}
          <motion.div variants={itemVariants}>
            <Card variant="glass" className="p-6 bg-white/80 border-white/50 shadow-premium">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest">{t('insights.title')}</h3>
                <TrendingUp size={16} className="text-slate-400" />
              </div>

              <div className="space-y-6">
                {/* Promise Match */}
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('insights.promises')}</span>
                    <span className="text-secondary font-black text-xs">64%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '64%' }}
                      className="h-full bg-secondary"
                    />
                  </div>
                </div>

                {/* Transparency */}
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('insights.transparency')}</span>
                    <span className="text-primary font-black text-xs">82%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '82%' }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10 group cursor-pointer hover:bg-primary/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        <Zap size={18} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{t('insights.active_issues')}</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">{t('insights.reported_today', { count: 12 })}</p>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* DISCLAIMER */}
          <motion.div variants={itemVariants}>
            <LegalDisclaimer />
          </motion.div>

        </div>
      </div>

      {/* FULL WIDTH ACHIEVEMENTS SECTION */}
      <motion.div variants={itemVariants} className="w-full">
        <AchievementsWidget />
      </motion.div>
    </motion.div>
  );
};
