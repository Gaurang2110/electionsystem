"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Check, Info, ShieldCheck } from "lucide-react";
import candidates from "@/data/candidates.json";
import { systemOrchestrator } from "@/lib/systemOrchestrator";

export const MockBallot: React.FC = () => {
  const [selected, setSelected] = React.useState<string | null>(null);
  const [showScore, setShowScore] = React.useState(false);

  const handleVote = () => {
    if (selected) {
      setShowScore(true);
      systemOrchestrator.onStepComplete('ballot');
    }
  };

  return (
    <Card className="p-8 bg-slate-900/60 border-primary/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-10 opacity-5 -rotate-12 pointer-events-none">
        <ShieldCheck size={180} />
      </div>

      <div className="relative z-10">
        <div className="mb-8">
          <h3 className="text-2xl font-black text-white font-display mb-2">Mock Ballot Practice</h3>
          <p className="text-slate-400 font-medium">Practice casting your preference. All data is local and anonymous.</p>
        </div>

        <div className="grid gap-4 mb-8">
          {candidates.map((candidate) => (
            <button
              key={candidate.id}
              onClick={() => {
                setSelected(candidate.id);
                setShowScore(false);
              }}
              className={`w-full p-5 rounded-3xl border transition-all text-left flex items-center justify-between group ${
                selected === candidate.id 
                  ? "bg-primary/20 border-primary shadow-xl shadow-primary/10" 
                  : "bg-slate-800/40 border-white/5 hover:border-white/10"
              }`}
            >
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
                  selected === candidate.id ? "bg-primary text-white" : "bg-slate-800 text-slate-400"
                }`}>
                  {candidate.symbol}
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">{candidate.name}</h4>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{candidate.vision}</p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                selected === candidate.id ? "bg-primary border-primary text-white" : "border-white/10"
              }`}>
                {selected === candidate.id && <Check size={14} strokeWidth={4} />}
              </div>
            </button>
          ))}
        </div>

        <AnimatePresence>
          {selected && !showScore && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <button 
                onClick={handleVote}
                className="w-full py-4 bg-primary text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20"
              >
                Submit Practice Vote
              </button>
            </motion.div>
          )}

          {showScore && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 text-center"
            >
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg shadow-emerald-500/20">
                <ShieldCheck size={24} />
              </div>
              <h4 className="text-xl font-black text-white mb-2 font-display">Neutrality Verified</h4>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                Great job! You made a preference-based choice. Your **Voter Independence Score** is **98%**.
              </p>
              <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase text-emerald-500 tracking-tighter">
                <Info size={12} />
                Choice made based on vision, not bias.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};
