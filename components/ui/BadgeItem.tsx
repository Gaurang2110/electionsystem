"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { 
  Award, 
  MapPin, 
  BookOpen, 
  Zap, 
  Share2, 
  Search, 
  Vote, 
  Users 
} from "lucide-react";

interface BadgeItemProps {
  id: string;
  label: string;
  className?: string;
  showLabel?: boolean;
}

const BADGE_CONFIG: Record<string, { icon: any; color: string; bg: string }> = {
  badge_registered: { icon: Award, color: "text-amber-500", bg: "from-amber-500/20 to-orange-500/20" },
  badge_booth_explorer: { icon: MapPin, color: "text-emerald-500", bg: "from-emerald-500/20 to-teal-500/20" },
  badge_informed_voter: { icon: BookOpen, color: "text-blue-500", bg: "from-blue-500/20 to-indigo-500/20" },
  badge_ready_citizen: { icon: Zap, color: "text-purple-500", bg: "from-purple-500/20 to-pink-500/20" },
  badge_community_sharer: { icon: Share2, color: "text-rose-500", bg: "from-rose-500/20 to-red-500/20" },
  badge_aware_citizen: { icon: Search, color: "text-indigo-500", bg: "from-indigo-500/20 to-blue-500/20" },
  badge_voted: { icon: Vote, color: "text-blue-600", bg: "from-blue-600/20 to-indigo-600/20" },
  badge_community_helper: { icon: Users, color: "text-cyan-500", bg: "from-cyan-500/20 to-blue-500/20" },
};

export const BadgeItem: React.FC<BadgeItemProps> = ({ id, label, className, showLabel = false }) => {
  const config = BADGE_CONFIG[id] || { icon: Award, color: "text-slate-400", bg: "from-slate-400/20 to-slate-500/20" };
  const Icon = config.icon;

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        className={cn(
          "relative w-16 h-16 rounded-full flex items-center justify-center overflow-hidden",
          "bg-white/40 backdrop-blur-md border-2 border-white/60 shadow-xl",
          "before:absolute before:inset-0 before:bg-gradient-to-br",
          config.bg
        )}
      >
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 opacity-50 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        
        <Icon className={cn("relative z-10 w-7 h-7", config.color)} strokeWidth={2.5} />
      </motion.div>
      
      {showLabel && (
        <span className="text-[10px] font-black uppercase text-slate-600 tracking-widest text-center max-w-[80px] leading-tight">
          {label}
        </span>
      )}
    </div>
  );
};
