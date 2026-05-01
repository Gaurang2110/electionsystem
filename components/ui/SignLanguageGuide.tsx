"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserRoundCheck, X, Play, Eye } from "lucide-react";
import { cn } from "@/utils/cn";

type GuideType = 'registration' | 'map' | 'voting';

interface SignLanguageGuideProps {
  type: GuideType;
  className?: string;
}

const GUIDE_METADATA: Record<GuideType, { title: string, video: string }> = {
  registration: { title: "Registration Guide", video: "/videos/reg.mp4" },
  map: { title: "Booth Finder Guide", video: "/videos/map.mp4" },
  voting: { title: "Voting Process Guide", video: "/videos/vote.mp4" },
};

export const SignLanguageGuide: React.FC<SignLanguageGuideProps> = ({ type, className }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const metadata = GUIDE_METADATA[type];

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          "w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-primary shadow-xl hover:bg-slate-800 transition-all",
          className
        )}
        title="Sign Language Guide"
      >
        <UserRoundCheck size={20} strokeWidth={2.5} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-3xl"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <UserRoundCheck size={18} />
                  </div>
                  <h3 className="font-black text-white font-display uppercase tracking-tight">{metadata.title}</h3>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-500 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="aspect-video bg-black relative flex items-center justify-center">
                <video 
                  controls 
                  autoPlay 
                  className="w-full h-full object-cover"
                  preload="metadata"
                  poster="/images/video-placeholder.jpg"
                >
                  <source src={metadata.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              <div className="p-6 bg-slate-950/50">
                <p className="text-xs font-medium text-slate-400 leading-relaxed text-center">
                  This sign language guide is provided for voters with hearing impairments. 
                  All videos are stored locally on your device for offline access.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
