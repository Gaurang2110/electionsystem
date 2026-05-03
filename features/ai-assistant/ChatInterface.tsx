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

import { useAppStore } from "@/store/useAppStore";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/navigation";
import { sendEventToCloud } from "@/lib/cloudLogging";

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
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const autoPrompt = searchParams.get('prompt');

  // Use session storage for messages to keep them per session only
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const msgCount = React.useRef(0);
  const promptAttempted = React.useRef(false);

  // Initialize and load from session storage
  React.useEffect(() => {
    setMounted(true);
    const saved = sessionStorage.getItem("civic_ai_chat_session");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Revive dates
      const revived = parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
      setMessages(revived);
    } else {
      const welcomeMsg: Message = { id: `ai-${crypto.randomUUID()}`, text: t('welcome'), sender: "ai", timestamp: new Date() };
      setMessages([welcomeMsg]);
    }
  }, [t]);

  // Handle auto-prompting separately, so it triggers even if session exists
  React.useEffect(() => {
    if (autoPrompt && mounted && !promptAttempted.current) {
      promptAttempted.current = true;
      
      // Clear the prompt from the URL immediately so reloads/back-navigation don't trigger it again
      router.replace(pathname, { scroll: false });
      
      setTimeout(() => {
        handleSend(autoPrompt);
      }, 100);
    }
  }, [autoPrompt, mounted, pathname, router]);

  // Save to session storage safely
  React.useEffect(() => {
    try {
      if (messages.length > 0) {
        sessionStorage.setItem("civic_ai_chat_session", JSON.stringify(messages));
      }
    } catch (e) {
      console.warn("Failed to save chat session:", e);
    }
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    setError(null);
    const userMsg: Message = {
      id: `user-${crypto.randomUUID()}`,
      text,
      sender: "user",
      timestamp: new Date(),
      status: "read"
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const { getReadinessScore, getNextBestAction, activityLog, eligibility } = useAppStore.getState();
    const readiness = getReadinessScore();
    const nextAction = getNextBestAction();
    const lastActivity = activityLog[0]?.type || "none";
    const currentScreen = pathname.split('/').pop() || "dashboard";

    try {
      console.log("Sending message to AI:", text);
      const response = await fetch(window.location.origin + "/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: 'no-store',
        body: JSON.stringify({
          message: text,
          locale: locale,
          userContext: {
            readiness,
            userName: profile.name,
            nextRecommendedAction: nextAction.label,
            isEligible: eligibility.status === 'eligible',
            lastActivity,
            currentScreen
          }
        })
      });

      const data = await response.json();
      console.log("AI Response received:", data);
      
      // Cloud Logging: AI Interaction
      sendEventToCloud('ai_interaction', {
        query: text,
        source: data.source || 'unknown',
        readiness: readiness
      });

      const aiMsg: Message = {
        id: `ai-${crypto.randomUUID()}`,
        text: data.text || data.error || "I'm sorry, I couldn't process that.",
        sender: "ai",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error("Chat Error:", err);
      setError("Something went wrong. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto relative px-4">

      {/* HEADER SECTION (COMPACT) */}
      <div className="flex items-center justify-between py-2 px-1 shrink-0 border-b border-slate-100/50 mb-2">
        <div className="relative z-10 py-1">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl md:text-2xl font-black text-slate-900 font-display tracking-tight"
          >
            Hello {profile.name || "Citizen"}! 👋
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-0.5"
          >
            Civic AI Election Assistant
          </motion.p>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-1.5 flex items-center gap-1.5 bg-indigo-50 w-fit px-2 py-0.5 rounded-full border border-indigo-100"
          >
            <Sparkles size={10} className="text-indigo-600" />
            <span className="text-[9px] font-bold text-indigo-600 tracking-wider uppercase">Powered by Google AI</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative h-12 w-24 md:w-32"
        >
          <img
            src="/civic_ai_assistant_mascot.png"
            alt="Civic AI Mascot"
            className="w-full h-full object-contain relative z-10 grayscale opacity-40 hover:opacity-100 hover:grayscale-0 transition-all cursor-help"
          />
        </motion.div>
      </div>

      {/* MESSAGES AREA (SCROLLABLE) */}
      <div className="flex-1 overflow-y-auto px-1 space-y-4 pb-6 scroll-smooth no-scrollbar">
        <AnimatePresence initial={false}>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-bold text-center mb-4"
            >
              {error}
            </motion.div>
          )}

          {messages.map((msg, idx) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex w-full group",
                msg.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn(
                "flex max-w-[92%] md:max-w-[80%] gap-2.5",
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              )}>
                {/* Avatar (Smaller) */}
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm border border-white/50 mt-1",
                  msg.sender === "user"
                    ? "bg-slate-900 text-white"
                    : "bg-gradient-to-br from-indigo-600 to-purple-600 text-white"
                )}>
                  {msg.sender === "user" ? <User size={14} /> : <Sparkles size={14} />}
                </div>

                {/* Content Card (Tight Padding) */}
                <div className="flex flex-col gap-0.5">
                  <div className={cn(
                    "flex items-center gap-2 px-1",
                    msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                  )}>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      {msg.sender === "ai" ? "Civic AI" : "You"}
                    </span>
                    <span className="text-[8px] font-bold text-slate-300">
                      {msg.timestamp.toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit', hour12: true })}
                    </span>
                  </div>

                  <div className={cn(
                    "px-4 py-3 rounded-2xl text-[14px] font-bold leading-relaxed shadow-sm relative border",
                    msg.sender === "user"
                      ? "bg-slate-50 text-slate-700 border-slate-100 rounded-tr-none"
                      : "bg-white text-slate-700 rounded-tl-none border-slate-100 shadow-slate-100"
                  )}>
                    {msg.text}

                    {/* AI Feedback / Tools (Very Compact) */}
                    {msg.sender === "ai" && (
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50">
                        <div className="flex items-center gap-0.5">
                          <button className="p-1 hover:bg-slate-50 rounded text-slate-300 hover:text-indigo-600 transition-colors">
                            <ThumbsUp size={12} />
                          </button>
                          <button className="p-1 hover:bg-slate-50 rounded text-slate-300 hover:text-indigo-600 transition-colors">
                            <ThumbsDown size={12} />
                          </button>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <button className="p-1 hover:bg-slate-50 rounded text-slate-300 hover:text-indigo-600 transition-colors">
                            <Copy size={12} />
                          </button>
                          <SpeakerButton
                            text={msg.text}
                            className="p-1 hover:bg-slate-50 rounded text-slate-300 hover:text-indigo-600 transition-colors"
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
              className="flex justify-start gap-2.5"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center animate-pulse border border-slate-100">
                <Sparkles size={14} className="text-slate-300" />
              </div>
              <div className="px-4 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2.5">
                <Loader2 size={14} className="animate-spin text-indigo-600" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Analyzing...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={scrollRef} className="h-2" />
      </div>

      {/* INPUT STICKY BAR (COMPACT) */}
      <div className="shrink-0 pt-2 pb-4 bg-white/40 backdrop-blur-md">
        <div className="max-w-3xl mx-auto space-y-2.5 px-1">

          {/* QUICK ACTION SUGGESTIONS (X-SMALL) */}
          {!isLoading && (
            <div className="flex gap-1.5  pb-1 no-scrollbar justify-center">
              {QUICK_ACTIONS.map((action) => (
                <motion.button
                  key={action.id}
                  whileHover={{ y: -1, backgroundColor: "rgba(255,255,255,1)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSend(t(`suggestions.${action.key}`))}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-xl shadow-sm group transition-all shrink-0"
                >
                  <div className="w-4 h-4 bg-indigo-50 rounded flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <action.icon size={10} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">{t(`suggestions.${action.key}`)}</span>
                </motion.button>
              ))}
            </div>
          )}

          {/* MAIN INPUT BOX (SLEEK) */}
          <div className="relative group mb-4">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-20 transition-opacity" />
            <div className="relative bg-white border border-slate-200 group-focus-within:border-indigo-300 rounded-2xl px-2 py-1.5 flex items-center gap-1 shadow-lg shadow-slate-200/50">
              <div className="flex-1 px-2">
                <input
                  type="text"
                  value={input}
                  disabled={isLoading}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend(input)}
                  placeholder="Ask your query..."
                  className="w-full bg-transparent border-none focus:outline-none py-1.5 text-[14px] font-bold text-slate-700 placeholder:text-slate-300"
                />
              </div>

              <div className="flex items-center gap-1 pr-0.5">

                <button
                  onClick={() => handleSend(input)}
                  disabled={isLoading || !input.trim()}
                  className="w-10 h-10 bg-slate-900 text-white rounded-xl shadow-lg active:scale-95 transition-all disabled:opacity-30 flex items-center justify-center group-hover:bg-indigo-600"
                >
                  <Send size={16} strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Google AI Info Section */}
          <div className="text-center pt-1 opacity-60 flex items-center justify-center">
            <span className="text-[9px] font-bold text-slate-400 tracking-wide">Built using Google Cloud & Gemini AI</span>
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
