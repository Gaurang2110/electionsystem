"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, X, ChevronRight, Zap, MapPin, Compass } from "lucide-react";
import { cn } from "@/utils/cn";

interface TourStep {
  id: string;
  targetId: string;
  title: string;
  description: string;
  icon: any;
  position: 'top' | 'bottom' | 'center';
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'readiness',
    targetId: 'tour-readiness',
    title: 'Track Your Readiness',
    description: 'This persistent bar shows your overall voting preparation in real-time. Reach 100% to unlock exclusive rewards.',
    icon: Zap,
    position: 'top'
  },
  {
    id: 'map',
    targetId: 'tour-map',
    title: 'Find Your Booth',
    description: 'Use the interactive map to locate your polling station and check live turnout trends in your area.',
    icon: MapPin,
    position: 'bottom'
  },
  {
    id: 'journey',
    targetId: 'tour-journey',
    title: 'Your Voting Roadmap',
    description: 'Complete your personalized journey steps here to ensure you have all documents and eligibility confirmed.',
    icon: Compass,
    position: 'bottom'
  }
];

export const GuidedTourOverlay: React.FC = () => {
  const [isActive, setIsActive] = React.useState(false);
  const [currentStepIdx, setCurrentStepIdx] = React.useState(0);
  const [spotlight, setSpotlight] = React.useState({ top: 0, left: 0, width: 0, height: 0 });

  const currentStep = TOUR_STEPS[currentStepIdx];

  const updateSpotlight = () => {
    const el = document.getElementById(currentStep.targetId);
    if (el) {
      const rect = el.getBoundingClientRect();
      setSpotlight({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      });
    }
  };

  React.useEffect(() => {
    if (isActive) {
      updateSpotlight();
      window.addEventListener('resize', updateSpotlight);
      const timer = setTimeout(() => {
          if (currentStepIdx < TOUR_STEPS.length - 1) {
              setCurrentStepIdx(prev => prev + 1);
          } else {
              setIsActive(false);
          }
      }, 5000); // Auto-progress after 5s
      return () => {
          window.removeEventListener('resize', updateSpotlight);
          clearTimeout(timer);
      };
    }
  }, [isActive, currentStepIdx]);

  const startTour = () => {
    setIsActive(true);
    setCurrentStepIdx(0);
  };

  return (
    <>
      <button 
        onClick={startTour}
        className="fixed bottom-32 left-8 z-[60] w-12 h-12 bg-slate-900 text-white rounded-full border border-white/10 shadow-2xl flex items-center justify-center hover:bg-slate-800 transition-all hover:scale-110 active:scale-95 group"
      >
        <Info size={20} className="text-primary group-hover:rotate-12 transition-transform" />
      </button>

      <AnimatePresence>
        {isActive && (
          <div className="fixed inset-0 z-[200] pointer-events-none">
            {/* Backdrop with Spotlight Hole */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm pointer-events-auto"
              style={{
                clipPath: `polygon(0% 0%, 0% 100%, ${spotlight.left}px 100%, ${spotlight.left}px ${spotlight.top}px, ${spotlight.left + spotlight.width}px ${spotlight.top}px, ${spotlight.left + spotlight.width}px ${spotlight.top + spotlight.height}px, ${spotlight.left}px ${spotlight.top + spotlight.height}px, ${spotlight.left}px 100%, 100% 100%, 100% 0%)`
              }}
              onClick={() => setIsActive(false)}
            />

            {/* Tooltip */}
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, y: currentStep.position === 'top' ? 20 : -20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                top: currentStep.position === 'top' ? spotlight.top + spotlight.height + 20 : 'auto',
                bottom: currentStep.position === 'bottom' ? (window.innerHeight - spotlight.top) + 20 : 'auto',
                left: Math.max(20, Math.min(window.innerWidth - 320, spotlight.left + (spotlight.width / 2) - 150))
              }}
              className="absolute w-[300px] p-6 bg-slate-900 border border-white/10 rounded-3xl shadow-3xl pointer-events-auto"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <currentStep.icon size={20} />
                </div>
                <button onClick={() => setIsActive(false)} className="text-slate-500 hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>

              <h3 className="text-lg font-black text-white font-display mb-1">{currentStep.title}</h3>
              <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6">{currentStep.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {TOUR_STEPS.map((_, i) => (
                    <div key={i} className={cn("w-1.5 h-1.5 rounded-full transition-all", i === currentStepIdx ? "w-4 bg-primary" : "bg-slate-700")} />
                  ))}
                </div>
                <button 
                  onClick={() => currentStepIdx < TOUR_STEPS.length - 1 ? setCurrentStepIdx(prev => prev + 1) : setIsActive(false)}
                  className="flex items-center gap-2 text-[10px] font-black uppercase text-primary tracking-widest hover:translate-x-1 transition-transform"
                >
                  {currentStepIdx === TOUR_STEPS.length - 1 ? "Finish" : "Next"}
                  <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
