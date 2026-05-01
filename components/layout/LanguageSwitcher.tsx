"use client";
import * as React from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Globe } from "lucide-react";
import { cn } from "@/utils/cn";

const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिंदी" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "mr", label: "Marathi", native: "मराठी" },
];

export const LanguageSwitcher: React.FC = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  const switchLanguage = (newLocale: string) => {
    localStorage.setItem("preferred-locale", newLocale);
    router.replace(pathname, { locale: newLocale });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors border border-gray-100"
      >
        <Globe size={20} />
        <span className="text-xs font-black uppercase tracking-wider">{locale}</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/5" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-50 z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => switchLanguage(lang.code)}
                className={cn(
                  "w-full flex flex-col items-start px-4 py-3 rounded-xl transition-all duration-200",
                  locale === lang.code 
                    ? "bg-blue-50 text-blue-600" 
                    : "hover:bg-gray-50 text-gray-700"
                )}
              >
                <span className="text-sm font-bold">{lang.native}</span>
                <span className="text-[10px] font-medium opacity-60 uppercase">{lang.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
