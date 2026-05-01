"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { systemOrchestrator } from '@/lib/systemOrchestrator';
import { 
  Users, 
  GraduationCap, 
  Briefcase, 
  Building2, 
  ChevronRight, 
  RotateCcw, 
  ShieldCheck,
  Target
} from 'lucide-react';

type Priority = 'education' | 'jobs' | 'infrastructure';

interface Candidate {
  id: string;
  name: string;
  focus: Priority;
  description: string;
  policy: string;
  color: string;
  icon: any;
}

const CANDIDATES: Candidate[] = [
  {
    id: 'A',
    name: 'Candidate A',
    focus: 'education',
    description: 'A visionary focused on the intellectual capital of the nation.',
    policy: 'Proposes "Universal Skill Credits" and 100% digital literacy in rural zones.',
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    icon: GraduationCap
  },
  {
    id: 'B',
    name: 'Candidate B',
    focus: 'jobs',
    description: 'An economic strategist focused on industrial growth.',
    policy: 'Focuses on "Startup Tax Holidays" and specialized SEZs for manufacturing.',
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    icon: Briefcase
  },
  {
    id: 'C',
    name: 'Candidate C',
    focus: 'infrastructure',
    description: 'A developmental leader focused on sustainable urbanization.',
    policy: 'Proposes "Green Transit Networks" and smart-grid integration for all districts.',
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    icon: Building2
  }
];

export const CandidateMatchSimulation: React.FC = () => {
  const [step, setStep] = useState<'intro' | 'question' | 'result'>('intro');
  const [selectedPriority, setSelectedPriority] = useState<Priority | null>(null);

  const handleMatch = (priority: Priority) => {
    setSelectedPriority(priority);
    setStep('result');
    systemOrchestrator.onCandidateMatchComplete();
  };

  const matchedCandidate = CANDIDATES.find(c => c.focus === selectedPriority);

  return (
    <Card className="p-8 bg-slate-900/40 backdrop-blur-3xl border-white/5 relative overflow-hidden">
      {/* Educational Disclaimer Banner */}
      <div className="absolute top-0 left-0 w-full bg-blue-600/20 py-2 px-4 flex items-center justify-center gap-2 border-b border-blue-500/20">
        <ShieldCheck size={14} className="text-blue-400" />
        <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Educational Simulation • Non-Partisan</span>
      </div>

      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div 
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 text-center py-8"
          >
            <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20 shadow-3d">
              <Users className="text-blue-400" size={40} />
            </div>
            <h2 className="text-3xl font-black text-white font-display mb-4">Candidate Match Simulation</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-10 font-medium leading-relaxed">
              Understand how policy preferences align with candidate platforms. This simulation uses generic profiles to teach the matching process.
            </p>
            <Button 
              onClick={() => setStep('question')}
              className="px-10 py-6 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-105 transition-all"
            >
              Start Simulation
              <ChevronRight size={18} className="ml-2" />
            </Button>
          </motion.div>
        )}

        {step === 'question' && (
          <motion.div 
            key="question"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="mt-6"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
              <h3 className="text-white font-black text-2xl font-display">What matters most to you?</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { id: 'education', icon: GraduationCap, label: 'Education', desc: 'Focus on schools, skills, and literacy.' },
                { id: 'jobs', icon: Briefcase, label: 'Jobs', desc: 'Focus on industry, startups, and employment.' },
                { id: 'infrastructure', icon: Building2, label: 'Development', desc: 'Focus on roads, power, and transit.' }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleMatch(p.id as Priority)}
                  className="p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:bg-white/10 hover:border-blue-500/30 transition-all text-left group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <p.icon size={24} />
                  </div>
                  <h4 className="text-white font-black text-lg mb-2">{p.label}</h4>
                  <p className="text-slate-500 text-[11px] font-medium leading-relaxed">{p.desc}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'result' && matchedCandidate && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-white font-black text-2xl font-display">Your Match Results</h3>
              <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <span className="text-emerald-400 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                  <Target size={14} /> 100% Alignment
                </span>
              </div>
            </div>

            <div className={`p-10 rounded-[3rem] border relative overflow-hidden ${matchedCandidate.color}`}>
              <div className="absolute -right-10 -bottom-10 opacity-10">
                <matchedCandidate.icon size={240} />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-white/10 flex items-center justify-center">
                    <matchedCandidate.icon size={32} />
                  </div>
                  <div>
                    <h4 className="text-3xl font-black text-white font-display leading-none">{matchedCandidate.name}</h4>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mt-2">Primary Focus: {matchedCandidate.focus}</p>
                  </div>
                </div>

                <div className="space-y-6 max-w-lg">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">Profile Overview</p>
                    <p className="text-white text-lg font-bold leading-relaxed">{matchedCandidate.description}</p>
                  </div>
                  
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-3">Key Policy Match</p>
                    <p className="text-white/90 text-sm font-medium leading-relaxed italic">
                      "{matchedCandidate.policy}"
                    </p>
                  </div>

                  <div className="pt-6">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4">Why this match?</p>
                    <p className="text-white/60 text-xs font-medium leading-relaxed">
                      Based on your priority for <span className="text-white font-black uppercase">{selectedPriority}</span>, {matchedCandidate.name}'s platform is the most compatible as they dedicate over 80% of their legislative focus to these specific outcomes.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center md:text-left">
                Disclaimer: This is a demo for educational purposes. <br/>Real election matching involves complex data analysis.
              </p>
              <Button 
                onClick={() => { setStep('intro'); setSelectedPriority(null); }}
                variant="outline"
                className="w-full md:w-auto px-8 py-4 bg-white/5 text-white border-white/10 rounded-2xl font-black uppercase tracking-widest hover:bg-white/10"
              >
                <RotateCcw size={16} className="mr-2" />
                Retake Simulation
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
