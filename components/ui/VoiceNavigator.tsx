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
    <div className="fixed bottom-10 right-10 z-[100] flex flex-col items-end gap-4">
      {/* Transcript Popover */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, x: 20, scale: 0.9 }}
            className="mb-4 px-6 py-4 bg-slate-900/95 backdrop-blur-2xl border border-primary/30 rounded-[2rem] shadow-2xl flex flex-col items-start gap-3 min-w-[240px] max-w-[320px]"
          >
            <div className="flex items-center gap-3">
              <div className="flex gap-1 h-3 items-center">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [6, 12, 6] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                    className="w-1 bg-primary rounded-full"
                  />
                ))}
              </div>
              <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Voice Active</span>
            </div>
            <p className="text-sm font-bold text-white italic opacity-90">
              {transcript || "Listening for command..."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Mic Button */}
      <div className="relative group">
        <AnimatePresence>
          {showTooltip && !isListening && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 10 }}
              className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl whitespace-nowrap shadow-xl border border-white/5"
            >
              Ask anything about elections
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
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all relative overflow-hidden group",
            isListening 
              ? "bg-rose-500 text-white" 
              : "bg-gradient-to-br from-primary to-accent text-white shadow-primary/40"
          )}
        >
          {/* Subtle Pulse Animation when Idle */}
          {!isListening && (
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute inset-0 bg-white rounded-full pointer-events-none"
            />
          )}

          {isListening ? (
            <MicOff size={28} className="relative z-10" />
          ) : (
            <div className="relative z-10">
               <Mic size={28} className="group-hover:hidden" />
               <MessageSquare size={28} className="hidden group-hover:block animate-in fade-in zoom-in duration-300" />
            </div>
          )}

          {/* Liquid background effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </motion.button>
      </div>
    </div>
  );
};
