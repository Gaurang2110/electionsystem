"use client";
import * as React from "react";
import { usePathname } from "@/i18n/navigation";
import { TopHeader } from "./TopHeader";
import { PageTransition } from "@/components/ui/PageTransition";
import { TrustBadges } from "@/components/ui/TrustBadges";
import { LegalDisclaimer } from "@/components/ui/LegalDisclaimer";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/Card";
import { MessageSquare, Bot } from "lucide-react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { ProfileOnboardingModal } from "@/components/ui/ProfileOnboardingModal";
import { NotificationPanel } from "@/components/ui/NotificationPanel";
import { useAppStore } from "@/store/useAppStore";

export const ClientLayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isNotificationOpen, setNotificationOpen } = useAppStore();
  const pathname = usePathname();
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

  return (
    <div className={cn(
      "flex-1 ml-[240px] flex flex-col min-h-screen relative",
      isAssistant && "h-screen overflow-hidden"
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
            <TrustBadges variant="minimal" className="mt-20 mb-10" />
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
          <Link href={`/assistant?prompt=${encodeURIComponent(getContextualPrompt())}`}>
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
          </Link>
        </motion.div>
      )}
    </div>
  );
};
