"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { cn } from "@/utils/cn";

export const PageTransition: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => {
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${pathname}-${locale}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn("w-full h-full", className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
