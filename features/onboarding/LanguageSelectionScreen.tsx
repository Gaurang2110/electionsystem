"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useRouter, usePathname } from "@/i18n/navigation";

const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिंदी" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "mr", label: "Marathi", native: "मराठी" },
];

export const LanguageSelectionScreen: React.FC<{ onSelect: () => void }> = ({ onSelect }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleSelect = (code: string) => {
    localStorage.setItem("preferred-locale", code);
    router.replace(pathname, { locale: code });
    onSelect();
  };

  return (
    <div className="fixed inset-0 bg-white z-[110] flex flex-col p-8 items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm text-center space-y-12"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center shadow-xl shadow-blue-100 border border-blue-100">
            <Globe size={40} />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-gray-900 leading-tight">Select Language</h1>
            <p className="text-gray-500 font-medium">Choose your preferred language to continue</p>
          </div>
        </div>

        <div className="grid gap-4 w-full">
          {LANGUAGES.map((lang, i) => (
            <motion.button
              key={lang.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              onClick={() => handleSelect(lang.code)}
              className="w-full"
            >
              <Card className="flex items-center justify-between p-6 hover:border-blue-200 hover:bg-blue-50/30 group">
                <div className="flex flex-col items-start">
                  <span className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {lang.native}
                  </span>
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                    {lang.label}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Globe size={20} />
                </div>
              </Card>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
