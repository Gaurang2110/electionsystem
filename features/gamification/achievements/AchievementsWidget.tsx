"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { badges, getBadgeById } from "@/lib/gamificationService";
import { Card } from "@/components/ui/Card";
import { cn } from "@/utils/cn";
import {
  Trophy, Lock, Star, Award, Info, ArrowRight, Sparkles, Zap,
  CheckCircle2, FileText, MapPin as MapIcon,
  ShieldCheck, MapPin, BookOpen, Share2, Search, CheckSquare, Users
} from "lucide-react";
import { Link } from "@/i18n/navigation";

const BadgeIcon = ({ id, size, className }: { id: string; size: number; className?: string }) => {
  switch (id) {
    case 'badge_registered': return <ShieldCheck size={size} className={className} />;
    case 'badge_booth_explorer': return <MapPin size={size} className={className} />;
    case 'badge_informed_voter': return <BookOpen size={size} className={className} />;
    case 'badge_ready_citizen': return <Zap size={size} className={className} />;
    case 'badge_community_sharer': return <Share2 size={size} className={className} />;
    case 'badge_aware_citizen': return <Search size={size} className={className} />;
    case 'badge_voted': return <CheckSquare size={size} className={className} />;
    case 'badge_community_helper': return <Users size={size} className={className} />;
    default: return <Award size={size} className={className} />;
  }
};

