"use client";
import * as React from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Languages, Check, Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

const languages = [
  { code: "en", name: "English", label: "English", icon: "A" },
  { code: "hi", name: "Hindi", label: "हिंदी", icon: "अ" },
  { code: "gu", name: "Gujarati", label: "ગુજરાતી", icon: "અ" },
  { code: "bn", name: "Bengali", label: "বাংলা", icon: "অ" },
  { code: "mr", name: "Marathi", label: "मराठी", icon: "अ" },
  { code: "ta", name: "Tamil", label: "தமிழ்", icon: "அ" },
  { code: "te", name: "Telugu", label: "తెలుగు", icon: "అ" },
  { code: "pa", name: "Punjabi", label: "ਪੰਜਾਬੀ", icon: "ਅ" },
];

export const LanguageSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isChanging, setIsChanging] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = useLocale();

  const handleLanguageChange = (locale: string) => {
    if (locale === currentLocale) return;
    setIsChanging(true);
    localStorage.setItem("preferred_locale", locale);
    
    // Smooth navigation
    router.replace(pathname, { locale: locale as any });
    
    // Close and reset after a short delay (navigation will happen)
    setTimeout(() => {
      setIsOpen(false);
      setIsChanging(false);
    }, 1000);
  };

  const currentLang = languages.find((l) => l.code === currentLocale) || languages[0];

  return (
    <div className="relative z-50">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        disabled={isChanging}
        className="flex items-center gap-3 px-5 py-2.5 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/10 text-slate-100 shadow-premium hover:bg-slate-800/60 transition-all"
      >
        {isChanging ? (
          <Loader2 size={18} className="text-primary animate-spin" />
        ) : (
          <Languages size={18} className="text-primary" />
        )}
        <span className="text-[14px] font-bold font-display tracking-wide">{currentLang.label}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-3 w-48 bg-slate-900/90 backdrop-blur-xl rounded-[1.5rem] border border-white/10 shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-2 space-y-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all",
                      currentLocale === lang.code 
                        ? "bg-primary text-white shadow-lg shadow-primary/20" 
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black transition-all",
                        currentLocale === lang.code ? "bg-white/20 text-white" : "bg-primary/10 text-primary group-hover:bg-primary/20"
                      )}>
                        {lang.icon}
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-[10px] opacity-70 leading-none mb-1 uppercase tracking-wider">{lang.name}</span>
                        <span className="text-sm font-bold font-display leading-none">{lang.label}</span>
                      </div>
                    </div>
                    {currentLocale === lang.code && <Check size={16} />}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
