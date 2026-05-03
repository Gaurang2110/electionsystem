"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { MessageSquare, Sparkles } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/utils/cn";

export const AIAssistButton: React.FC = () => {
  const pathname = usePathname();
  
  // Don't show on dashboard (root), assistant, or if pathname is empty
  const isDashboard = pathname === "/" || pathname === "" || pathname === "/en" || pathname === "/hi" || pathname === "/gu";
  const isAssistant = pathname.includes('/assistant');
  
  if (isDashboard || isAssistant) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[100] pointer-events-none">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pointer-events-auto"
      >
        <Link href="/assistant">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="h-11 px-6 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.15em] shadow-[0_10px_25px_-5px_rgba(79,70,229,0.4)] flex items-center gap-2.5 hover:bg-indigo-700 transition-all border border-indigo-400/20 group"
          >
            <div className="w-5 h-5 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-indigo-600 transition-all">
              <MessageSquare size={12} strokeWidth={3} />
            </div>
            Ask Help
            <Sparkles size={10} className="text-amber-300 ml-1 opacity-60 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
};
