"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/store/useAppStore";
import { CheckCircle2, XCircle, ChevronRight, ChevronLeft, MapPin, UserCheck, ShieldCheck, GraduationCap, Volume2, Sparkles, ArrowRight, RefreshCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { SpeakerButton } from "@/components/ui/SpeakerButton";
import { cn } from "@/utils/cn";
import { systemOrchestrator } from "@/lib/systemOrchestrator";
import { SignLanguageGuide } from "@/components/ui/SignLanguageGuide";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
  "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", 
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", 
  "Ladakh", "Lakshadweep", "Puducherry"
];

export const EligibilityForm: React.FC = () => {
  const { eligibility, setEligibility, calculateProgress, incrementEngagement } = useAppStore();
  const [step, setStep] = React.useState(0);
  const [showResult, setShowResult] = React.useState(eligibility.status !== 'not-checked');
  const t = useTranslations('eligibility');

  const handleNext = () => {
    if (step < 3) {
      setStep(s => s + 1);
    } else {
      setShowResult(true);
      
      // Orchestrate the final eligibility check
      systemOrchestrator.onEligibilityCheck({
        age: eligibility.age || 0,
        isIndian: eligibility.isIndian || false,
        state: eligibility.state || "",
        isRegistered: eligibility.isRegistered || false
      });
    }
  };

  const handleBack = () => setStep(s => s - 1);

  const isEligible = eligibility.status === 'eligible';

  const getReason = () => {
    if (eligibility.isIndian === false) return t('reason_citizen');
    if ((eligibility.age || 0) < 18) return t('reason_age');
    return "";
  };

  const resetForm = () => {
    setStep(0);
    setShowResult(false);
    setEligibility({ status: 'not-checked' });
  };

  const steps = [
    { icon: GraduationCap, color: "blue" },
    { icon: ShieldCheck, color: "orange" },
    { icon: MapPin, color: "emerald" },
    { icon: UserCheck, color: "purple" }
  ];

  return (
    <div className="flex flex-col gap-6 max-w-md mx-auto p-4 md:p-0 pb-32">
      <div className="px-2 space-y-1">
        <div className="flex items-center gap-2">
          <div className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Official</div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">{t('title')}</h2>
          <SignLanguageGuide type="registration" className="ml-auto" />
        </div>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">{t('subtitle')}</p>
      </div>

      <Card className="p-0 overflow-hidden border-none shadow-2xl shadow-slate-200 bg-white relative">
        {/* Decorative Top Accent */}
        <div className="h-1.5 w-full bg-slate-100 flex">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "flex-1 transition-all duration-500",
                i <= step ? "bg-blue-600" : "bg-transparent"
              )} 
            />
          ))}
        </div>

        {!showResult ? (
          <div className="flex flex-col min-h-[340px]">
            {/* Step Indicators */}
            <div className="px-6 pt-6 flex items-center justify-between">
              {steps.map((s, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 border",
                    i === step 
                      ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200 scale-110" 
                      : i < step 
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : "bg-slate-50 text-slate-300 border-slate-100"
                  )}>
                    <s.icon size={14} />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 flex-1 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ x: 10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -10, opacity: 0 }}
                  className="flex-1 flex flex-col justify-center"
                >
                  {step === 0 && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">{t('age_question')}</h3>
                      <div className="relative group">
                        <input 
                          type="number" 
                          placeholder={t('age_placeholder')}
                          className="w-full text-5xl font-black text-blue-600 border-b-2 border-slate-100 focus:border-blue-600 focus:outline-none py-4 bg-transparent transition-all placeholder:text-slate-100"
                          onChange={(e) => setEligibility({ age: Number(e.target.value) })}
                          value={eligibility.age || ""}
                          autoFocus
                        />
                        <div className="absolute right-0 bottom-4 text-slate-300 font-black text-xs uppercase">Years Old</div>
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">{t('citizen_question')}</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <motion.button 
                          whileHover={{ y: -4 }}
                          whileTap={{ scale: 0.98 }}
                          className={cn(
                            "h-20 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all",
                            eligibility.isIndian === true 
                              ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200" 
                              : "bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-200 hover:bg-white"
                          )}
                          onClick={() => setEligibility({ isIndian: true })}
                        >
                          <span className="text-sm font-black uppercase tracking-widest">{t('yes')}</span>
                        </motion.button>
                        <motion.button 
                          whileHover={{ y: -4 }}
                          whileTap={{ scale: 0.98 }}
                          className={cn(
                            "h-20 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all",
                            eligibility.isIndian === false 
                              ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200" 
                              : "bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-200 hover:bg-white"
                          )}
                          onClick={() => setEligibility({ isIndian: false })}
                        >
                          <span className="text-sm font-black uppercase tracking-widest">{t('no')}</span>
                        </motion.button>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">{t('state_question')}</h3>
                      <div className="relative">
                        <select 
                          className="w-full p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 font-black text-slate-900 focus:border-blue-600 focus:bg-white outline-none appearance-none transition-all pr-12"
                          value={eligibility.state || ""}
                          onChange={(e) => setEligibility({ state: e.target.value })}
                        >
                          <option value="" disabled>Select State</option>
                          {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <ChevronRight size={20} className="rotate-90" />
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">{t('registered_question')}</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <motion.button 
                          whileHover={{ y: -4 }}
                          whileTap={{ scale: 0.98 }}
                          className={cn(
                            "h-20 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all",
                            eligibility.isRegistered === true 
                              ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200" 
                              : "bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-200 hover:bg-white"
                          )}
                          onClick={() => setEligibility({ isRegistered: true })}
                        >
                          <span className="text-sm font-black uppercase tracking-widest">{t('yes')}</span>
                        </motion.button>
                        <motion.button 
                          whileHover={{ y: -4 }}
                          whileTap={{ scale: 0.98 }}
                          className={cn(
                            "h-20 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all",
                            eligibility.isRegistered === false 
                              ? "bg-slate-900 border-slate-900 text-white shadow-xl shadow-slate-200" 
                              : "bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-200 hover:bg-white"
                          )}
                          onClick={() => setEligibility({ isRegistered: false })}
                        >
                          <span className="text-sm font-black uppercase tracking-widest">{t('no')}</span>
                        </motion.button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex gap-4 mt-10">
                {step > 0 && (
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 rounded-2xl h-14 border-2 border-slate-100 text-slate-400 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                    onClick={handleBack}
                  >
                    <ChevronLeft size={16} /> Back
                  </motion.button>
                )}
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  className="flex-[2] rounded-2xl h-14 bg-blue-600 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-blue-200 disabled:opacity-50 disabled:shadow-none" 
                  onClick={handleNext}
                  disabled={
                    (step === 0 && !eligibility.age) ||
                    (step === 1 && eligibility.isIndian === null) ||
                    (step === 2 && !eligibility.state) ||
                    (step === 3 && eligibility.isRegistered === null)
                  }
                >
                  {step === 3 ? t('check_result') : t('next')} <ChevronRight size={16} />
                </motion.button>
              </div>
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 text-center space-y-6"
          >
            <div className="flex justify-center">
              {isEligible ? (
                <div className="relative">
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1.2, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 bg-emerald-400 rounded-full" 
                  />
                  <div className="relative w-20 h-20 bg-emerald-500 text-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-emerald-200 ring-4 ring-emerald-50">
                    <CheckCircle2 size={40} strokeWidth={3} />
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1.2, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 bg-rose-400 rounded-full" 
                  />
                  <div className="relative w-20 h-20 bg-rose-500 text-white rounded-[2rem] flex items-center justify-center shadow-2xl shadow-rose-200 ring-4 ring-rose-50">
                    <XCircle size={40} strokeWidth={3} />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2 relative">
              <h3 className={cn(
                "text-2xl font-black tracking-tight",
                isEligible ? 'text-emerald-600' : 'text-rose-600'
              )}>
                {isEligible ? t('result_eligible') : t('result_not_eligible')}
              </h3>
              <div className="flex flex-col items-center gap-2">
                <p className="text-slate-500 font-bold text-[14px] leading-relaxed max-w-[280px] mx-auto">
                  {isEligible ? t('desc_eligible') : t('desc_not_eligible')}
                </p>
                <div className="flex items-center gap-2">
                  <SpeakerButton 
                    text={`${isEligible ? t('result_eligible') : t('result_not_eligible')}. ${isEligible ? t('desc_eligible') : t('desc_not_eligible')}`} 
                    className="w-10 h-10 bg-slate-50 text-slate-400 border border-slate-100 rounded-xl"
                  />
                </div>
              </div>
              
              {!isEligible && (
                <motion.div 
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="mt-4 p-3 bg-rose-50 rounded-2xl text-rose-700 text-xs font-black border border-rose-100 inline-flex items-center gap-2 shadow-sm"
                >
                  <Sparkles size={14} />
                  {getReason()}
                  <SpeakerButton text={getReason()} />
                </motion.div>
              )}
            </div>

            <div className="bg-slate-50 rounded-3xl p-4 text-left space-y-4 border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                <ArrowRight size={80} className="-rotate-45" />
              </div>
              
              <h4 className="text-slate-900 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                {t('what_to_do_next')}
              </h4>
              <div className="space-y-3 relative z-10">
                {isEligible ? (
                  <>
                    {!eligibility.isRegistered && (
                      <motion.div 
                        whileHover={{ x: 4 }}
                        className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-200 shadow-sm"
                      >
                        <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xs font-black border border-blue-100">1</div>
                        <p className="text-slate-700 font-black text-[12px]">{t('next_step_register')}</p>
                      </motion.div>
                    )}
                    <motion.div 
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-200 shadow-sm"
                    >
                      <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xs font-black border border-blue-100">
                        {eligibility.isRegistered ? "1" : "2"}
                      </div>
                      <p className="text-slate-700 font-black text-[12px]">{t('next_step_documents')}</p>
                    </motion.div>
                  </>
                ) : (
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-slate-500 font-bold italic text-[12px] leading-relaxed">Please update your profile details if they change. We will notify you when you reach voting age.</p>
                  </div>
                )}
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-14 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-blue-200" 
              onClick={() => {
                systemOrchestrator.onStepComplete('ready');
                window.location.href = '/';
              }}
            >
              Complete Milestone <ArrowRight size={16} />
            </motion.button>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-14 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-200" 
              onClick={resetForm}
            >
              <RefreshCcw size={16} /> {t('start_over')}
            </motion.button>
          </motion.div>
        )}
      </Card>
    </div>
  );
};
