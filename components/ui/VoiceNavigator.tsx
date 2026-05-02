"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, MessageSquare } from "lucide-react";
import { useVoiceControl } from "@/hooks/useVoiceControl";
import { cn } from "@/utils/cn";
import { useRouter } from "@/i18n/navigation";

export const VoiceNavigator: React.FC = () => {
  const { isListening, transcript, toggleListening, hasSupport } = useVoiceControl();
  const router = useRouter();
  const [showTooltip, setShowTooltip] = React.useState(false);
  const longPressTimer = React.useRef<NodeJS.Timeout | null>(null);

  if (!hasSupport) return null;

  const handlePointerDown = () => {
    longPressTimer.current = setTimeout(() => {
      if (!isListening) toggleListening();
    }, 500);
  };

  const handlePointerUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleClick = () => {
    // Single click navigates to assistant
    router.push("/assistant");
  };

  return (
    <div className="fixed bottom-12 right-12 z-[100] flex flex-col items-end gap-6">
      {/* PREMIUM TRANSCRIPT POPOVER */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            className="mb-6 px-8 py-6 bg-slate-950/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] flex flex-col items-start gap-4 min-w-[280px] max-w-[360px] overflow-hidden"
          >
            {/* Decorative Glow */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -ml-16 -mt-16" />
            
            <div className="relative z-10 flex items-center gap-4">
              <div className="flex gap-1.5 h-4 items-center">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [8, 16, 8] }}
                    transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                    className="w-1.5 bg-primary rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                  />
                ))}
              </div>
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">AI Voice Active</span>
            </div>
            <p className="relative z-10 text-base font-bold text-white leading-relaxed italic opacity-95">
              "{transcript || "Listening for command..."}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PREMIUM FAB BUTTON */}
      <div className="relative group">
        <AnimatePresence>
          {showTooltip && !isListening && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className="absolute right-full mr-6 top-1/2 -translate-y-1/2 px-6 py-3 bg-slate-950/90 backdrop-blur-2xl text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl whitespace-nowrap shadow-2xl border border-white/10"
            >
              Ask anything about elections
              <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-slate-950/90 border-r border-t border-white/10 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          id="voice-trigger"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onClick={handleClick}
          onHoverStart={() => setShowTooltip(true)}
          onHoverEnd={() => setShowTooltip(false)}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            "w-24 h-24 rounded-[2.5rem] flex items-center justify-center shadow-[0_24px_48px_-12px_rgba(0,0,0,0.4)] transition-all relative overflow-hidden group",
            isListening 
              ? "bg-rose-500 text-white" 
              : "bg-slate-900 border border-white/10 text-white"
          )}
        >
          {/* Pulsing Background Layers */}
          <AnimatePresence>
            {!isListening && (
              <>
                <motion.div 
                  animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0, 0.2] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="absolute inset-0 bg-primary/40 rounded-[2.5rem] pointer-events-none"
                />
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 0.5 }}
                  className="absolute inset-0 bg-accent/20 rounded-[2.5rem] pointer-events-none"
                />
              </>
            )}
          </AnimatePresence>

          {/* Dynamic Content */}
          <div className="relative z-20">
            {isListening ? (
              <MicOff size={32} className="text-white drop-shadow-lg" />
            ) : (
              <div className="relative">
                 <Mic size={32} className="group-hover:hidden transition-all duration-300 drop-shadow-lg text-primary" />
                 <MessageSquare size={32} className="hidden group-hover:block animate-in fade-in zoom-in duration-500 text-white drop-shadow-lg" />
              </div>
            )}
          </div>

          {/* Liquid Glass Background */}
          <div className={cn(
            "absolute inset-0 transition-opacity duration-500",
            isListening ? "opacity-100 bg-rose-600" : "opacity-30 bg-gradient-to-tr from-primary via-accent to-indigo-500"
          )} />
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-[1px] bg-white/20 z-10" />
        </motion.button>
      </div>
    </div>
  );
};
