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
  const { questSteps } = gamification;
  const nextStep = GamificationFlow.getNextStep();

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
    <Card className="p-8 bg-slate-900 border-white/5 shadow-3d overflow-hidden relative group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -z-10 group-hover:bg-primary/20 transition-colors" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="px-2 py-0.5 bg-primary text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full">Active</div>
            <h3 className="text-2xl font-black text-white font-display tracking-tight uppercase">Election Quest</h3>
          </div>
          <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest">Complete steps to unlock the National Voter Badge</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-4xl font-black text-white font-display leading-none">{Math.round(progressPercent)}%</span>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Total Completion</span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="relative mb-12">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -translate-y-1/2 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${visualProgress}%` }}
            className="h-full bg-gradient-to-r from-blue-600 to-primary shadow-[0_0_15px_rgba(59,130,246,0.5)]"
          />
        </div>

        <div className="flex justify-between relative z-10">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="flex flex-col items-center gap-4">
                <div className="relative">
                  <motion.div 
                    initial={false}
                    animate={{ 
                      scale: step.completed ? 1.1 : 1,
                      backgroundColor: step.completed ? '#3b82f6' : '#1e293b'
                    }}
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 relative group/step",
                      step.completed ? "border-blue-400 text-white shadow-lg shadow-blue-500/20" : "border-slate-800 text-slate-500"
                    )}
                  >
                    {/* Micro-insight tooltip */}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-32 p-2 bg-slate-800 border border-white/10 rounded-lg opacity-0 group-hover/step:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl">
                      <p className="text-[9px] text-white font-bold text-center leading-tight">
                        {step.insight}
                      </p>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800" />
                    </div>

                    {step.completed ? (
                      <CheckCircle2 size={24} strokeWidth={3} />
                    ) : (
                      <Icon size={20} />
                    )}
                  </motion.div>
                  
                  {/* Sign Language Guide Overlay */}
                  {step.videoType && (
                    <SignLanguageGuide 
                      type={step.videoType as any} 
                      className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-white text-slate-900 border-2 border-slate-900 shadow-sm"
                    />
                  )}
                </div>
                <span className={cn(
                  "text-[9px] font-black uppercase tracking-widest text-center max-w-[60px]",
                  step.completed ? "text-white" : "text-slate-500"
                )}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        {nextStep ? (
          <Link href={nextStep.link}>
            <motion.div 
              whileHover={{ x: 5 }}
              className="flex items-center justify-between p-4 bg-primary/10 border border-primary/20 rounded-2xl group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                  <Zap size={18} fill="white" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest">Next Up</p>
                  <h4 className="text-sm font-black text-white uppercase tracking-tight">{nextStep.label}</h4>
                  <p className="text-[10px] text-slate-500 font-bold mt-0.5">
                    Why: {steps.find(s => s.id === nextStep.id)?.insight}
                  </p>
                </div>
              </div>
              <ArrowRight className="text-primary group-hover:translate-x-1 transition-transform" />
            </motion.div>
          </Link>
        ) : (
          <div className="flex items-center gap-3 p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Master Citizen</p>
              <h4 className="text-sm font-black text-white uppercase tracking-tight">All Steps Completed</h4>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
            <Lock size={18} />
          </div>
          <p className="text-xs text-slate-400 font-bold leading-relaxed">
            Unlock the <span className="text-white">"Democracy Champion"</span> status and exclusive stickers by completing the remaining {steps.length - completedCount} steps.
          </p>
        </div>
      </div>
    </Card>
  );
};
