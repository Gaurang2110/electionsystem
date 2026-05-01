"use client";
import * as React from "react";
import { Send, User, Bot, Sparkles, Loader2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import { useTranslations, useLocale } from "next-intl";
import { SpeakerButton } from "@/components/ui/SpeakerButton";
import { VoiceInput } from "./VoiceInput";
import { useAppStore } from "@/store/useAppStore";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

const SUGGESTION_KEYS = ["next", "register", "polling", "docs"];

export const ChatInterface: React.FC = () => {
  const t = useTranslations('chat');
  const locale = useLocale();
  const [messages, setMessages] = React.useState<Message[]>([
    { id: "1", text: t('welcome'), sender: "ai", timestamp: new Date() }
  ]);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const msgCount = React.useRef(1);


  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;
    
    setError(null);
    msgCount.current += 1;
    const userMsg: Message = { 
      id: msgCount.current.toString(), 
      text, 
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const { getReadinessScore, calculateProgress, getNextBestAction, profile } = useAppStore.getState();
    const readiness = getReadinessScore();
    const nextAction = getNextBestAction();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: text,
          locale: locale,
          userContext: {
            readiness,
            userName: profile.name,
            nextRecommendedAction: nextAction.label,
            isEligible: useAppStore.getState().eligibility.status === 'eligible'
          }
        })
      });
      
      const data = await response.json();
      
      msgCount.current += 1;
      setMessages(prev => [...prev, {
        id: msgCount.current.toString(),
        text: data.text || "I'm sorry, I couldn't process that.",
        sender: "ai",
        timestamp: new Date()
      }]);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-[calc(100vh-220px)] w-full mx-auto relative">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 space-y-8 pt-4 pb-12 no-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "flex items-start gap-4",
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg border",
                msg.sender === "user" 
                  ? "bg-primary text-white border-primary/20" 
                  : "bg-slate-900 text-primary border-white/5"
              )}>
                {msg.sender === "user" ? <User size={20} /> : <Sparkles size={20} />}
              </div>
              <div className={cn(
                "max-w-[85%] md:max-w-[70%] px-5 py-4 rounded-[1.5rem] text-[15px] font-medium leading-relaxed shadow-premium whitespace-pre-wrap relative group",
                msg.sender === "user" 
                  ? "bg-primary text-white rounded-tr-none" 
                  : "bg-slate-900/50 backdrop-blur-md text-slate-100 rounded-tl-none border border-white/5"
              )}>
                {msg.text}
                {msg.sender === "ai" && (
                  <SpeakerButton 
                    text={msg.text} 
                    className="absolute -right-10 top-0 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 border border-white/10" 
                  />
                )}
              </div>
            </motion.div>
          ))}
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center border border-white/5 text-primary">
                <Loader2 size={20} className="animate-spin" />
              </div>
              <div className="bg-slate-900/30 px-5 py-4 rounded-[1.5rem] rounded-tl-none border border-white/5">
                <div className="flex gap-1">
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                </div>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center p-4"
            >
              <div className="bg-rose-500/10 text-rose-400 px-4 py-2 rounded-xl text-xs font-bold border border-rose-500/20 flex items-center gap-2">
                <span>{error}</span>
                <button onClick={() => handleSend(messages[messages.length-1].text)} className="hover:rotate-180 transition-transform">
                  <RefreshCw size={14} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={scrollRef} className="h-4" />
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 left-0 right-0 px-4 md:px-8 py-8 bg-slate-950/80 backdrop-blur-2xl border-t border-white/5 space-y-6">
        {messages.length < 5 && !isLoading && (
          <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar px-1">
            {SUGGESTION_KEYS.map((key) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.02, backgroundColor: "rgba(99, 102, 241, 0.1)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSend(t(`suggestions.${key}`))}
                className="whitespace-nowrap px-6 py-3 bg-slate-900/50 text-slate-300 text-xs font-bold rounded-2xl border border-white/5 hover:text-primary transition-all shadow-sm"
              >
                {t(`suggestions.${key}`)}
              </motion.button>
            ))}
          </div>
        )}

        <div className="relative group max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            disabled={isLoading}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend(input)}
            placeholder={t('placeholder')}
            className="w-full bg-slate-900/60 border border-white/5 rounded-[2.5rem] px-7 py-5 text-[15px] font-medium text-white focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-2xl transition-all disabled:opacity-50 placeholder:text-slate-500"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <VoiceInput 
              locale={locale} 
              onTranscript={(text) => setInput(text)}
              disabled={isLoading}
            />
            <button 
              onClick={() => handleSend(input)}
              disabled={isLoading || !input.trim()}
              className="p-3.5 bg-primary text-white rounded-2xl shadow-lg shadow-primary/30 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale hover:brightness-110"
            >
              <Send size={18} strokeWidth={3} />
            </button>
          </div>
        </div>
        <p className="text-[10px] text-center text-slate-500 font-bold uppercase tracking-widest opacity-50">Powered by Civic AI 1.0</p>
      </div>
    </div>
  );
};
