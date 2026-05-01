"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  Info,
  ChevronRight,
  ShieldCheck,
  Zap
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { Card } from "@/components/ui/Card";
import { cn } from "@/utils/cn";

export const VotingDayMode: React.FC = () => {
  const { progress, profile, setVoted, unlockBadge, isVoted } = useAppStore();
  const [showGuide, setShowGuide] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  
  // Trigger condition: Progress > 80% or Mock Date (Mock date is set in checkTriggers as 2026-04-30, voting day 2026-05-20)
  const isVotingDayTriggered = progress >= 80; // For demo purposes, we use readiness > 80%

  if (!isVotingDayTriggered || isVoted) return null;

  const votingSteps = [
    { title: "Verification", description: "Show your ID to the polling officer", icon: FileText },
    { title: "Authentication", description: "Get your finger inked and sign the register", icon: ShieldCheck },
    { title: "Ballot Selection", description: "Select your preferred candidate on the EVM", icon: Zap },
    { title: "Final Check", description: "Wait for the beep sound and verify VVPAT", icon: CheckCircle2 }
  ];

  const handleFinishVoting = () => {
    setVoted(true);
    unlockBadge('badge_voted');
    // We could add points or redirect here
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto"
      >
        {/* Background Atmosphere */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[150px] animate-pulse" />
        </div>

        {!showGuide ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-4xl w-full relative z-10 flex flex-col items-center text-center space-y-12"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] animate-bounce">
                <CheckCircle2 size={12} /> Voting is Live
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white font-display tracking-tight leading-none">
                TODAY IS <br/> <span className="text-primary">ELECTION DAY</span>
              </h1>
              <p className="text-slate-400 text-lg max-w-xl mx-auto font-medium">
                Your readiness is {progress}%. You have everything you need to make your voice heard.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {/* Booth Location */}
              <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-xl flex flex-col items-start text-left space-y-4 group hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-white font-black text-xl">Your Booth</h3>
                  <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">St. Xavier&apos;s School, Room 4</p>
                </div>
                <div className="pt-4 w-full">
                  <button className="w-full py-3 bg-white/5 rounded-xl border border-white/10 text-xs font-black uppercase tracking-widest text-white group-hover:bg-white group-hover:text-slate-900 transition-all">
                    Navigate Now
                  </button>
                </div>
              </Card>

              {/* Required Documents */}
              <Card className="p-8 bg-white/5 border-white/10 backdrop-blur-xl flex flex-col items-start text-left space-y-4 group hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400 border border-amber-500/20">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-white font-black text-xl">Required ID</h3>
                  <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">Original Voter ID (EPIC)</p>
                </div>
                <div className="flex gap-2 pt-4">
                  <span className="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-black text-slate-400 uppercase border border-white/5">OR Aadhaar Card</span>
                  <span className="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-black text-slate-400 uppercase border border-white/5">OR PAN Card</span>
                </div>
              </Card>
            </div>

            <button 
              onClick={() => setShowGuide(true)}
              className="group relative px-12 py-6 bg-primary text-white font-black text-xl uppercase tracking-widest rounded-3xl shadow-3xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-4 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              Start Voting Journey <ArrowRight size={24} strokeWidth={3} />
            </button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl w-full relative z-10 space-y-12"
          >
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setShowGuide(false)}
                className="p-3 bg-white/5 rounded-2xl text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              <div className="text-right">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Step {activeStep + 1} of {votingSteps.length}</span>
                <div className="flex gap-1 mt-2">
                  {votingSteps.map((_, i) => (
                    <div key={i} className={cn("h-1 w-8 rounded-full transition-all", i <= activeStep ? "bg-primary" : "bg-white/10")} />
                  ))}
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={activeStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="w-24 h-24 rounded-[2.5rem] bg-primary/20 flex items-center justify-center text-primary border border-primary/20 mx-auto shadow-2xl shadow-primary/20">
                  {React.createElement(votingSteps[activeStep].icon, { size: 40, strokeWidth: 2.5 })}
                </div>
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-black text-white font-display tracking-tight uppercase">
                    {votingSteps[activeStep].title}
                  </h2>
                  <p className="text-slate-400 text-lg font-medium max-w-sm mx-auto">
                    {votingSteps[activeStep].description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex flex-col gap-4">
              {activeStep < votingSteps.length - 1 ? (
                <button 
                  onClick={() => setActiveStep(prev => prev + 1)}
                  className="w-full py-6 bg-white text-slate-950 font-black text-lg uppercase tracking-widest rounded-[2rem] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  Confirm & Next <ChevronRight size={20} strokeWidth={3} />
                </button>
              ) : (
                <button 
                  onClick={handleFinishVoting}
                  className="w-full py-6 bg-emerald-500 text-white font-black text-lg uppercase tracking-widest rounded-[2rem] shadow-xl shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  I Have Voted <CheckCircle2 size={24} strokeWidth={3} />
                </button>
              )}
              
              <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                <Info size={16} className="text-primary shrink-0" />
                <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
                  Stuck? Look for the presiding officer in the room or use the help button in the corner.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
