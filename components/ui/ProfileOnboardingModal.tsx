"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { User, Calendar, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/utils/cn";

export const ProfileOnboardingModal: React.FC = () => {
  const { profile, updateProfile } = useAppStore();
  const [name, setName] = React.useState("");
  const [age, setAge] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Only show if mounted and name is missing
  const isVisible = mounted && !profile.name;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !age) return;

    setIsSubmitting(true);
    // Simulate slight delay for premium feel
    await new Promise(resolve => setTimeout(resolve, 800));
    
    updateProfile({
      name: name.trim(),
      age: parseInt(age, 10),
    });
    setIsSubmitting(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-[#0A0F1D]/90 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden border border-white/20"
        >
          {/* Header Decoration */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-primary to-indigo-600 opacity-10" />
          
          <div className="p-8 md:p-10 relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <ShieldCheck size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 font-display leading-tight">Welcome to Civic AI</h2>
                <p className="text-sm text-slate-500 font-medium">Please personalize your experience</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Full Name</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                    <User size={20} />
                  </div>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full h-14 pl-12 pr-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                  />
                </div>
              </div>

              {/* Age Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Age</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                    <Calendar size={20} />
                  </div>
                  <input
                    required
                    type="number"
                    min="18"
                    max="120"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 24"
                    className="w-full h-14 pl-12 pr-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-bold ml-1 italic">* You must be 18+ to participate in elections</p>
              </div>

              {/* Security Note */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
                  <Zap size={18} />
                </div>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  Your data is stored locally on your device and is never shared with third parties.
                </p>
              </div>

              <Button
                type="submit"
                disabled={!name.trim() || !age || isSubmitting}
                className="w-full h-16 rounded-2xl text-base font-black uppercase tracking-widest group"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Start Your Journey</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
