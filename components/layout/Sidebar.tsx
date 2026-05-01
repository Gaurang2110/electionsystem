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
  Sticker,
  Trophy,
  User,
  WifiOff
} from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import Image from "next/image";
const MENU_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { id: "journey", label: "Journey", icon: Compass, href: "/journey" },
  { id: "map", label: "Booth Map", icon: MapIcon, href: "/map" },
  { id: "assistant", label: "AI Assistant", icon: MessageSquare, href: "/assistant" },
  { id: "eligibility", label: "Eligibility", icon: ShieldCheck, href: "/eligibility" },
  { id: "documents", label: "Documents", icon: FileText, href: "/documents" },
  { id: "laboratory", label: "Laboratory", icon: FlaskConical, href: "/#mock-ballot" },
  { id: "insights", label: "Insights", icon: BarChart3, href: "/insights" },
  { id: "stickers", label: "Stickers", icon: Sticker, href: "/profile" },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy, href: "/profile" },
  { id: "profile", label: "Profile", icon: User, href: "/profile" },
];


export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[240px] bg-[#0A0F1D] text-white flex flex-col z-[100] shadow-2xl overflow-hidden border-r border-white/5">
      {/* Layer 1: Dark Navy Gradient Base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] via-[#0A0F1D] to-[#080C14] pointer-events-none" />

      {/* Layer 2: Silhouette Illustration */}
      <div className="absolute bottom-0 left-0 right-0 h-64 opacity-15 pointer-events-none mix-blend-screen overflow-hidden">

      </div>

      <div className="p-6 pb-4 relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 border border-white/10 group">
            <LayoutDashboard size={20} className="text-white group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <h1 className="font-black text-lg font-display tracking-tight leading-none">CIVIC AI</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Election Assistant</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar relative z-20 pt-2 pb-20">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href === "/" && pathname === "/");
          return (
            <Link key={item.id} href={item.href}>
              <motion.div
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "relative group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 overflow-hidden",
                  isActive
                    ? "text-white bg-gradient-to-r from-primary/20 to-transparent border-l-2 border-primary"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <div className="relative z-10">
                  <item.icon size={18} className={cn("transition-all", isActive ? "text-primary drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" : "group-hover:text-slate-200")} />
                </div>

                <span className={cn("relative z-10 text-sm font-medium transition-all", isActive ? "text-white" : "group-hover:translate-x-1")}>
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Offline Mode Card - Stitch Style */}
      <div className="p-4 relative z-20 mt-auto">
        <div className="dark-glass-card rounded-2xl p-4 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center border border-white/5 group-hover:border-secondary/30 transition-colors">
              <WifiOff size={18} className="text-secondary" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-white leading-tight">Offline Mode</p>
              <p className="text-[10px] font-medium text-slate-500">You are all set!</p>
            </div>
          </div>
          <Compass size={14} className="text-slate-600 group-hover:text-white transition-colors" />
        </div>
      </div>
    </aside>
  );
};
