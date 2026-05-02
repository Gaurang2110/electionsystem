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
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";

const MENU_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { id: "journey", label: "Journey", icon: Compass, href: "/journey" },
  { id: "map", label: "Booth Map", icon: MapIcon, href: "/map" },
  { id: "assistant", label: "AI Assistant", icon: MessageSquare, href: "/assistant" },
  { id: "eligibility", label: "Eligibility", icon: ShieldCheck, href: "/eligibility" },
  { id: "documents", label: "Documents", icon: FileText, href: "/documents" },
  { id: "insights", label: "Insights", icon: BarChart3, href: "/insights" },
  { id: "stickers", label: "Stickers", icon: Sticker, href: "/profile" },
  { id: "leaderboard", label: "Leaderboard", icon: Trophy, href: "/profile" },
  { id: "profile", label: "Profile", icon: User, href: "/profile" },
];

const AnimatedIcon = ({ icon: Icon, isActive, isHovered }: { icon: any, isActive: boolean, isHovered: boolean }) => {
  return (
    <motion.div
      animate={{
        scale: isActive ? 1.2 : isHovered ? 1.1 : 1,
        rotate: isActive ? [0, -10, 10, 0] : isHovered ? [0, -5, 5, 0] : 0,
      }}
      transition={{
        duration: 0.5,
        rotate: { repeat: isActive ? Infinity : 0, duration: 2, ease: "linear" }
      }}
      className={cn(
        "transition-colors duration-300",
        isActive ? "text-primary drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]" : "text-slate-400 group-hover:text-slate-200"
      )}
    >
      <Icon size={19} />
    </motion.div>
  );
};

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[240px] bg-[#0A0F1D] text-white flex flex-col z-[100] shadow-2xl overflow-hidden border-r border-white/5">
      {/* Layer 1: Dark Navy Gradient Base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] via-[#0A0F1D] to-[#080C14] pointer-events-none" />

      {/* Layer 2: Silhouette Illustration (Faded Parliament) */}
      <div className="absolute bottom-0 left-0 right-0 h-64 opacity-20 pointer-events-none mix-blend-screen overflow-hidden">
        <img
          src="/header_civic_illustration_1777628116893.png"
          alt="Illustration"
          className="w-full h-full object-cover object-bottom grayscale brightness-[0.2] scale-150"
        />
      </div>

      <div className="p-6 pb-4 relative z-20">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.8 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 border border-white/10 group"
          >
            <LayoutDashboard size={20} className="text-white" />
          </motion.div>
          <div>
            <h1 className="font-black text-xl tracking-tight leading-none text-white font-display">CIVIC AI</h1>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1.5">Election Assistant</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar relative z-20 pt-2 pb-20">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href === "/" && pathname === "/");
          return (
            <Link
              key={item.id}
              href={item.href}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <motion.div
                whileHover={{ x: 5, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "relative group flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 overflow-hidden",
                  isActive
                    ? "text-white bg-white/10 border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                    : "text-slate-400 hover:text-white"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 bg-gradient-to-r from-primary/30 via-primary/10 to-transparent border-l-[3px] border-primary z-0"
                  />
                )}

                <div className="relative z-10">
                  <AnimatedIcon
                    icon={item.icon}
                    isActive={isActive}
                    isHovered={hoveredId === item.id}
                  />
                </div>

                <span className={cn(
                  "relative z-10 text-[12px] font-bold uppercase tracking-[0.15em] transition-all duration-500 font-display",
                  isActive ? "text-white" : "group-hover:translate-x-1"
                )}>
                  {item.label}
                </span>

                {isActive && (
                  <motion.div
                    animate={{ opacity: [0.2, 0.5, 0.2] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute right-4 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(99,102,241,1)]"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Offline Mode Card - Stitch Style */}
      <div className="p-4 relative z-20 mt-auto">
        <motion.div
          whileHover={{ y: -2 }}
          className="dark-glass-card rounded-2xl p-4 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-colors border border-white/5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center border border-white/5 group-hover:border-secondary/30 transition-colors">
              <WifiOff size={18} className="text-secondary" />
            </div>
            <div className="text-left">
              <p className="text-[11px] font-black text-white uppercase tracking-wider leading-tight font-display">Offline Mode</p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">You are all set!</p>
            </div>
          </div>
          <Compass size={14} className="text-slate-600 group-hover:text-white transition-colors" />
        </motion.div>
      </div>
    </aside>
  );
};
