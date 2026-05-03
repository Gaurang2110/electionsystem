"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { 
  Trophy, 
  Zap, 
  Target, 
  ChevronRight, 
  Medal, 
  Star,
  MapPin
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/utils/cn";

import { useTranslations } from "next-intl";

export const EngagementSection: React.FC = () => {
  const router = useRouter();
  const t = useTranslations("sidebar");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const { 
    gamification, 
    progress, 
    leaderboardRank,
    eligibility
  } = useAppStore();

  if (!mounted) return null;

  const { quizProgress, points, badges, unlockedStates, questSteps } = gamification;
  
  // Calculate quest progress
  const completedQuests = Object.values(questSteps).filter(Boolean).length;
  const totalQuests = Object.values(questSteps).length;
  const questProgress = (completedQuests / totalQuests) * 100;

  // Highlight logic
  const highlights = {
    quiz: quizProgress < 10,
    journey: completedQuests < totalQuests,
    map: !questSteps.locate && eligibility.status === 'eligible'
  };

  return (
    <div className="px-4 py-6 space-y-8">
      {/* Activity Title */}
      <div className="px-2">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
          {t('your_activity')}
        </h3>
        
        <div className="space-y-3">
          {/* Daily Quiz Card */}
          <motion.button
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/quiz' as any)}
            className={cn(
              "w-full text-left p-4 rounded-[1.5rem] transition-all relative overflow-hidden group",
              highlights.quiz 
                ? "bg-primary/5 border-2 border-primary/20 shadow-xl shadow-primary/5" 
                : "bg-slate-50 border border-slate-100"
            )}
          >
            {highlights.quiz && (
              <motion.div
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-primary/10"
              />
            )}
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm">
                <Target size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-slate-900 truncate">{t('daily_quiz')}</h4>
                  <span className="text-[10px] font-bold text-primary">+50 {t('pts')}</span>
                </div>
                <p className="text-[10px] font-bold text-slate-500 mt-0.5">
                  {quizProgress}/10 {t('completed')}
                </p>
              </div>
            </div>
          </motion.button>

          {/* Quest Progress */}
          <motion.button
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/journey' as any)}
            className="w-full text-left p-4 rounded-[1.5rem] bg-slate-50 border border-slate-100 transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-amber-500 shadow-sm">
                <Zap size={20} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-black text-slate-900">{t('quest_progress')}</h4>
                <p className="text-[10px] font-bold text-slate-500">
                  {completedQuests} / {totalQuests} {t('steps')}
                </p>
              </div>
            </div>
            <div className="h-2 bg-white rounded-full overflow-hidden border border-slate-100">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${questProgress}%` }}
                className="h-full bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.3)]"
              />
            </div>
          </motion.button>

          {/* Sticker Collection */}
          <motion.button
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/stickers' as any)}
            className="w-full text-left p-4 rounded-[1.5rem] bg-slate-50 border border-slate-100 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-500 shadow-sm">
                <MapPin size={20} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-black text-slate-900">{t('stickers')}</h4>
                <p className="text-[10px] font-bold text-slate-500">
                  {unlockedStates.length} / 28 {t('states_unlocked')}
                </p>
              </div>
              <ChevronRight size={14} className="text-slate-300" />
            </div>
          </motion.button>
        </div>
      </div>

      {/* Rewards Snapshot */}
      <div className="px-2">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
          {t('rewards')}
        </h3>
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => router.push('/leaderboard' as any)}
          className="w-full p-5 rounded-[2rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden group shadow-xl"
        >
          {/* Decorative Elements */}
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary/10 rounded-full blur-2xl" />

          <div className="grid grid-cols-2 gap-4 relative z-10">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('total_points')}</span>
              <div className="flex items-center gap-2">
                <Star size={14} className="text-amber-400 fill-amber-400" />
                <span className="text-xl font-black">{points}</span>
              </div>
            </div>
            <div className="space-y-1 border-l border-white/10 pl-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('your_rank')}</span>
              <div className="flex items-center gap-2">
                <Trophy size={14} className="text-primary" />
                <span className="text-xl font-black">#{leaderboardRank}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Medal size={16} className="text-amber-300" />
              </div>
              <span className="text-[11px] font-bold text-slate-200 truncate max-w-[100px]">
                {badges[badges.length - 1] || t('explorer')}
              </span>
            </div>
            <span className="text-[9px] font-black text-primary uppercase tracking-widest group-hover:translate-x-1 transition-transform">
              {t('view_all')}
            </span>
          </div>
        </motion.button>
      </div>
    </div>
  );
};
