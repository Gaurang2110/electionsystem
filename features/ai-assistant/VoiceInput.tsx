"use client";
import * as React from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  locale: string;
  disabled?: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, locale, disabled }) => {
  const [isListening, setIsListening] = React.useState(false);
  const [isSupported, setIsSupported] = React.useState(true);
  const recognitionRef = React.useRef<any>(null);

  React.useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    
    // Map locale to BCP 47 language tag
    const langMap: Record<string, string> = {
      'en': 'en-IN',
      'hi': 'hi-IN',
      'gu': 'gu-IN',
      'bn': 'bn-IN',
      'mr': 'mr-IN'
    };
    recognition.lang = langMap[locale] || 'en-IN';

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript || interimTranscript) {
        onTranscript(finalTranscript || interimTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [locale, onTranscript]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.error("Failed to start recognition:", err);
      }
    }
  };

  if (!isSupported) return null;

  return (
    <div className="relative">
      <button
        onClick={toggleListening}
        disabled={disabled}
        className={cn(
          "p-3.5 rounded-2xl transition-all relative overflow-hidden group",
          isListening 
            ? "bg-rose-500 text-white shadow-lg shadow-rose-500/40" 
            : "bg-slate-800 text-slate-400 hover:text-white border border-white/5 hover:border-white/10"
        )}
        title={isListening ? "Stop listening" : "Speak to ask"}
      >
        <AnimatePresence mode="wait">
          {isListening ? (
            <motion.div
              key="listening"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              <MicOff size={18} strokeWidth={3} />
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
            >
              <Mic size={18} strokeWidth={3} />
            </motion.div>
          )}
        </AnimatePresence>
        
        {isListening && (
          <motion.div 
            layoutId="pulse"
            className="absolute inset-0 bg-white/20"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        )}
      </button>

      {isListening && (
        <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-2 bg-slate-900 border border-white/10 rounded-xl shadow-2xl text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
          <div className="flex gap-0.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ height: [4, 12, 4] }}
                transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                className="w-1 bg-primary rounded-full"
              />
            ))}
          </div>
          Listening...
        </div>
      )}
    </div>
  );
};
