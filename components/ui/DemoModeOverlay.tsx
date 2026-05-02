"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Play, Zap, MapPin, FileText, ShieldCheck, X } from "lucide-react";
import { ProgressBar } from "./ProgressBar";
import { cn } from "@/utils/cn";

import { usePathname } from "@/i18n/navigation";

export const DemoModeOverlay: React.FC = () => {
  const pathname = usePathname();
  const [isActive, setIsActive] = React.useState(false);
  const [demoProgress, setDemoProgress] = React.useState(0);
  const [activeStep, setActiveStep] = React.useState<string | null>(null);

  const steps = [
    { id: 'eligibility', label: 'Eligibility Check', icon: Zap, target: 30 },
    { id: 'map', label: 'Finding Polling Booth', icon: MapPin, target: 60 },
    { id: 'checklist', label: 'Preparing Documents', icon: FileText, target: 100 },
  ];

  const startDemo = async () => {
    setIsActive(true);
    setDemoProgress(0);
    
    for (const step of steps) {
      setActiveStep(step.id);
      await new Promise(r => setTimeout(r, 1000));
      
      // Animate progress to target
      let current = demoProgress;
      const target = step.target;
      while (current < target) {
        current += 2;
        setDemoProgress(current);
        await new Promise(r => setTimeout(r, 30));
      }
      await new Promise(r => setTimeout(r, 500));
    }
    
    setActiveStep('finished');
  };

  const closeDemo = () => {
    setIsActive(false);
    setDemoProgress(0);
    setActiveStep(null);
  };

  if (pathname.includes('/assistant')) return null;

  return (
    <>
      <button 
        onClick={startDemo}
        className="fixed bottom-32 right-8 z-[60] px-6 py-3 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl border border-white/10 shadow-2xl flex items-center gap-2 hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
      >
        <Play size={14} className="text-primary fill-primary" />
        See how it works
      </button>

      <AnimatePresence>
        {isActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <Card className="max-w-md w-full p-10 bg-slate-900 border-white/10 shadow-3xl relative overflow-hidden">
              <button 
                onClick={closeDemo}
                className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-black uppercase tracking-widest">
                  <Play size={10} fill="currentColor" /> Demo Mode
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-white font-display tracking-tight">
                    {activeStep === 'finished' ? "Ready to Vote!" : "Your Journey"}
                  </h2>
                  <p className="text-slate-500 text-sm font-medium">
                    Experience how Civic AI guides you to 100% readiness.
                  </p>
                </div>

                <div className="py-8">
                  <div className="relative h-24 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      {steps.map((step) => activeStep === step.id && (
                        <motion.div 
                          key={step.id}
                          initial={{ opacity: 0, scale: 0.8, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: -10 }}
                          className="flex flex-col items-center gap-3"
                        >
                          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
                            <step.icon size={32} />
                          </div>
                          <span className="text-xs font-black text-white uppercase tracking-widest">{step.label}</span>
                        </motion.div>
                      ))}

                      {activeStep === 'finished' && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex flex-col items-center gap-3"
                        >
                          <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
                            <ShieldCheck size={32} strokeWidth={3} />
                          </div>
                          <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">100% Prepared</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="mt-8 space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Readiness Progress</span>
                      <span className="text-xl font-black text-white font-display">{Math.min(100, demoProgress)}%</span>
                    </div>
                    <ProgressBar value={demoProgress} className="h-3" />
                  </div>
                </div>

                {activeStep === 'finished' ? (
                  <button 
                    onClick={closeDemo}
                    className="w-full py-5 bg-white text-slate-900 font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all"
                  >
                    Start Your Real Journey
                  </button>
                ) : (
                  <p className="text-[10px] text-slate-500 font-bold italic uppercase tracking-wider">
                    * This is a simulation. No changes will be saved.
                  </p>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("rounded-[2.5rem] bg-slate-900 border border-white/5 shadow-2xl", className)}>
    {children}
  </div>
);
