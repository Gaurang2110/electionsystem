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
    // Regenerate simulation on mount or points change
    setLeaderboard(generateMockLeaderboard(gamification.points, userName || profile.name));
  }, [gamification.points, userName, profile.name]);

  const userRank = leaderboard.findIndex(u => u.isCurrentUser) + 1;

  return (
    <Card className="p-8 bg-slate-900 border-white/5 shadow-3d overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      
      <div className="flex items-center justify-between mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users className="text-blue-500" size={20} />
            <h3 className="text-2xl font-black text-white font-display uppercase tracking-tight">Local Leaderboard</h3>
          </div>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Top active citizens in your area</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center gap-2">
            <TrendingUp size={12} className="text-blue-500" />
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Rank #{userRank || '10+'}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {leaderboard.map((user, index) => {
          const rank = index + 1;
          const isTop3 = rank <= 3;
          
          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "group relative p-4 rounded-2xl flex items-center justify-between transition-all duration-300",
                user.isCurrentUser 
                  ? "bg-blue-600/20 border border-blue-500/30 shadow-[0_0_20px_rgba(37,99,235,0.1)]" 
                  : "bg-white/5 border border-white/5 hover:bg-white/10"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm",
                  rank === 1 ? "bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/20" :
                  rank === 2 ? "bg-slate-300 text-slate-900" :
                  rank === 3 ? "bg-amber-700 text-white" :
                  "text-slate-500"
                )}>
                  {rank === 1 ? <Crown size={18} /> : rank}
                </div>
                
                <div>
                  <h4 className={cn(
                    "text-sm font-black tracking-tight",
                    user.isCurrentUser ? "text-white" : "text-slate-300"
                  )}>
                    {user.name} {user.isCurrentUser && <span className="ml-2 px-1.5 py-0.5 bg-blue-500 text-[8px] uppercase tracking-widest rounded">You</span>}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Online</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className={cn(
                  "text-lg font-black font-display",
                  user.isCurrentUser ? "text-blue-400" : "text-white"
                )}>
                  {user.points}
                </span>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Points</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center gap-3">
        <Medal className="text-amber-500" size={16} />
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          Complete more <span className="text-white">Quests</span> to climb the rank
        </p>
      </div>
    </Card>
  );
};
