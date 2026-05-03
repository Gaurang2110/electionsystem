"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { ShieldCheck, Info, ChevronRight, Zap, RefreshCcw, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import { systemOrchestrator } from "@/lib/systemOrchestrator";

const CANDIDATES = [
  { id: 'c1', name: "Prosperity Party", symbol: "🏢" },
  { id: 'c2', name: "Unity Front", symbol: "🤝" },
  { id: 'c3', name: "Green Alliance", symbol: "🌿" },
  { id: 'c4', name: "Progressive Union", symbol: "🚀" },
];

export const VirtualEVMSim: React.FC = () => {
  const [step, setStep] = React.useState<'idle' | 'voting' | 'vvpat' | 'complete'>('idle');
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [vvpatShown, setVvpatShown] = React.useState(false);

  const handleVote = (id: string) => {
    if (step !== 'voting') return;
    setSelectedId(id);
    // Play sound simulation? (Optional)
    setStep('vvpat');
    
    // Auto-advance after VVPAT verification
    setTimeout(() => {
      setVvpatShown(true);
      setTimeout(() => {
        setStep('complete');
        systemOrchestrator.onStepComplete('laboratory_evm_sim');
      }, 3000);
    }, 1500);
  };

  const reset = () => {
    setStep('idle');
    setSelectedId(null);
    setVvpatShown(false);
  };

  return (
    <div className="space-y-8">
      <Card className="p-10 bg-slate-900 border-none shadow-2xl rounded-[3rem] overflow-hidden relative">
        <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
          <Zap size={180} />
        </div>

        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          {/* EVM Control Panel */}
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                   <ShieldCheck size={20} />
                </div>
                <h3 className="text-2xl font-black text-white font-display uppercase tracking-tight">Virtual EVM UNIT</h3>
              </div>
              <p className="text-slate-400 font-medium text-sm">Follow the red light to cast your ballot.</p>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-[2rem] border border-white/5 space-y-4">
               {CANDIDATES.map((c) => (
                 <div key={c.id} className="flex items-center gap-4">
                   <div className="flex-1 p-4 bg-slate-900 rounded-xl border border-white/10 flex items-center justify-between">
                     <span className="text-xl">{c.symbol}</span>
                     <span className="text-xs font-black text-slate-300 uppercase tracking-wider">{c.name}</span>
                   </div>
                   <motion.button
                     whileTap={{ scale: 0.9 }}
                     onClick={() => handleVote(c.id)}
                     disabled={step !== 'voting'}
                     className={cn(
                       "w-14 h-14 rounded-full border-4 flex items-center justify-center transition-all shadow-lg",
                       step === 'voting' 
                        ? "bg-slate-700 border-slate-600 hover:bg-slate-600 cursor-pointer" 
                        : "bg-slate-900 border-slate-800 opacity-50 cursor-not-allowed",
                       selectedId === c.id && "bg-primary border-primary"
                     )}
                   >
                     <div className={cn(
                       "w-4 h-4 rounded-full",
                       step === 'voting' ? "bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "bg-slate-700"
                     )} />
                   </motion.button>
                 </div>
               ))}
            </div>

            {step === 'idle' && (
              <Button size="lg" className="w-full h-16 rounded-2xl text-base" onClick={() => setStep('voting')}>
                Activate Machine
              </Button>
            )}
          </div>

          {/* VVPAT Display */}
          <div className="h-full flex flex-col items-center justify-center">
            <div className="w-full max-w-[300px] aspect-[3/4] bg-slate-800 rounded-[2rem] border-8 border-slate-700 shadow-2xl relative overflow-hidden flex flex-col">
              <div className="h-4 bg-slate-900 w-full mb-8 shadow-inner" />
              
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
                <AnimatePresence mode="wait">
                  {step === 'vvpat' && (
                    <motion.div
                      initial={{ opacity: 0, y: 100 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full aspect-[4/5] bg-white rounded-lg shadow-inner p-6 flex flex-col items-center justify-between relative"
                    >
                      <div className="w-full border-b border-dashed border-slate-200 pb-2 flex justify-between">
                        <span className="text-[6px] font-black uppercase text-slate-400">VVPAT SLIP</span>
                        <span className="text-[6px] font-black uppercase text-slate-400">2026 ELECTION</span>
                      </div>
                      
                      <div className="text-4xl">{CANDIDATES.find(c => c.id === selectedId)?.symbol}</div>
                      <div className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">
                        {CANDIDATES.find(c => c.id === selectedId)?.name}
                      </div>
                      
                      <div className="w-full h-4 bg-slate-100 rounded-sm overflow-hidden flex items-center justify-center">
                         <div className="w-full h-1 bg-slate-900 opacity-20" />
                      </div>
                      
                      {vvpatShown && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center"
                        >
                           <div className="bg-emerald-500 text-white p-2 rounded-full shadow-lg">
                             <Check size={20} strokeWidth={4} />
                           </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {(step === 'idle' || step === 'voting') && (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4"
                    >
                      <Info size={40} className="text-slate-600 mx-auto" />
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                        The VVPAT screen will display your printed slip for 7 seconds for verification.
                      </p>
                    </motion.div>
                  )}

                  {step === 'complete' && (
                    <motion.div
                      key="complete"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-6"
                    >
                      <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-500/20">
                         <ShieldCheck size={32} />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-white font-black text-xs uppercase tracking-widest">Verification Success</h4>
                        <p className="text-slate-400 text-[9px] font-medium leading-relaxed">
                          Your vote was correctly recorded and verified by the VVPAT system.
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={reset} className="text-primary text-[10px] font-black uppercase tracking-widest">
                        <RefreshCcw size={12} className="mr-2" />
                        Try Again
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="h-12 bg-slate-900 w-full mt-auto shadow-inner flex items-center justify-center gap-2">
                 <div className="w-1 h-1 rounded-full bg-slate-700" />
                 <div className="w-1 h-1 rounded-full bg-slate-700" />
              </div>
            </div>
            <p className="mt-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">VVPAT UNIT MODEL V3</p>
          </div>
        </div>
      </Card>

      {/* Info Sections */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { title: "Control Unit", desc: "The brain of the EVM that resides with the Presiding Officer.", icon: Zap },
          { title: "Ballot Unit", desc: "Where the voter presses the button for their choice.", icon: ChevronRight },
          { title: "VVPAT", desc: "Voter Verifiable Paper Audit Trail for transparency.", icon: ShieldCheck },
        ].map((info, i) => (
          <Card key={i} className="p-6 bg-white border-none shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900 shrink-0">
               <info.icon size={20} />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">{info.title}</h4>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{info.desc}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
