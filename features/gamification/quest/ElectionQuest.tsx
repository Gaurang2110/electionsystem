"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { 
  UserCheck, 
  MapPin, 
  Vote, 
  ShieldCheck, 
  Share2, 
  CheckCircle2, 
  Lock,
  Zap,
  ArrowRight
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/utils/cn";
import { Card } from "@/components/ui/Card";
import { GamificationFlow } from "@/lib/gamificationFlow";
import { Link } from "@/i18n/navigation";
import { SignLanguageGuide } from "@/components/ui/SignLanguageGuide";

export const ElectionQuest: React.FC = () => {
  const { gamification } = useAppStore();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const { questSteps } = gamification;
  const nextStep = GamificationFlow.getNextStep();

  if (!mounted) return null;

  const steps = [
    { id: 'register', label: 'Register', icon: UserCheck, completed: questSteps.register, insight: 'Ensures you are on the list to vote.', videoType: 'registration' as const },
    { id: 'locate', label: 'Locate Booth', icon: MapPin, completed: questSteps.locate, insight: 'Saves time on the actual election day.', videoType: 'map' as const },
    { id: 'ballot', label: 'Mock Ballot', icon: Vote, completed: questSteps.ballot, insight: 'Builds confidence before using the EVM.', videoType: 'voting' as const },
    { id: 'ready', label: 'Vote Ready', icon: ShieldCheck, completed: questSteps.ready, insight: 'Confirms you have everything you need.' },
    { id: 'share', label: 'Share', icon: Share2, completed: questSteps.share, insight: 'Encourages others to participate too.' },
  ];

  const completedCount = steps.filter(s => s.completed).length;
  const progressPercent = (completedCount / steps.length) * 100;

  // Visual progress bar should reach the furthest completed step
  const maxCompletedIndex = steps.reduce((max, step, idx) => step.completed ? Math.max(max, idx) : max, -1);
  const visualProgress = maxCompletedIndex === -1 ? 0 : ((maxCompletedIndex) / (steps.length - 1)) * 100;

  return (
    <Card variant="glass" className="p-5 bg-white/70 border-white/50 shadow-premium overflow-hidden relative group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] -z-10" />
      
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-black text-slate-900 font-display tracking-tight uppercase">Election Quest</h3>
            <div className="px-1.5 py-0.5 bg-emerald-500 text-white text-[7px] font-black uppercase tracking-[0.1em] rounded-full">Active</div>
          </div>
          <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">Complete steps for rewards</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-2xl font-black text-slate-900 font-display leading-none">{Math.round(progressPercent)}%</span>
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Complete</span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="relative mb-10 px-2">
        <div className="absolute top-1/2 left-2 right-2 h-0.5 bg-slate-100 -translate-y-1/2 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${visualProgress}%` }}
            className="h-full bg-gradient-to-r from-emerald-500 to-primary"
          />
        </div>

        <div className="flex justify-between relative z-10">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="flex flex-col items-center gap-3">
                <div className="relative">
                  <motion.div 
                    initial={false}
                    animate={{ 
                      scale: step.completed ? 1 : 0.85,
                      backgroundColor: step.completed ? '#10B981' : '#F8FAFC'
                    }}
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 relative group/step",
                      step.completed ? "border-white text-white shadow-lg shadow-emerald-500/20" : "border-slate-100 text-slate-300"
                    )}
                  >
                    {step.completed ? (
                      <CheckCircle2 size={14} strokeWidth={3} />
                    ) : (
                      <Icon size={12} />
                    )}
                  </motion.div>
                </div>
                <span className={cn(
                  "text-[8px] font-black uppercase tracking-widest text-center",
                  step.completed ? "text-emerald-600" : "text-slate-400"
                )}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        {nextStep ? (
          <Link href={nextStep.link}>
            <motion.div 
              whileHover={{ x: 3 }}
              className="flex items-center justify-between p-3 bg-primary/5 border border-primary/10 rounded-xl group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Zap size={14} fill="currentColor" />
                </div>
                <div>
                  <p className="text-[8px] font-black text-primary uppercase tracking-widest leading-none">Next Up</p>
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-tight mt-1">{nextStep.label}</h4>
                </div>
              </div>
              <ArrowRight size={14} className="text-primary group-hover:translate-x-1 transition-transform" />
            </motion.div>
          </Link>
        ) : (
          <div className="flex items-center gap-3 p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
              <CheckCircle2 size={16} />
            </div>
            <div>
              <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">Quest Completed</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
