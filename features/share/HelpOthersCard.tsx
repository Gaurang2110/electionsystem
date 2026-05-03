"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { Users, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useTranslations } from "next-intl";
import { ShareModal } from "./ShareModal";
import { useAppStore } from "@/store/useAppStore";

export const HelpOthersCard: React.FC = () => {
  const { peopleHelpedCount } = useAppStore();
  const t = useTranslations('help_others');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <Card 
          className="relative overflow-hidden p-6 bg-gradient-to-br from-indigo-600 to-blue-700 border-none group cursor-pointer"
          onClick={() => setIsModalOpen(true)}
          hover
        >
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 rounded-[1.5rem] bg-white/20 flex items-center justify-center backdrop-blur-md">
              <Users size={32} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-black text-white font-display mb-1">{t('title')}</h3>
              <p className="text-white/70 text-sm font-medium leading-relaxed max-w-[240px]">
                {t('subtitle')}
              </p>
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">
                  {peopleHelpedCount} People Empowered
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <ArrowRight size={20} className="text-white" />
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -left-4 -top-4 w-24 h-24 bg-indigo-400/20 rounded-full blur-2xl" />
        </Card>
      </motion.div>

      <ShareModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
