"use client";
import * as React from "react";
import {
  LayoutDashboard,
  Compass,
  Map as MapIcon,
  MessageSquare,
  ShieldCheck,
  FileText,
  FlaskConical,
  BarChart3,
  User,
  WifiOff,
  Mic,
  Vote,
  MoreVertical
} from "lucide-react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { EngagementSection } from "./sidebar/EngagementSection";

const MENU_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { id: "journey", label: "Journey", icon: Compass, href: "/journey" },
  { id: "map", label: "Booth Map", icon: MapIcon, href: "/map" },
  { id: "assistant", label: "AI Assistant", icon: MessageSquare, href: "/assistant" },
  { id: "eligibility", label: "Eligibility", icon: ShieldCheck, href: "/eligibility" },
  { id: "documents", label: "Documents", icon: FileText, href: "/documents" },
  { id: "laboratory", label: "Laboratory", icon: FlaskConical, href: "/laboratory" },
  { id: "insights", label: "Insights", icon: BarChart3, href: "/insights" },
];

const NavItem = ({ item, isActive, isHovered, onHover }: {
  item: typeof MENU_ITEMS[0],
  isActive: boolean,
  isHovered: boolean,
  onHover: (id: string | null) => void
}) => {
  return (
    <Link
      href={item.href}
      onMouseEnter={() => onHover(item.id)}
      onMouseLeave={() => onHover(null)}
      className="block"
    >
      <motion.div
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "relative group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 overflow-hidden",
          isActive
            ? "text-primary bg-primary/5 border border-primary/10 shadow-sm"
            : "text-slate-500 hover:text-slate-900"
        )}
      >
        {isActive && (
          <motion.div
            layoutId="active-pill"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full z-20"
          />
        )}

        <div className={cn(
          "relative z-10 transition-transform duration-300",
          isActive && "scale-110",
          isHovered && !isActive && "scale-105"
        )}>
          <item.icon size={20} className={cn(
            "transition-colors",
            isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-600"
          )} />
        </div>

        <span className={cn(
          "relative z-10 text-[13px] font-black uppercase tracking-widest transition-all duration-300 font-display",
          isActive ? "text-slate-900" : "text-slate-500"
        )}>
          {item.label}
        </span>

        {isActive && (
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute right-4 w-1 h-1 rounded-full bg-primary"
          />
        )}
      </motion.div>
    </Link>
  );
};

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  const handleVoiceTrigger = () => {
    // In a real app, this would trigger the system orchestrator
    console.log("Voice Assistant Triggered");
    if ((window as any).systemOrchestrator) {
      (window as any).systemOrchestrator.startVoice();
    }
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[260px] bg-white/70 backdrop-blur-xl flex flex-col z-[100] shadow-[10px_0_40px_rgba(0,0,0,0.03)] border-r border-slate-200/50 overflow-hidden">
      {/* Dynamic Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white/40 to-indigo-50/20 pointer-events-none" />

      {/* Bottom Illustration (Low Opacity) */}
      <div className="absolute bottom-0 left-0 right-0 h-64 opacity-[0.03] pointer-events-none overflow-hidden scale-x-[-1]">
        <img
          src="/header_civic_illustration_1777628116893.png"
          alt="Illustration"
          className="w-full h-full object-cover object-bottom"
        />
      </div>

      {/* Header / Logo */}
      <div className="p-8 pb-4 relative z-20">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 15 }}
            className="w-12 h-12 rounded-[1.2rem] bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-xl shadow-primary/20 border border-white/20 group"
          >
            <Vote size={24} className="text-white" />
          </motion.div>
          <div>
            <h1 className="font-black text-2xl tracking-tighter leading-none text-slate-900 font-display">CIVIC AI</h1>
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.25em] mt-1 opacity-70">Empowering Democracy</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="px-4 space-y-1 overflow-y-auto no-scrollbar relative z-20 pt-4 max-h-[40vh]">
        <div className="px-2 mb-2">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Menu</h3>
        </div>
        {MENU_ITEMS.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            isActive={pathname === item.href || (item.href === "/" && pathname === "/")}
            isHovered={hoveredId === item.id}
            onHover={setHoveredId}
          />
        ))}
      </nav>

      {/* Engagement Hub & Rewards */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative z-20 border-t border-slate-100/50 mt-4">
        <EngagementSection />
      </div>

      {/* Footer Actions */}
      <div className="p-4 space-y-3 relative z-20 bg-gradient-to-t from-white/90 to-transparent">
        {/* Offline Status */}
        <motion.div
          whileHover={{ y: -2 }}
          className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
              <WifiOff size={14} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-900 uppercase tracking-wider leading-tight">Offline Sync</p>
              <p className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest mt-0.5">Ready</p>
            </div>
          </div>
          <MoreVertical size={14} className="text-slate-300 group-hover:text-slate-600" />
        </motion.div>

        {/* Voice Trigger Button */}
        {/* <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleVoiceTrigger}
          className="w-full h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center gap-3 shadow-lg shadow-slate-900/10 group overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Mic size={18} className="relative z-10 group-hover:animate-pulse" />
          <span className="text-[11px] font-black uppercase tracking-[0.2em] relative z-10">Voice Command</span>
        </motion.button> */}
      </div>
    </aside>
  );
};
