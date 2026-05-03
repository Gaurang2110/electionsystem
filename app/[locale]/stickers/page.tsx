"use client";
import * as React from "react";
import { MapPin, Lock, CheckCircle2, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { useAppStore } from "@/store/useAppStore";

const ALL_STATES = [
  "Maharashtra", "Gujarat", "West Bengal", "Tamil Nadu", "Karnataka", 
  "Uttar Pradesh", "Rajasthan", "Kerala", "Bihar", "Telangana",
  "Madhya Pradesh", "Delhi", "Punjab", "Haryana", "Assam",
  "Odisha", "Andhra Pradesh", "Chhattisgarh", "Jharkhand", "Uttarakhand"
];

export default function StickersPage() {
  const { gamification } = useAppStore();
  const unlocked = gamification.unlockedStates;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-slate-900 font-display">Sticker Collection</h1>
        <p className="text-slate-500 font-medium">Unlock local insights across India to earn unique state stickers.</p>
      </div>

      <div className="flex items-center gap-6 p-6 rounded-[2.5rem] bg-indigo-600 text-white shadow-xl shadow-indigo-200">
        <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
          <Star size={32} />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Your Progress</p>
          <h2 className="text-3xl font-black">{unlocked.length} <span className="text-lg font-medium opacity-60">/ 28 States Unlocked</span></h2>
        </div>
        <div className="flex-1 flex justify-end">
          <div className="h-2 w-48 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(unlocked.length / 28) * 100}%` }}
              className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {ALL_STATES.map((state) => {
          const isUnlocked = unlocked.includes(state);
          return (
            <motion.div
              key={state}
              whileHover={isUnlocked ? { scale: 1.05, rotate: [0, -2, 2, 0] } : {}}
              className={cn(
                "p-6 rounded-[2.5rem] border-2 aspect-square flex flex-col items-center justify-center text-center gap-3 transition-all relative overflow-hidden",
                isUnlocked 
                  ? "bg-white border-slate-100 shadow-xl shadow-slate-200/50" 
                  : "bg-slate-50 border-slate-100 opacity-60"
              )}
            >
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center transition-all",
                isUnlocked ? "bg-primary/10 text-primary" : "bg-slate-200 text-slate-400"
              )}>
                {isUnlocked ? <MapPin size={32} /> : <Lock size={24} />}
              </div>
              <div>
                <p className={cn(
                  "text-[13px] font-black font-display leading-tight",
                  isUnlocked ? "text-slate-900" : "text-slate-500"
                )}>
                  {state}
                </p>
                {isUnlocked && (
                  <p className="text-[9px] font-bold text-emerald-500 uppercase mt-1">Unlocked</p>
                )}
              </div>
              
              {isUnlocked && (
                <div className="absolute top-3 right-3 text-emerald-500">
                  <CheckCircle2 size={16} />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
