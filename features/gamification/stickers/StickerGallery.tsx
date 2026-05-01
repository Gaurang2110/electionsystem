"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { badges, getBadgeById } from "@/lib/gamificationService";
import { Card } from "@/components/ui/Card";
import { cn } from "@/utils/cn";
import { Trophy, Lock, Star } from "lucide-react";

export const StickerGallery: React.FC = () => {
  const { gamification } = useAppStore();
  const unlockedBadges = gamification.badges;

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between px-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Trophy className="text-amber-500" size={20} />
            <h3 className="text-2xl font-black text-white font-display uppercase tracking-tight">Your Achievements</h3>
          </div>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Unlock badges by participating in the democratic process</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 border border-white/5 rounded-2xl">
          <Star className="text-amber-500 fill-amber-500" size={14} />
          <span className="text-white font-black text-sm">{gamification.points}</span>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Pts</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {badges.map((badge) => {
          const isUnlocked = unlockedBadges.includes(badge.id);
          return (
            <motion.div
              key={badge.id}
              whileHover={isUnlocked ? { y: -8, scale: 1.05 } : {}}
              className="relative"
            >
              <Card className={cn(
                "h-full p-6 flex flex-col items-center text-center gap-4 transition-all duration-500 rounded-[2rem] border-white/5",
                isUnlocked 
                  ? "bg-slate-900 shadow-xl shadow-amber-500/5 border-amber-500/20" 
                  : "bg-slate-950/40 grayscale opacity-40"
              )}>
                <div className={cn(
                  "w-16 h-16 rounded-3xl flex items-center justify-center text-4xl shadow-3d",
                  isUnlocked ? "bg-amber-500/10 border border-amber-500/20" : "bg-slate-900"
                )}>
                  {isUnlocked ? badge.icon : <Lock size={24} className="text-slate-700" />}
                </div>
                <div className="space-y-1">
                  <h4 className={cn(
                    "text-[11px] font-black uppercase tracking-widest",
                    isUnlocked ? "text-white" : "text-slate-600"
                  )}>
                    {badge.label}
                  </h4>
                  <p className="text-[9px] text-slate-500 font-bold leading-tight line-clamp-2">
                    {badge.description}
                  </p>
                </div>
                
                {isUnlocked && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-[10px] font-black text-slate-900 shadow-lg border-2 border-slate-950"
                  >
                    +{badge.points}
                  </motion.div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
