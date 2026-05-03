"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, CheckCircle2, AlertCircle, ArrowRight, Share2, TrendingUp } from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ConfidenceMeter } from "@/components/ui/ConfidenceMeter";
import { Card } from "@/components/ui/Card";
import { useAppStore } from "@/store/useAppStore";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getSystemBrainState, getNextBestAction as computeDecision } from "@/lib/intelligenceEngine";

export const VotingReadinessCard: React.FC = () => {
  const { progress, getNextBestAction, getMissingSteps, completedSteps, engagementScore, readinessCategory, readinessNudge } = useAppStore();
  const t = useTranslations('dashboard');
  
  // Intelligence Overlay
  const brain = getSystemBrainState();
  const deterministicAction = computeDecision(brain);
  
  const nextAction = getNextBestAction();
  const missingSteps = getMissingSteps();

  const categoryColors = {
    Low: "text-rose-400 bg-rose-400/20 border-rose-400/30",
    Medium: "text-amber-400 bg-amber-400/20 border-amber-400/30",
    High: "text-emerald-400 bg-emerald-400/20 border-emerald-400/30"
  };

  return (
    <Card className="premium-gradient text-white border-none shadow-[0_50px_100px_-20px_rgba(79,70,229,0.3)] relative overflow-hidden group p-10 min-h-[320px]">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-1000">
        <Compass size={180} />
      </div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-[100px]" />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-start justify-between mb-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-2xl rounded-3xl flex items-center justify-center border border-white/20 shadow-inner">
              <CheckCircle2 size={32} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-3xl font-black font-display tracking-tight leading-none">{t('readiness')}</h2>
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${categoryColors[readinessCategory]}`}>
                  {readinessCategory}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${readinessCategory === 'High' ? 'bg-emerald-400' : readinessCategory === 'Medium' ? 'bg-amber-400' : 'bg-rose-400'}`} />
                <p className="text-blue-100/70 text-[10px] font-black uppercase tracking-[0.2em]">{t('progress_status', { progress })}</p>
              </div>
            </div>
          </div>
          <div className="text-right bg-black/10 backdrop-blur-md p-4 rounded-[1.5rem] border border-white/5 shadow-inner">
            <div className="flex items-center gap-2 justify-end mb-1">
              <TrendingUp size={12} className="text-emerald-400" />
              <span className="text-[10px] font-black uppercase text-blue-200/50 block">Impact</span>
            </div>
            <span className="text-3xl font-black font-display text-white">{engagementScore}</span>
          </div>
        </div>

        <div className="mb-10">
          <ConfidenceMeter className="mb-8" />
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase text-blue-200/50 mb-1 tracking-widest">Recommended Next Step</p>
              <p className="text-sm font-bold text-white tracking-tight">
                "{deterministicAction || readinessNudge}"
              </p>
            </div>
            <Link 
              href={nextAction.link as any} 
              className="px-6 py-3 bg-white text-primary font-black text-xs uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10 whitespace-nowrap flex items-center gap-2"
            >
              Continue Journey <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 mb-10">
          <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm group/stat hover:bg-white/10 transition-colors">
            <span className="text-[10px] font-black uppercase text-white/40 block mb-2 tracking-widest">Milestones</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white">{completedSteps.length}</span>
              <span className="text-sm font-bold text-white/30">/ 4</span>
            </div>
          </div>
          <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm group/stat hover:bg-white/10 transition-colors">
            <span className="text-[10px] font-black uppercase text-white/40 block mb-2 tracking-widest">Score</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white">{progress}</span>
              <span className={`text-sm font-bold ${categoryColors[readinessCategory].split(' ')[0]}`}>%</span>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-white/10">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
              Next Critical Tasks
            </p>
            <button 
              onClick={() => {
                if (progress >= 80) {
                  document.getElementById('share-card')?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  alert(t('share_threshold_nudge') || "Reach 80% readiness to unlock your official shareable report!");
                }
              }}
              className={`flex items-center gap-2 text-[10px] font-black uppercase px-5 py-2.5 rounded-full transition-all border hover:scale-105 active:scale-95 ${
                progress >= 80 
                  ? "bg-white text-primary border-white shadow-xl shadow-white/20" 
                  : "bg-white/10 text-white/50 border-white/10 opacity-50"
              }`}
            >
              <Share2 size={14} className={progress >= 80 ? "animate-pulse" : ""} />
              {progress >= 80 ? "Share Official Report" : "Unlock Share at 80%"}
            </button>
          </div>
          
                    <div className="flex flex-col gap-3">
            <AnimatePresence mode="popLayout">
              {Array.isArray(missingSteps) && missingSteps.length > 0 ? (
                missingSteps.slice(0, 2).map((step) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group/item cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                        <AlertCircle size={16} />
                      </div>
                      <span className="text-sm font-bold tracking-tight">{step.label}</span>
                    </div>
                    <Link href={step.link as any} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover/item:bg-white group-hover/item:text-primary transition-all">
                      <ArrowRight size={14} />
                    </Link>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-4 p-5 bg-emerald-500/20 rounded-[1.5rem] border border-emerald-500/20 shadow-xl shadow-emerald-500/10"
                >
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <span className="text-sm font-black text-emerald-100 block">System Optimized</span>
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Fully Ready to Vote</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* AI SYSTEM STATUS OVERLAY */}
        <div className="absolute bottom-6 right-6 z-[20] flex flex-col items-end gap-1 opacity-40 hover:opacity-100 transition-opacity duration-500 pointer-events-none sm:pointer-events-auto">
          <div className="flex items-center gap-2 px-2 py-1 bg-black/20 backdrop-blur-md rounded-lg border border-white/10 shadow-2xl">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[7px] font-black uppercase tracking-widest text-emerald-400">AI System Status: Active</span>
          </div>
          <div className="flex flex-col gap-0.5 items-end">
            <span className="text-[6px] font-black uppercase tracking-[0.2em] text-white/40">Readiness: {brain.readiness}%</span>
            <span className="text-[6px] font-black uppercase tracking-[0.2em] text-white/40">Action: {deterministicAction}</span>
            <span className="text-[6px] font-black uppercase tracking-[0.2em] text-white/40">Engagement: {brain.engagementLevel}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
