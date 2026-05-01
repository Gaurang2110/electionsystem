"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { Bell, User, Sparkles, Accessibility, WifiOff, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Link } from "@/i18n/navigation";
import { NotificationPanel } from "./NotificationPanel";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/utils/cn";

export const Header: React.FC = () => {
  const t = useTranslations('common');
  const [isNotifOpen, setIsNotifOpen] = React.useState(false);
  const { notifications, isSimpleMode, toggleSimpleMode, isHighContrast, toggleHighContrast } = useAppStore();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  React.useEffect(() => {
    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [isHighContrast]);

  return (
    <header className="relative z-50 flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-6 md:py-12">
      <div className="flex flex-col">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 mb-1"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
          <p className="text-slate-500 text-[10px] font-black tracking-[0.2em] uppercase">
            {t('hi')}, Gaurang
          </p>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="text-2xl md:text-3xl font-black text-white font-display leading-none tracking-tight flex items-center gap-2"
        >
          {t('election_year')}
          <Sparkles size={20} className="text-primary animate-pulse" />
          <div className="flex items-center gap-2 ml-2">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <WifiOff size={10} className="text-emerald-500" />
              <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500">Offline Ready</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
              <ShieldCheck size={10} className="text-blue-500" />
              <span className="text-[8px] font-black uppercase tracking-widest text-blue-500">Secure System</span>
            </div>
          </div>
        </motion.h1>
      </div>
      <div className="flex items-center gap-4">
        {/* Simple Mode Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleSimpleMode}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all font-black text-[10px] uppercase tracking-widest",
            isSimpleMode 
              ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
              : "bg-slate-900/60 text-slate-400 border-white/5"
          )}
        >
          <Accessibility size={isSimpleMode ? 24 : 18} />
          {isSimpleMode ? "Simple Mode ON" : "Simple Mode"}
        </motion.button>

        {/* High Contrast Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleHighContrast}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all font-black text-[10px] uppercase tracking-widest",
            isHighContrast 
              ? "bg-yellow-400 text-black border-yellow-400 shadow-lg" 
              : "bg-slate-900/60 text-slate-400 border-white/5"
          )}
        >
          {isHighContrast ? "Contrast: HIGH" : "High Contrast"}
        </motion.button>

        <div className="hidden md:block">
          <LanguageSwitcher />
        </div>
        <div className="flex items-center gap-2 relative">
          <motion.button 
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={cn(
              "bg-slate-900/60 rounded-xl flex items-center justify-center text-slate-400 shadow-3d border border-white/5 hover:text-white transition-all backdrop-blur-xl relative",
              isSimpleMode ? "w-14 h-14" : "w-10 h-10 md:w-12 md:h-12"
            )}
          >
            <Bell size={isSimpleMode ? 24 : 18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#0f172a]">
                {unreadCount}
              </span>
            )}
          </motion.button>

          <NotificationPanel isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />

          <Link href="/profile">
            <motion.button 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "bg-slate-900/60 rounded-xl flex items-center justify-center text-slate-100 shadow-3d border border-white/5 p-1 overflow-hidden backdrop-blur-xl",
                isSimpleMode ? "w-14 h-14" : "w-10 h-10 md:w-12 md:h-12"
              )}
            >
              <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/10 rounded-lg flex items-center justify-center border border-white/10 shadow-inner">
                <User size={isSimpleMode ? 24 : 18} className="text-primary" />
              </div>
            </motion.button>
          </Link>
        </div>
      </div>
    </header>
  );
};
