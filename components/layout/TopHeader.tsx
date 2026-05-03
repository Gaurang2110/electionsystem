"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Sparkles,
  Bell,
  User,
  ChevronDown,
  MapPin,
  ShieldCheck,
  FileText,
  Milestone,
  LogOut,
  Settings,
  Command,
  Menu,
  X
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { systemOrchestrator } from "@/lib/systemOrchestrator";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/utils/cn";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { NotificationPanel } from "@/components/ui/NotificationPanel";

// --- SMART SEARCH COMPONENT ---
const SmartSearch: React.FC = () => {
  const t = useTranslations('search');
  const [query, setQuery] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const suggestions = [
    { label: t('find_booth'), path: "/map", icon: <MapPin size={14} />, keywords: ["booth", "map", "location", "where"] },
    { label: t('check_eligibility'), path: "/eligibility", icon: <ShieldCheck size={14} />, keywords: ["eligible", "vote", "can i", "age"] },
    { label: t('open_documents'), path: "/documents", icon: <FileText size={14} />, keywords: ["id", "aadhaar", "voter card", "docs"] },
    { label: t('start_journey'), path: "/journey", icon: <Milestone size={14} />, keywords: ["steps", "how to", "process", "guide"] }
  ];

  const filteredSuggestions = query.length > 0
    ? suggestions.filter(s =>
      s.label.toLowerCase().includes(query.toLowerCase()) ||
      s.keywords.some(k => k.includes(query.toLowerCase()))
    )
    : suggestions;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      setActiveIndex(prev => (prev + 1) % filteredSuggestions.length);
    } else if (e.key === "ArrowUp") {
      setActiveIndex(prev => (prev - 1 + filteredSuggestions.length) % filteredSuggestions.length);
    } else if (e.key === "Enter" && filteredSuggestions[activeIndex]) {
      router.push(filteredSuggestions[activeIndex].path);
      setIsOpen(false);
      setQuery("");
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // Keyboard shortcut (Cmd+K)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative w-full max-w-[420px] hidden lg:block">
      <div className={cn(
        "flex items-center gap-3 px-4 h-11 rounded-full border bg-white/50 transition-all duration-300",
        isOpen ? "border-primary ring-4 ring-primary/10 bg-white" : "border-slate-200/60 hover:border-slate-300"
      )}>
        <Search size={18} className="text-slate-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={t('placeholder')}
          className="flex-1 bg-transparent border-none outline-none text-[14px] font-medium text-slate-700 placeholder:text-slate-400"
        />
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-[10px] font-black text-slate-400">
          <Command size={10} />
          <span>K</span>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden py-2"
            >
              <div className="px-4 py-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('suggestions')}</p>
              </div>
              {filteredSuggestions.map((item, index) => (
                <button
                  key={item.label}
                  onClick={() => {
                    router.push(item.path);
                    setIsOpen(false);
                    setQuery("");
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 transition-all text-left",
                    index === activeIndex ? "bg-slate-50 text-primary" : "text-slate-600"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                    index === activeIndex ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-400"
                  )}>
                    {item.icon}
                  </div>
                  <span className="text-sm font-bold">{item.label}</span>
                </button>
              ))}
              {filteredSuggestions.length === 0 && (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-slate-400 font-medium">{t('no_results', { query })}</p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- READINESS BADGE COMPONENT ---
const ReadinessBadge: React.FC = () => {
  const progress = useAppStore(state => state.progress);

  const getColor = () => {
    if (progress >= 70) return "text-emerald-600 bg-emerald-50 border-emerald-100";
    if (progress >= 40) return "text-amber-600 bg-amber-50 border-amber-100";
    return "text-rose-600 bg-rose-50 border-rose-100";
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        const element = document.getElementById('readiness-card');
        element?.scrollIntoView({ behavior: 'smooth' });
      }}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-black tracking-widest transition-all shadow-sm",
        getColor()
      )}
    >
      <div className={cn(
        "w-2 h-2 rounded-full animate-pulse",
        progress >= 70 ? "bg-emerald-500" : progress >= 40 ? "bg-amber-500" : "bg-rose-500"
      )} />
      {progress}% READY
    </motion.button>
  );
};

// --- PROFILE DROPDOWN COMPONENT ---
const ProfileDropdown: React.FC = () => {
  const t = useTranslations('profile');
  const [isOpen, setIsOpen] = React.useState(false);
  const profile = useAppStore(state => state.profile);
  const voterType = useAppStore(state => state.voterType);
  const resetStore = useAppStore(state => state.resetStore);
  const router = useRouter();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
      >
        <div className="flex flex-col items-end hidden sm:flex">
          {/* <span className="text-[13px] font-black text-slate-900 leading-none">{profile.name || "Aarav Sharma"}</span> */}
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1">
            {voterType === 'first-time' ? t('first_time') : t('active_voter')}
          </span>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-slate-200 to-slate-100 border-2 border-white shadow-sm flex items-center justify-center text-slate-400 overflow-hidden">
          <User size={20} />
        </div>
        <ChevronDown size={14} className={cn("text-slate-400 transition-transform", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden p-2"
            >
              <button
                onClick={() => {
                  router.push('/profile');
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-600 transition-all"
              >
                <User size={16} />
                <span className="text-sm font-bold">{t('settings')}</span>
              </button>
              <button
                onClick={() => {
                  router.push('/profile');
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-600 transition-all"
              >
                <Settings size={16} />
                <span className="text-sm font-bold">{t('preferences')}</span>
              </button>
              <div className="h-px bg-slate-100 my-2" />
              <button
                onClick={() => {
                  resetStore();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-rose-50 text-rose-500 transition-all"
              >
                <LogOut size={16} />
                <span className="text-sm font-bold">{t('logout')}</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- MAIN TOP HEADER ---
export const TopHeader: React.FC = () => {
  const { notifications, setNotificationOpen, isSidebarOpen, setSidebarOpen } = useAppStore();
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-[100] w-full h-[72px] bg-white/70 backdrop-blur-[16px] border-b border-black/5 flex items-center px-4 md:px-8 gap-4 md:gap-8">
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Brand / Logo Section */}
      <div className="flex items-center gap-4 min-w-fit">
        <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20 shrink-0">
          <Sparkles size={22} />
        </div>
        <div className="flex flex-col hidden sm:flex">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-slate-900 leading-none tracking-tight">CIVIC GUIDE</span>
            <span className="text-[8px] px-1.5 py-0.5 rounded-sm bg-indigo-50 text-indigo-600 font-bold uppercase tracking-wider border border-indigo-100">Designed for First-Time Voters</span>
          </div>
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">AI Assistant</span>
        </div>
      </div>

      {/* Navigation Hub: Search */}
      <SmartSearch />

      {/* Action Center */}
      <div className="flex-1 flex items-center justify-end gap-3 md:gap-6">
        {/* Readiness Snapshot */}
        <ReadinessBadge />

        {/* Controls */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          {/* Notification Trigger */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setNotificationOpen(true)}
              className="w-11 h-11 rounded-full bg-white border border-slate-200/60 flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary/30 transition-all shadow-sm"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full" />
              )}
            </motion.button>
          </div>

          <div className="w-px h-8 bg-slate-200/60 mx-1 hidden sm:block" />

          {/* Profile Control */}
          <ProfileDropdown />
        </div>
      </div>
    </header>
  );
};
