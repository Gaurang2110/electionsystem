"use client";
import * as React from "react";
import {
  Send, User, Sparkles, Loader2, RefreshCw,
  ThumbsUp, ThumbsDown, Copy, MapPin,
  FileText, CheckCircle, PlayCircle, Mic,
  ChevronRight, MoreHorizontal
} from "lucide-react";
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
  status?: "sent" | "delivered" | "read";
}

const QUICK_ACTIONS = [
  { id: "next", icon: ChevronRight, key: "next" },
  { id: "polling", icon: MapPin, key: "polling" },
  { id: "docs", icon: FileText, key: "docs" },
  { id: "eligibility", icon: CheckCircle, key: "eligibility" },
];

export const ChatInterface: React.FC = () => {
  const t = useTranslations('chat');
  const locale = useLocale();
  const { profile } = useAppStore();

  // Use session storage for messages to keep them per session only
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const msgCount = React.useRef(0);

  // Initialize and load from session storage
  React.useEffect(() => {
    const saved = sessionStorage.getItem("civic_ai_chat_session");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Revive dates
      const revived = parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
      setMessages(revived);
      msgCount.current = revived.length;
    } else {
      const welcomeMsg = { id: "1", text: t('welcome'), sender: "ai", timestamp: new Date() };
      setMessages([welcomeMsg]);
      msgCount.current = 1;
    }
  }, [t]);

  // Save to session storage
  React.useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem("civic_ai_chat_session", JSON.stringify(messages));
    }
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    setError(null);
    msgCount.current += 1;
    const userMsg: Message = {
      id: msgCount.current.toString(),
      text,
      sender: "user",
      timestamp: new Date(),
      status: "read"
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const { getReadinessScore, getNextBestAction } = useAppStore.getState();
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
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto relative px-4">

      {/* HEADER SECTION (STATIC) */}
      <div className="flex items-center justify-between py-4 px-2 shrink-0">
        <div className="relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-black text-slate-900 font-display tracking-tight"
          >
            Hello {profile.name || "Aarav"}! 👋
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 font-medium text-xs mt-1 leading-relaxed"
          >
            Your Civic AI assistant is ready.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full  h-full md:w-80"
        >
          <img
            src="/civic_ai_assistant_mascot.png"
            alt="Civic AI Mascot"
            className="w-full h-full object-contain relative z-10"
          />
        </motion.div>
      </div>

      {/* MESSAGES AREA (SCROLLABLE) */}
      <div className="flex-1 overflow-y-auto px-2 space-y-6 pb-10 scroll-smooth no-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex w-full group",
                msg.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn(
                "flex max-w-[90%] md:max-w-[75%] gap-3",
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              )}>
                {/* Avatar (Smaller) */}
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md border-2 border-white",
                  msg.sender === "user"
                    ? "bg-primary text-white"
                    : "bg-gradient-to-br from-indigo-600 to-purple-600 text-white"
                )}>
                  {msg.sender === "user" ? <User size={20} /> : <Sparkles size={20} />}
                </div>

                {/* Content Card (Smaller Padding) */}
                <div className="flex flex-col gap-1">
                  <div className={cn(
                    "flex items-center gap-2 px-1",
                    msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                  )}>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {msg.sender === "ai" ? "Civic AI" : "You"}
                    </span>
                    <span className="text-[9px] font-medium text-slate-300">
                      {msg.timestamp.toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit', hour12: true })}
                    </span>
                  </div>

                  <div className={cn(
                    "px-5 py-3.5 rounded-2xl text-[15px] font-medium leading-relaxed shadow-lg relative",
                    msg.sender === "user"
                      ? "bg-primary/10 text-slate-800 border border-primary/20 rounded-tr-none"
                      : "bg-white text-slate-700 rounded-tl-none border border-slate-100"
                  )}>
                    {msg.text}

                    {/* AI Feedback / Tools (Tighter) */}
                    {msg.sender === "ai" && (
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
                        <div className="flex items-center gap-0.5">
                          <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-primary transition-colors">
                            <ThumbsUp size={14} />
                          </button>
                          <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-primary transition-colors">
                            <ThumbsDown size={14} />
                          </button>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-primary transition-colors">
                            <Copy size={14} />
                          </button>
                          <SpeakerButton
                            text={msg.text}
                            className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-primary transition-colors"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center animate-pulse">
                <Sparkles size={20} className="text-slate-400" />
              </div>
              <div className="px-5 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                <Loader2 size={16} className="animate-spin text-primary" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Civic AI is thinking...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={scrollRef} className="h-4" />
      </div>

      {/* INPUT STICKY BAR (FIXED HEIGHT) */}
      <div className="shrink-0 pt-4 pb-2 bg-slate-50/50 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto space-y-3 px-2">

          {/* QUICK ACTION SUGGESTIONS (SMALLER) */}
          {!isLoading && (
            <div className="flex gap-2  pb-1 no-scrollbar justify-center">
              {QUICK_ACTIONS.map((action) => (
                <motion.button
                  key={action.id}
                  whileHover={{ y: -2, backgroundColor: "rgba(255,255,255,1)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSend(t(`suggestions.${action.key}`))}
                  className="flex items-center gap-2 px-3.5 py-2 bg-white/90 backdrop-blur-xl border border-slate-100 rounded-xl shadow-sm group transition-all shrink-0"
                >
                  <div className="w-5 h-5 bg-primary/5 rounded-md flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <action.icon size={12} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600 whitespace-nowrap">{t(`suggestions.${action.key}`)}</span>
                </motion.button>
              ))}
            </div>
          )}

          {/* MAIN INPUT BOX (COMPACT) */}
          <div className="relative group mb-10">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-purple-500/10 to-accent/10 rounded-3xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <div className="relative bg-white/95 backdrop-blur-2xl border border-slate-200 group-focus-within:border-primary/40 rounded-3xl px-3 py-2 flex items-center gap-2 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.1)]">
              <div className="flex-1 px-3">
                <input
                  type="text"
                  value={input}
                  disabled={isLoading}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend(input)}
                  placeholder="Ask anything..."
                  className="w-full bg-transparent border-none focus:outline-none py-1.5 text-[15px] font-medium text-slate-700 placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center gap-1.5 pr-1">
                <VoiceInput
                  locale={locale}
                  onTranscript={(text) => setInput(text)}
                  disabled={isLoading}
                />
                <button
                  onClick={() => handleSend(input)}
                  disabled={isLoading || !input.trim()}
                  className="p-2.5 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50 hover:brightness-105 flex items-center justify-center"
                >
                  <Send size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COMPACT FLOATING MIC */}
      {/* <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-2xl z-[100] border border-white/10"
      >
        <Mic size={24} />
      </motion.button> */}

    </div>
  );
};
