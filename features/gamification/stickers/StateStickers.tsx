"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import statesData from "@/data/states.json";
import { Card } from "@/components/ui/Card";
import { cn } from "@/utils/cn";
import { Map, Info } from "lucide-react";

export const StateStickers: React.FC = () => {
  const { gamification } = useAppStore();
  const { unlockedStates } = gamification;

  return (
    <Card className="p-8 bg-slate-900 border-white/5 shadow-3d overflow-hidden relative">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Map className="text-emerald-500" size={20} />
            <h3 className="text-2xl font-black text-white font-display uppercase tracking-tight">State Collectibles</h3>
          </div>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Explore the map to collect state stickers</p>
        </div>
        <div className="text-right">
          <span className="text-xl font-black text-white">{unlockedStates.length}/{statesData.length}</span>
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-0.5">Stickers Found</p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {statesData.map((state) => {
          const isUnlocked = unlockedStates.includes(state.id);
          return (
            <motion.div
              key={state.id}
              whileHover={isUnlocked ? { scale: 1.1, rotate: 5 } : {}}
              className="relative"
            >
              <div className={cn(
                "aspect-square rounded-2xl flex items-center justify-center text-2xl transition-all duration-500",
                isUnlocked 
                  ? "bg-white/10 border border-white/20 shadow-lg shadow-emerald-500/5 grayscale-0" 
                  : "bg-white/5 border border-white/5 grayscale opacity-20"
              )}>
                {state.icon}
              </div>
              {isUnlocked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center"
                >
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 flex items-start gap-3 p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
        <Info size={16} className="text-emerald-500 shrink-0 mt-0.5" />
        <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
          Tip: Tap on a state boundary in the <span className="text-white">Booth Finder</span> map to automatically unlock its exclusive collectible sticker.
        </p>
      </div>
    </Card>
  );
};
