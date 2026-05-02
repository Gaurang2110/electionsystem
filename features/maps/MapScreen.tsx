"use client";
import * as React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Map, Info, Search, Filter } from "lucide-react";
import { useTranslations } from "next-intl";

// Lazy load the map component to avoid SSR issues with Leaflet
const BoothMap = dynamic(
  () => import("./BoothMap").then((mod) => mod.BoothMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] bg-slate-100 animate-pulse rounded-[2rem] flex items-center justify-center">
        <Map className="text-slate-300 animate-bounce" size={40} />
      </div>
    )
  }
);

export const MapScreen: React.FC = () => {
  const t = useTranslations('booth_finder');

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto px-6 pb-32">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Interactive</div>
          <h2 className="text-3xl font-black text-black font-display tracking-tight uppercase">{t('title')}</h2>
        </div>
        <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em]">{t('subtitle')}</p>
      </div>

      <BoothMap />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] flex items-start gap-4"
        >
          <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center shrink-0">
            <Search size={24} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">{t('map_title')}</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">{t('map_desc')}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 bg-slate-50 border border-slate-200 rounded-[2rem] flex items-start gap-4"
        >
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
            <Info size={24} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">Offline Ready</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">Map boundaries and booth locations are stored locally for access without internet.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
