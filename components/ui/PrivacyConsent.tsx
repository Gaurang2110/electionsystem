"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Lock, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/utils/cn";

export const PrivacyConsent: React.FC = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const t = useTranslations('common');

  React.useEffect(() => {
    const consent = localStorage.getItem('civic-ai-privacy-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('civic-ai-privacy-consent', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-6 bg-slate-950/20 backdrop-blur-sm">
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 shadow-premium overflow-hidden relative"
          >
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20 shadow-lg shadow-primary/10">
                  <ShieldCheck size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white font-display tracking-tight uppercase">Privacy First</h3>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-0.5">Secure Local Storage</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <Lock size={18} className="text-primary mt-0.5 shrink-0" />
                  <p className="text-slate-300 text-sm font-bold leading-relaxed">
                    We value your privacy. All your personal information, progress, and badges are <span className="text-white">stored locally</span> on your device. We do not track your specific voting choices.
                  </p>
                </div>
                <p className="text-slate-500 text-xs font-bold leading-relaxed px-1">
                  By using this application, you agree to our local data storage policy designed for maximum privacy and offline accessibility.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAccept}
                className="w-full py-5 bg-primary text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-3"
              >
                <Check size={18} strokeWidth={4} />
                I Understand & Accept
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
