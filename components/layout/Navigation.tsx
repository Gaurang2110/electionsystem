"use client";
import * as React from "react";
import { Home, Compass, MessageSquare, CheckCircle2 } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";

const navItems = [
  { icon: Home, labelKey: "home", href: "/" },
  { icon: Compass, labelKey: "journey", href: "/journey" },
  { icon: MessageSquare, labelKey: "assistant", href: "/assistant" },
  { icon: CheckCircle2, labelKey: "eligibility", href: "/eligibility" },
];

export const Navigation: React.FC = () => {
  const pathname = usePathname();
  const t = useTranslations('nav');

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 px-4 py-2 pb-6 z-50">
      <div className="max-w-md mx-auto flex justify-between items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.labelKey}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 transition-all duration-300",
                isActive ? "text-blue-600 scale-110" : "text-gray-400 hover:text-gray-600"
              )}
            >
              <div className={cn(
                "p-1 rounded-xl transition-colors",
                isActive && "bg-blue-50"
              )}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {t(item.labelKey)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
