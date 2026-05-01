"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { generateMockLeaderboard } from "@/lib/gamificationService";
import { Card } from "@/components/ui/Card";
import { cn } from "@/utils/cn";
import { Users, Crown, Medal, TrendingUp } from "lucide-react";

export const NeighbourhoodLeaderboard: React.FC = () => {
  const { gamification, userName, profile } = useAppStore();
  const [leaderboard, setLeaderboard] = React.useState<any[]>([]);

  React.useEffect(() => {
    setLeaderboard(generateMockLeaderboard(gamification.points, userName || profile.name));
  }, [gamification.points, userName, profile.name]);

  const userRank = leaderboard.findIndex(u => u.isCurrentUser) + 1;

  return (
    <Card variant="glass" className="p-5 bg-white/80 border-white/50 shadow-premium overflow-hidden relative">
      <div className="flex items-center justify-between mb-5">
        <div className="space-y-0.5">
          <h3 className="text-sm font-black text-slate-900 font-display uppercase tracking-tight">Leaderboard</h3>
          <p className="text-slate-400 text-[8px] font-bold uppercase tracking-[0.1em]">Your area activity</p>
        </div>
        <div className="px-2 py-1 bg-primary/5 border border-primary/10 rounded-lg flex items-center gap-1.5">
          <TrendingUp size={10} className="text-primary" />
          <span className="text-[9px] font-black text-primary uppercase tracking-widest">Rank #{userRank || '10+'}</span>
        </div>
      </div>

      <div className="space-y-2">
        {leaderboard.slice(0, 5).map((user, index) => {
          const rank = index + 1;
          
          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "p-3 rounded-xl flex items-center justify-between transition-all duration-300",
                user.isCurrentUser 
                  ? "bg-primary/10 border border-primary/20 shadow-sm" 
                  : "bg-slate-50/50 border border-slate-100/50 hover:bg-white"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center font-black text-[10px]",
                  rank === 1 ? "bg-amber-500 text-white" :
                  rank === 2 ? "bg-slate-300 text-slate-700" :
                  rank === 3 ? "bg-amber-700 text-white" :
                  "text-slate-400 bg-slate-100"
                )}>
                  {rank === 1 ? <Crown size={12} /> : rank}
                </div>
                
                <div>
                  <h4 className={cn(
                    "text-[10px] font-black tracking-tight leading-none",
                    user.isCurrentUser ? "text-primary" : "text-slate-700"
                  )}>
                    {user.name}
                  </h4>
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="w-1 h-1 rounded-full bg-emerald-500" />
                    <span className="text-[7px] text-slate-400 font-bold uppercase tracking-widest">Online</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className={cn(
                  "text-sm font-black font-display leading-none",
                  user.isCurrentUser ? "text-primary" : "text-slate-900"
                )}>
                  {user.points}
                </span>
                <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Pts</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-5 p-2.5 bg-primary/5 rounded-xl border border-primary/5 flex items-center justify-center gap-2">
        <Medal className="text-amber-500" size={12} />
        <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest text-center">
          Complete <span className="text-primary">Quests</span> to climb ranks
        </p>
      </div>
    </Card>
  );
};
