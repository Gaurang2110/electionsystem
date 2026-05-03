"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Check, Info, ShieldCheck, Vote, Star, ArrowRight, Shield } from "lucide-react";
import candidates from "@/data/candidates.json";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

export const MockBallot: React.FC = () => {
  const { updateQuestStep, unlockBadge, addPoints } = useAppStore();
  const [selected, setSelected] = React.useState<string | null>(null);
  const [isVoted, setIsVoted] = React.useState(false);

  const handleVote = () => {
    if (selected) {
      setIsVoted(true);
      // Mark quest step as complete
      updateQuestStep('ballot', true);
      unlockBadge('badge_informed_voter');
      addPoints(30);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-slate-900 font-display">Mock Ballot Practice</h1>
        <p className="text-slate-500 font-medium">Practice casting your preference. All data is local, private, and anonymous.</p>
      </div>

      <Card className="p-8 md:p-12 bg-white border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] relative overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none -rotate-12">
          <Vote size={240} />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 font-display">EVM Simulation</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verify the voting process</p>
            </div>
          </div>

          <div className="grid gap-4 mb-10">
            {candidates.map((candidate) => (
              <motion.button
                key={candidate.id}
                whileHover={!isVoted ? { x: 4 } : {}}
                whileTap={!isVoted ? { scale: 0.99 } : {}}
                onClick={() => {
                  if (!isVoted) {
                    setSelected(candidate.id);
                  }
                }}
                className={cn(
                  "w-full p-6 rounded-[2rem] border-2 transition-all flex items-center justify-between group",
                  selected === candidate.id 
                    ? "bg-primary/5 border-primary shadow-lg shadow-primary/5" 
                    : "bg-slate-50 border-slate-50 hover:border-slate-200",
                  isVoted && selected !== candidate.id && "opacity-40 grayscale pointer-events-none"
                )}
              >
                <div className="flex items-center gap-6">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all shadow-sm",
                    selected === candidate.id ? "bg-primary text-white" : "bg-white text-slate-400 group-hover:bg-slate-100"
                  )}>
                    {candidate.symbol}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-lg leading-tight">{candidate.name}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{candidate.vision}</p>
                  </div>
                </div>
                <div className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all",
                  selected === candidate.id ? "bg-primary border-primary text-white shadow-md shadow-primary/20" : "border-slate-200"
                )}>
                  {selected === candidate.id && <Check size={18} strokeWidth={4} />}
                </div>
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {selected && !isVoted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Button 
                  size="lg"
                  onClick={handleVote}
                  className="w-full h-20 bg-slate-900 text-white font-black text-lg uppercase tracking-[0.2em] rounded-3xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-slate-900/20 group"
                >
                  Submit Practice Vote
                  <ArrowRight size={22} className="ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            )}

            {isVoted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-10 rounded-[3rem] bg-emerald-500/5 border-2 border-emerald-500/10 text-center space-y-6"
              >
                <div className="w-20 h-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto text-white shadow-xl shadow-emerald-500/20">
                  <Shield size={40} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-3xl font-black text-slate-900 font-display">Neutrality Verified</h4>
                  <p className="text-slate-500 font-medium max-w-md mx-auto">
                    Excellent! You've successfully practiced the voting process. This helps build the muscle memory needed for the real election day.
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center justify-center gap-4 py-4">
                  <div className="px-5 py-3 rounded-2xl bg-white shadow-sm flex items-center gap-2">
                    <Star size={16} className="text-amber-500 fill-amber-500" />
                    <span className="text-sm font-black text-slate-900">+30 <span className="text-[10px] text-slate-400 uppercase">Points</span></span>
                  </div>
                  <div className="px-5 py-3 rounded-2xl bg-white shadow-sm flex items-center gap-2">
                    <Star size={16} className="text-primary fill-primary" />
                    <span className="text-sm font-black text-slate-900">Expert <span className="text-[10px] text-slate-400 uppercase">Badge</span></span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase text-emerald-600 tracking-widest bg-emerald-500/10 py-3 rounded-xl">
                  <Info size={14} />
                  Choice made based on democratic principles.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>

      {/* Info Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 bg-slate-50 border-none shadow-sm flex gap-5 items-start">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm shrink-0">
            <Info size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">Why practice?</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Familiarizing yourself with the ballot layout reduces anxiety and potential errors on election day.
            </p>
          </div>
        </Card>
        <Card className="p-6 bg-slate-50 border-none shadow-sm flex gap-5 items-start">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-secondary shadow-sm shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">Voter Secrecy</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Your practice choices are never stored or shared. This is a local simulation for your benefit.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
