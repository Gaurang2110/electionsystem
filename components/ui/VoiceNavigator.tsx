"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Waves } from "lucide-react";
import { useVoiceControl } from "@/hooks/useVoiceControl";
import { cn } from "@/utils/cn";

export const VoiceNavigator: React.FC = () => {
  const { isListening, transcript, toggleListening, hasSupport } = useVoiceControl();

  if (!hasSupport) return null;

  return (
    <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-6 pointer-events-none">
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="px-8 py-4 bg-slate-900/90 backdrop-blur-xl border border-primary/30 rounded-3xl shadow-3xl flex flex-col items-center gap-3 pointer-events-auto min-w-[280px]"
          >
            <div className="flex items-center gap-3">
              <div className="flex gap-1 h-4 items-center">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [8, 16, 8] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                    className="w-1 bg-primary rounded-full"
                  />
                ))}
              </div>
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Listening...</span>
            </div>
            
            <p className="text-sm font-bold text-white text-center italic opacity-80 min-h-[1.25rem]">
              {transcript || "Try: 'What should I do next?'"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        id="voice-trigger"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleListening}
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center shadow-3xl border-4 transition-all pointer-events-auto relative overflow-hidden",
          isListening 
            ? "bg-rose-500 border-rose-400/50 text-white" 
            : "bg-slate-900 border-white/5 text-primary hover:border-primary/30"
        )}
      >
        {isListening ? (
          <div className="relative z-10 flex flex-col items-center">
            <MicOff size={24} strokeWidth={3} />
          </div>
        ) : (
          <div className="relative z-10 flex flex-col items-center">
            <Mic size={24} strokeWidth={3} />
          </div>
        )}

        {/* Animated Background Pulse */}
        {isListening && (
          <>
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-rose-400 rounded-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </>
        )}
      </motion.button>
    </div>
  );
};
