"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { Home, Map as MapIcon, MessageSquare, ShieldCheck, Compass } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/utils/cn";

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const t = useTranslations('nav');

  const navItems = [
    { icon: Home, label: t('home'), href: "/" },
    { icon: MapIcon, label: t('map'), href: "/map" },
    { icon: MessageSquare, label: t('assistant'), href: "/assistant" },
    { icon: Compass, label: t('journey'), href: "/journey" },
    { icon: ShieldCheck, label: t('eligibility'), href: "/eligibility" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center p-6 pb-8 pointer-events-none">
      <motion.nav 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="glass rounded-[2rem] p-2 flex items-center gap-1 shadow-2xl pointer-events-auto border-white/50"
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                id={`tour-${item.href.replace('/', '') || 'home'}`}
                className={cn(
                  "relative flex items-center gap-2 px-6 py-3.5 rounded-2xl transition-colors",
                  isActive ? "bg-primary text-white shadow-lg shadow-primary/25" : "text-slate-500 hover:bg-white/5 hover:text-slate-300"
                )}
                whileTap={{ scale: 0.9 }}
              >
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                {isActive && (
                  <motion.span 
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "auto", opacity: 1 }}
                    className="text-[13px] font-bold overflow-hidden whitespace-nowrap font-display"
                  >
                    {item.label}
                  </motion.span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="nav-bg"
                    className="absolute inset-0 bg-primary rounded-2xl -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </motion.nav>
    </div>
  );
};