export const AchievementsWidget: React.FC = () => {
  const { gamification, getNextBestAction } = useAppStore();
  const nextBestAction = getNextBestAction();
  const unlockedBadgeIds = gamification.badges;
  const [selectedBadgeId, setSelectedBadgeId] = React.useState<string | null>(unlockedBadgeIds[0] || (badges.length > 0 ? badges[0].id : null));

  const selectedBadge = badges.find(b => b.id === selectedBadgeId) || badges[0];
  const isSelectedUnlocked = unlockedBadgeIds.includes(selectedBadge.id);

  if (!selectedBadgeId) return null;

  return (
    <div className="w-full">
      {/* MAIN CONTENT GRID - Full Width 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch w-full">

        {/* LEFT SECTION: COLLECTION HUB */}
        <div className="flex flex-col">
          <Card variant="glass" className="flex-1 bg-white border-white p-6 md:p-8 flex flex-col shadow-premium rounded-[2.5rem] relative overflow-hidden min-h-[500px]">
            <div className="flex items-center justify-between mb-8 relative">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <Trophy className="text-white" size={16} />
                </div>
                <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">Badge Collection</h4>
              </div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
                {unlockedBadgeIds.length} / {badges.length} EARNED
              </div>
            </div>

            {/* COMPACT BADGE GRID */}
            <div className="flex-1 flex items-center justify-center relative mb-8">
              <div className="grid grid-cols-4 gap-6 md:gap-8">
                {badges.map((badge) => {
                  const isUnlocked = unlockedBadgeIds.includes(badge.id);
                  const isSelected = selectedBadgeId === badge.id;

                  return (
                    <motion.div
                      key={badge.id}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedBadgeId(badge.id)}
                      className="relative cursor-pointer group flex flex-col items-center gap-2"
                    >
                      <div className={cn(
                        "w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-all duration-500 border relative",
                        isSelected ? "bg-slate-900 border-slate-900 shadow-xl" : (isUnlocked ? "bg-white border-slate-100 shadow-md" : "bg-slate-50 border-slate-100/50 opacity-40")
                      )}>
                        <BadgeIcon id={badge.id} size={isSelected ? 24 : 20} className={cn(
                          "transition-colors duration-500",
                          isSelected ? "text-amber-400" : (isUnlocked ? "text-slate-600" : "text-slate-300")
                        )} />

                        {isUnlocked && !isSelected && (
                          <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                            <CheckCircle2 size={8} className="text-white" />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* COMPACT PROMPT & ACTIONS */}
            <div className="space-y-4 pt-6 border-t border-slate-50">
              <div className="bg-indigo-50/50 px-5 py-4 rounded-2xl border border-indigo-100 flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <Star className="text-white fill-white" size={14} />
                </div>
                <p className="text-[10px] font-black text-indigo-900 uppercase tracking-widest leading-none">Complete steps to unlock rewards</p>
              </div>

              <Link href="/profile" className="flex items-center justify-center gap-3 w-full py-4 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl transition-all group">
                <span className="text-slate-900 font-black text-[10px] uppercase tracking-[0.2em]">View Detailed Rewards</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-slate-400" />
              </Link>
            </div>
          </Card>
        </div>

        <div className="flex flex-col">
          <Card variant="glass" className="flex-1 bg-white border-white p-0 rounded-[2.5rem] shadow-premium relative overflow-hidden flex flex-col items-center justify-center h-full min-h-[400px]">
            {/* COMPACT INFO AREA - Centered Horizontally & Vertically */}
            <div className="w-full p-8 md:p-12 flex flex-col items-center text-center justify-center relative">
              <div className="mb-6 relative">
                <div className={cn(
                  "px-3 py-1 bg-white border border-slate-100 rounded-full flex items-center gap-2 shadow-sm mb-6 mx-auto w-fit",
                  isSelectedUnlocked ? "border-emerald-100" : ""
                )}>
                  <div className={cn("w-1.5 h-1.5 rounded-full", isSelectedUnlocked ? "bg-emerald-500" : "bg-amber-500 animate-pulse")} />
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                    {isSelectedUnlocked ? "Earned" : "In Progress"}
                  </span>
                </div>

                <motion.div
                  key={selectedBadge.id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={cn(
                    "w-32 h-32 md:w-36 md:h-36 rounded-[2.5rem] flex items-center justify-center shadow-2xl border-4 border-white bg-white ring-1 ring-slate-100 transition-all duration-700",
                    isSelectedUnlocked ? "shadow-emerald-500/10" : "grayscale-[0.4]"
                  )}
                >
                  <BadgeIcon id={selectedBadge.id} size={isSelectedUnlocked ? 64 : 56} className={isSelectedUnlocked ? "text-slate-900" : "text-slate-400"} />
                </motion.div>
              </div>

              <div className="space-y-2 mb-8">
                <h4 className="text-2xl md:text-3xl font-black text-slate-900 font-display tracking-tight leading-none uppercase">
                  {selectedBadge.label}
                </h4>
                <div className="px-4 py-1.5 bg-slate-50 rounded-full inline-block">
                  <p className={cn(
                    "text-[9px] font-black uppercase tracking-[0.2em]",
                    isSelectedUnlocked ? "text-emerald-600" : "text-slate-400"
                  )}>
                    {isSelectedUnlocked ? "Badge Unlocked" : "Start journey to unlock"}
                  </p>
                </div>
              </div>

              <div className="w-full space-y-6 pt-6 border-t border-slate-50">
                <p className="text-[12px] text-slate-500 font-medium leading-relaxed italic max-w-[240px] mx-auto">
                  "{selectedBadge.description}"
                </p>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "w-full max-w-[220px] py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl transition-all flex items-center justify-center gap-3 mx-auto",
                    isSelectedUnlocked
                      ? "bg-slate-900 text-white hover:bg-slate-800"
                      : "bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/20"
                  )}
                >
                  <span>{isSelectedUnlocked ? "Share Achievement" : "How to Unlock"}</span>
                  <Sparkles size={14} fill="currentColor" />
                </motion.button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* COMPACT FLOATING ACTION BANNER */}
      {/* <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-[360px] px-6">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <Link href={nextBestAction.link} className="block group">
            <div className="bg-slate-900 p-4 rounded-2xl shadow-2xl border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                  {nextBestAction.id === 'eligibility' ? <Zap size={16} fill="currentColor" /> :
                    nextBestAction.id === 'registration' ? <FileText size={16} /> :
                      nextBestAction.id === 'locate' ? <MapIcon size={16} /> :
                        <Sparkles size={16} />}
                </div>
                <div>
                  <p className="text-[8px] font-black text-primary uppercase tracking-[0.2em] mb-0.5">Recommended</p>
                  <h5 className="text-sm font-black text-white uppercase tracking-tight leading-none">{nextBestAction.label}</h5>
                </div>
              </div>
              <ArrowRight size={16} className="text-white group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </motion.div>
      </div> */}
    </div>
  );
};
