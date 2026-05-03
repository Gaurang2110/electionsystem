"use client";
import * as React from "react";
import { usePathname } from "@/i18n/navigation";
import { TopHeader } from "./TopHeader";
import { PageTransition } from "@/components/ui/PageTransition";
import { TrustBadges } from "@/components/ui/TrustBadges";
import { LegalDisclaimer } from "@/components/ui/LegalDisclaimer";
import { Link, useRouter } from "@/i18n/navigation";
import { Card } from "@/components/ui/Card";
import { MessageSquare, Bot, Sparkles } from "lucide-react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { ProfileOnboardingModal } from "@/components/ui/ProfileOnboardingModal";
import { NotificationPanel } from "@/components/ui/NotificationPanel";
import { NextStepBar } from "@/components/ui/NextStepBar";
import { useAppStore } from "@/store/useAppStore";
import { systemOrchestrator } from "@/lib/systemOrchestrator";

const ProactiveHint = () => {
  const { progress, eligibility, gamification } = useAppStore();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) return null;

  let hintMessage = "";

  if (pathname === '/' && progress < 40 && eligibility.status === 'not-checked') {
    hintMessage = "You haven't checked eligibility yet. Want help?";
  } else if (pathname.includes('/journey')) {
    if (!gamification.questSteps.register) hintMessage = "Next step: Register to vote. Need guidance?";
    else if (!gamification.questSteps.locate) hintMessage = "Next step: Find your booth. Shall I help?";
    else hintMessage = "You're making great progress. Any questions?";
  }

  if (!hintMessage) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="absolute bottom-full mb-4 right-0 bg-indigo-600 text-white text-[11px] font-bold px-4 py-3 rounded-2xl rounded-br-none shadow-xl border border-indigo-500 whitespace-nowrap z-50"
    >
      <div className="flex items-center gap-2">
        <Sparkles size={14} className="text-indigo-200" />
        <span>{hintMessage}</span>
        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsVisible(false); }} className="ml-2 opacity-50 hover:opacity-100 p-1">×</button>
      </div>
      <div className="absolute -bottom-2 right-4 w-4 h-4 bg-indigo-600 transform rotate-45 border-r border-b border-indigo-500" />
    </motion.div>
  );
};

export const ClientLayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isNotificationOpen = useAppStore(s => s.isNotificationOpen);
  const setNotificationOpen = useAppStore(s => s.setNotificationOpen);
  const isSimpleMode = useAppStore(s => s.isSimpleMode);
  const isHighContrast = useAppStore(s => s.isHighContrast);
  const pathname = usePathname();
  const router = useRouter();
  const isAssistant = pathname.includes('/assistant');

  const getContextualPrompt = () => {
    return pathname === '/' ? "Help me with my dashboard overview" :
      pathname.includes('/journey') ? "Tell me more about my civic journey" :
        pathname.includes('/map') ? "How do I find my polling booth?" :
          pathname.includes('/eligibility') ? "Can you check my voting eligibility details?" :
            pathname.includes('/documents') ? "What documents do I need for voter registration?" :
              pathname.includes('/insights') ? "Explain these constituency insights to me" :
                pathname.includes('/profile') ? "Help me manage my voter profile" :
                  "How can I use this screen?";
  };

  React.useEffect(() => {
    const handleOpenAssistant = (e: any) => {
      const query = e.detail?.query || getContextualPrompt();
      router.push(`/assistant?prompt=${encodeURIComponent(query)}`);
    };
    window.addEventListener('open-ai-assistant', handleOpenAssistant);
    return () => window.removeEventListener('open-ai-assistant', handleOpenAssistant);
  }, [router, pathname]);

  return (
    <div className={cn(
      "flex-1 ml-[240px] flex flex-col min-h-screen relative transition-all duration-300",
      isAssistant && "h-screen overflow-hidden",
      isSimpleMode && "text-lg simple-mode",
      isHighContrast && "high-contrast bg-black text-white"
    )}>
      <ProfileOnboardingModal />
      <NotificationPanel isOpen={isNotificationOpen} onClose={() => setNotificationOpen(false)} />
      <TopHeader />
      <main className={cn(
        "flex-1 p-6 max-w-[1600px] mx-auto w-full",
        isAssistant && "p-0 h-full overflow-hidden flex flex-col"
      )}>
        <PageTransition className={cn(isAssistant && "flex-1 overflow-hidden flex flex-col")}>
          {children}
        </PageTransition>

        {!isAssistant && (
          <>
            <NextStepBar />
            <TrustBadges variant="minimal" className="mt-16 mb-10" />
            <LegalDisclaimer className="mb-10 opacity-50" />
          </>
        )}
      </main>

      {/* Universal Floating "Need Help?" Badge */}
      {!isAssistant && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-8 right-8 z-[200]"
        >
          <ProactiveHint />
          <div onClick={() => systemOrchestrator.openAssistant({ query: getContextualPrompt() })}>
            <div className="flex items-center gap-4 pl-3 pr-6 py-3 rounded-full bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.15)] group cursor-pointer hover:bg-white transition-all">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:rotate-12 transition-transform">
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                >
                  <Bot size={22} className="fill-white/20" />
                </motion.div>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] leading-none mb-1">Civic AI</span>
                <span className="text-sm font-black text-slate-800 leading-tight">Need Help?</span>
              </div>

              {/* Pulse effect */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
