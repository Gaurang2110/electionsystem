"use client";
import * as React from "react";
import { FlaskConical, Beaker, Zap, ShieldAlert, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { VirtualEVMSim } from "@/features/laboratory/VirtualEVMSim";
import { Button } from "@/components/ui/Button";

export default function LaboratoryPage() {
  const [activeExp, setActiveExp] = React.useState<string | null>(null);

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <FlaskConical size={20} />
          </div>
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Innovation Lab</span>
        </div>
        <h1 className="text-4xl font-black text-slate-900 font-display uppercase tracking-tight">Experimental Simulations</h1>
        <p className="text-slate-500 font-medium text-lg">Test upcoming civic technologies and practice democratic processes in a secure environment.</p>
      </div>

      <AnimatePresence mode="wait">
        {!activeExp ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid md:grid-cols-2 gap-8"
          >
            <Card className="p-10 space-y-6 border-dashed border-2 border-primary/20 bg-white hover:border-primary/40 transition-all group cursor-pointer" onClick={() => setActiveExp('evm')}>
              <div className="w-16 h-16 rounded-[1.5rem] bg-primary text-white flex items-center justify-center shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform">
                <Beaker size={32} />
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Virtual EVM UNIT</h2>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Experience the full lifecycle of a digital vote. Practice machine activation, ballot selection, and VVPAT verification to build technical confidence.
                </p>
              </div>
              <div className="flex items-center justify-between pt-4">
                <span className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">Active Simulation</span>
                <Button variant="ghost" className="text-primary font-black uppercase tracking-widest text-[10px]">
                  Launch Lab
                </Button>
              </div>
            </Card>

            <Card className="p-10 space-y-6 border-dashed border-2 border-amber-200 bg-amber-50/20 opacity-80 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Zap size={120} />
              </div>
              <div className="w-16 h-16 rounded-[1.5rem] bg-amber-500 text-white flex items-center justify-center shadow-xl shadow-amber-500/20">
                <Sparkles size={32} />
              </div>
              <div className="space-y-3">
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">AI Fact-Check Hub</h2>
                <p className="text-slate-600 leading-relaxed font-medium">
                  Test our real-time deepfake detection and social media rumor monitoring tools. Help us calibrate the safety engines for 2026.
                </p>
              </div>
              <div className="flex items-center justify-between pt-4">
                <span className="px-4 py-2 rounded-xl bg-amber-500/10 text-amber-600 text-[10px] font-black uppercase tracking-widest">In Development</span>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="exp"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={() => setActiveExp(null)} className="text-slate-500 hover:text-slate-900 font-black uppercase tracking-widest text-[10px]">
                &larr; Back to Lab
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Experiment: {activeExp === 'evm' ? 'EVM_UNIT_V3' : 'FACT_CHECK_ALPHA'}</span>
              </div>
            </div>
            {activeExp === 'evm' && <VirtualEVMSim />}
          </motion.div>
        )}
      </AnimatePresence>

      {!activeExp && (
        <div className="p-10 rounded-[3rem] bg-slate-900 text-white flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="flex-1 space-y-4 relative z-10">
            <h3 className="text-2xl font-black uppercase tracking-tight">Become a Digital Volunteer</h3>
            <p className="text-slate-400 font-medium max-w-xl">
              Our Innovation Lab relies on real citizen feedback to harden democratic tools. Apply to join our beta program and get early access to voting security features.
            </p>
          </div>
          <Button size="lg" className="px-10 h-16 rounded-2xl bg-white text-slate-900 font-black uppercase tracking-widest hover:bg-slate-100 shrink-0 relative z-10">
            Apply Now
          </Button>
        </div>
      )}
    </div>
  );
}
