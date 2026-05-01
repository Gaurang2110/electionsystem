"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Globe, ArrowRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { TrustBadges } from "@/components/ui/TrustBadges";

const languages = [
  { code: "en", name: "English", label: "English", desc: "Select your language" },
  { code: "hi", name: "Hindi", label: "हिंदी", desc: "अपनी भाषा चुनें" },
  { code: "gu", name: "Gujarati", label: "ગુજરાતી", desc: "તમારી ભાષા પસંદ કરો" },
  { code: "bn", name: "Bengali", label: "বাংলা", desc: "আপনার ভাষা নির্বাচন করুন" },
  { code: "mr", name: "Marathi", label: "मराठी", desc: "तुमची भाषा निवडा" },
  { code: "ta", name: "Tamil", label: "தமிழ்", desc: "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்" },
  { code: "te", name: "Telugu", label: "తెలుగు", desc: "మీ భాషను ఎంచుకోండి" },
  { code: "pa", name: "Punjabi", label: "ਪੰਜਾਬੀ", desc: "ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ" },
];

export const LanguageOnboarding: React.FC = () => {
  const [show, setShow] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    const preferred = localStorage.getItem("preferred_locale");
    if (!preferred) {
      setShow(true);
    }
  }, []);

  const handleSelect = (locale: string) => {
    localStorage.setItem("preferred_locale", locale);
    router.replace(pathname, { locale: locale as any });
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto no-scrollbar">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/15 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl w-full text-center space-y-16 relative z-10 py-12"
      >
        <div className="space-y-6">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-primary/20 border border-white/5"
          >
            <Globe size={48} className="text-primary" />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-white font-display tracking-tight leading-none">
            Choose Your <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Language</span>
          </h1>
          <p className="text-slate-400 text-xl font-medium max-w-md mx-auto">
            Select your preferred language to start your journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {languages.map((lang, i) => (
            <motion.button
              key={lang.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(lang.code)}
              className="flex flex-col items-center justify-center p-8 bg-slate-900/80 backdrop-blur-md rounded-[2.5rem] border border-white/5 hover:border-primary/50 transition-all group shadow-2xl"
            >
              <span className="text-3xl font-bold text-white font-display mb-2">{lang.label}</span>
              <span className="text-sm text-slate-500 font-bold uppercase tracking-widest">{lang.name}</span>
              <div className="mt-6 w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                <ArrowRight size={22} />
              </div>
            </motion.button>
          ))}
        </div>

        <TrustBadges className="max-w-2xl mx-auto pt-8 border-t border-white/5" />
        
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest leading-relaxed">
          Your data never leaves your device. We use local-first intelligence for total privacy.
        </p>
      </motion.div>
    </div>
  );
};
