"use client";
import * as React from "react";
import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

import { useAppStore } from "@/store/useAppStore";
import { useVoiceGuidance } from "@/hooks/useVoiceGuidance";

interface QuickActionProps {
  icon: LucideIcon;
  label: string;
  color: string;
  onClick?: () => void;
}

export const QuickAction = React.memo<QuickActionProps>(({ icon: Icon, label, color, onClick }) => {
  const { isSimpleMode } = useAppStore();
  const { speak } = useVoiceGuidance();

  return (
    <Card 
      onClick={onClick}
      onMouseEnter={() => isSimpleMode && speak(label)}
      className={cn(
        "flex flex-col items-center justify-center cursor-pointer group relative overflow-hidden h-full",
        isSimpleMode ? "p-10 md:p-14 gap-8 border-4 border-primary/20" : "p-6 md:p-10 gap-5"
      )}
    >
      <motion.div 
        whileHover={{ scale: 1.15, rotate: 8, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.4)" }}
        whileTap={{ scale: 0.9 }}
        className={cn(
          "rounded-[1.5rem] flex items-center justify-center transition-all shadow-3d border border-white/10",
          isSimpleMode ? "w-24 h-24 rounded-[2rem]" : "w-16 h-16",
          color
        )}
      >
        <Icon size={isSimpleMode ? 48 : 32} strokeWidth={isSimpleMode ? 3 : 2.5} />
      </motion.div>
      <span className={cn(
        "font-black text-gray-100 text-center leading-none font-display uppercase tracking-wider group-hover:text-primary transition-colors",
        isSimpleMode ? "text-2xl" : "text-[13px] md:text-[15px]"
      )}>
        {label}
      </span>
      
      {/* Premium Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      
      <div className="absolute top-4 right-4 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(99,102,241,0.8)] animate-pulse" />
      </div>
    </Card>
  );
});
