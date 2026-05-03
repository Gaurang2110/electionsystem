"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, Sparkles, X } from "lucide-react";
import { usePathname } from "@/i18n/navigation";
import { systemOrchestrator } from "@/lib/systemOrchestrator";
import { cn } from "@/utils/cn";

export const NeedHelpBadge: React.FC = () => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = React.useState(true);
  
  // Don't show on assistant page or onboarding
  const isExcluded = pathname === "/assistant" || pathname === "/onboarding";

  if (isExcluded) return null;

  const handleHelp = () => {
    // Generate context-aware prompt based on current page
    let query = "Can you help me understand what to do on this page?";
    
    if (pathname === "/") {
      query = "Help me understand my voting readiness dashboard and what I should do next.";
    } else if (pathname === "/journey") {
      query = "How do I complete my voter registration journey?";
    } else if (pathname === "/map") {
      query = "Help me find my polling booth and understand the map features.";
    } else if (pathname === "/eligibility") {
      query = "Help me verify my eligibility to vote in the upcoming elections.";
    } else if (pathname === "/ballot") {
      query = "Explain how the mock ballot works and how to practice voting.";
    } else if (pathname === "/laboratory") {
      query = "What is the Laboratory? Help me explore the technical side of voting.";
    } else if (pathname === "/insights") {
      query = "Help me understand these constituency insights and candidate data.";
    }

    systemOrchestrator.openAssistant({ 
      page: pathname,
      query: query
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-8 right-8 z-[90] group"
        >
          {/* Main Badge */}
          <motion.button
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleHelp}
            className="flex items-center gap-3 px-6 py-4 bg-slate-900 text-white rounded-full shadow-2xl shadow-slate-900/30 border border-white/10 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative z-10 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <HelpCircle size={18} />
              </div>
              <span className="text-sm font-black uppercase tracking-widest">Need Help?</span>
              <Sparkles size={14} className="text-amber-400 animate-pulse" />
            </div>
          </motion.button>

          {/* Close Trigger */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsVisible(false);
            }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center border border-white/10 hover:bg-red-500 hover:text-white transition-colors shadow-lg opacity-0 group-hover:opacity-100"
          >
            <X size={12} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
