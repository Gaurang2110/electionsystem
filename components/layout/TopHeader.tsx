"use client";
import * as React from "react";
import { Search, Bell, Sparkles, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { NotificationPanel } from "@/components/ui/NotificationPanel";
import { useAppStore } from "@/store/useAppStore";
import { Link } from "@/i18n/navigation";
import { cn } from "@/utils/cn";

export const TopHeader: React.FC = () => {
  const [isNotifOpen, setIsNotifOpen] = React.useState(false);
  const { profile, notifications } = useAppStore();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="h-[72px] flex items-center justify-between px-8 relative z-40 bg-white/60 backdrop-blur-xl border-b border-white/10 shadow-[0_1px_10px_rgba(0,0,0,0.02)]">
      <div className="flex-1 max-w-2xl">
        <div className="relative group">
          <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search elections..."
            className="w-full bg-slate-50/50 border border-slate-200/50 rounded-full py-3 pl-12 pr-28 text-[13px] font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400 shadow-sm"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-white border border-slate-200/50 rounded-lg text-[10px] font-black text-slate-400 mr-2 shadow-xs">
               <span>⌘</span>
               <span>K</span>
            </div>
            <Link href="/assistant">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 hover:bg-primary/20 transition-all shadow-sm border border-primary/20"
              >
                <Sparkles size={12} className="animate-pulse" />
                <span className="uppercase tracking-widest text-[10px]">Ask AI</span>
              </motion.button>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-5 ml-6">
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="w-10 h-10 rounded-full bg-white/80 border border-slate-200/50 flex items-center justify-center text-slate-500 shadow-sm relative hover:bg-white transition-colors"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
              )}
            </motion.button>
            <NotificationPanel isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
          </div>
        </div>

        <div className="h-8 w-px bg-slate-200/50" />

        <Link href="/profile">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="text-right hidden md:block">
              <p className="text-[12px] font-bold text-slate-900 leading-none">{profile.name || "Aarav Sharma"}</p>
              <p className="text-[10px] font-medium text-slate-500 mt-1">First-time Voter</p>
            </div>
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg overflow-hidden border-2 border-white ring-1 ring-slate-200">
                 <img 
                   src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav" 
                   alt="User Avatar" 
                   className="w-full h-full object-cover"
                 />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-secondary rounded-full border-2 border-white shadow-sm" />
            </div>
            <ChevronDown size={14} className="text-slate-400 group-hover:text-primary transition-colors" />
          </motion.div>
        </Link>
      </div>
    </header>
  );
};
