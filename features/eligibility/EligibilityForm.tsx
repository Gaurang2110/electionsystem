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
  const { eligibility, setEligibility, calculateProgress } = useAppStore();
  const [step, setStep] = React.useState(0);
  const [showResult, setShowResult] = React.useState(eligibility.status !== 'not-checked');
  const t = useTranslations('eligibility');

  const handleNext = () => {
    if (step < 2) {
      setStep(s => s + 1);
    } else {
      setShowResult(true);
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

  const resetForm = () => {
    setStep(0);
    setShowResult(false);
    setEligibility({ status: 'not-checked' });
  };

  const steps = [
    { label: "Age", icon: GraduationCap },
    { label: "Nationality", icon: ShieldCheck },
    { label: "Residence", icon: MapPin }
  ];

  return (
    <div className="max-w-[1200px] pb-12">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative  pb-8">
        <div className="space-y-3 relative z-10 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">{t('title')}</h2>
            <div className="px-2.5 py-1 bg-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-md border border-indigo-200">Official</div>
          </div>
          <p className="text-slate-500 font-bold text-sm max-w-lg">{t('subtitle')}</p>
        </div>

        {/* PARLIAMENT ILLUSTRATION (MOCKUP STYLE) */}
        <div className="relative w-full md:w-1/2 h-20 md:h-48 opacity-40">
          <div className="absolute inset-0  from-slate-50 to-transparent z-10" />
          <img
            src="/eligibity_header.png"
            alt="Illustration"
            className="w-full h-full object-contain object-right"
          />        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4">
        {/* LEFT COLUMN: MAIN FORM */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="p-0 border-none shadow-[0_30px_100px_-20px_rgba(0,0,0,0.08)] bg-white overflow-hidden rounded-[2.5rem]">
            {!showResult ? (
              <div className="flex flex-col min-h-[500px]">
                {/* STEPPER */}
                <div className="px-12 py-10 flex items-center justify-between relative">
                  {/* Progress Line */}
                  <div className="absolute top-[60px] left-[15%] right-[15%] h-[2px] bg-slate-100" />
                  <div
                    className="absolute top-[60px] left-[15%] h-[2px] bg-indigo-600 transition-all duration-500"
                    style={{ width: `${(step / (steps.length - 1)) * 70}%` }}
                  />

                  {steps.map((s, i) => (
                    <div key={i} className="flex flex-col items-center gap-3 relative z-10">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-2",
                        i === step
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-200 scale-110"
                          : i < step
                            ? "bg-indigo-50 text-indigo-600 border-indigo-100"
                            : "bg-white text-slate-300 border-slate-100"
                      )}>
                        <s.icon size={20} strokeWidth={2.5} />
                      </div>
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest",
                        i === step ? "text-slate-900" : "text-slate-400"
                      )}>{s.label}</span>
                    </div>
                  ))}
                </div>

                {/* CONTENT AREA */}
                <div className="flex-1 flex flex-col items-center justify-center px-12 pb-12 text-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="w-full max-w-md space-y-8"
                    >
                      <div className="flex justify-center mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                          {step === 0 && <GraduationCap size={28} strokeWidth={2.5} />}
                          {step === 1 && <ShieldCheck size={28} strokeWidth={2.5} />}
                          {step === 2 && <MapPin size={28} strokeWidth={2.5} />}
                        </div>
                      </div>

                      {step === 0 && (
                        <div className="space-y-6">
                          <h3 className="text-3xl font-black text-slate-900 tracking-tight">{t('age_question')}</h3>
                          <p className="text-slate-400 font-bold text-sm">You must be 18 years or older to be eligible to vote.</p>
                          <div className="relative group bg-slate-50/50 rounded-2xl border-2 border-slate-100 p-6 focus-within:border-indigo-600 focus-within:bg-white transition-all">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left mb-1">Enter your age</div>
                            <div className="flex items-end gap-2">
                              <input
                                type="number"
                                placeholder="e.g. 22"
                                className="w-full text-4xl font-black text-indigo-600 bg-transparent outline-none placeholder:text-slate-200"
                                onChange={(e) => setEligibility({ age: Number(e.target.value) })}
                                value={eligibility.age || ""}
                                autoFocus
                              />
                              <span className="text-indigo-400 font-black text-xs uppercase mb-2">Years</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {step === 1 && (
                        <div className="space-y-6">
                          <h3 className="text-3xl font-black text-slate-900 tracking-tight">{t('citizen_question')}</h3>
                          <div className="grid grid-cols-2 gap-4">
                            {[true, false].map((val) => (
                              <motion.button
                                key={val.toString()}
                                whileHover={{ y: -4 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setEligibility({ isIndian: val })}
                                className={cn(
                                  "h-24 rounded-[1.5rem] border-2 flex flex-col items-center justify-center gap-2 transition-all",
                                  eligibility.isIndian === val
                                    ? "bg-indigo-600 border-indigo-600 text-white shadow-2xl shadow-indigo-200"
                                    : "bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-200 hover:bg-white"
                                )}
                              >
                                <span className="text-sm font-black uppercase tracking-[0.2em]">{val ? t('yes') : t('no')}</span>
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      )}

                      {step === 2 && (
                        <div className="space-y-6">
                          <h3 className="text-3xl font-black text-slate-900 tracking-tight">{t('state_question')}</h3>
                          <div className="relative bg-slate-50 rounded-2xl border-2 border-slate-100 overflow-hidden">
                            <select
                              className="w-full p-5 bg-transparent font-black text-slate-900 outline-none appearance-none cursor-pointer"
                              value={eligibility.state || ""}
                              onChange={(e) => setEligibility({ state: e.target.value })}
                            >
                              <option value="" disabled>Select your state</option>
                              {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                              <ChevronRight size={20} className="rotate-90" />
                            </div>
                          </div>

                          <div className="pt-4 space-y-4">
                            <p className="text-slate-400 font-bold text-sm tracking-tight">{t('registered_question')}</p>
                            <div className="flex gap-4 justify-center">
                              {[true, false].map((val) => (
                                <button
                                  key={val.toString()}
                                  onClick={() => setEligibility({ isRegistered: val })}
                                  className={cn(
                                    "px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border-2 transition-all",
                                    eligibility.isRegistered === val
                                      ? "bg-slate-900 border-slate-900 text-white"
                                      : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                                  )}
                                >
                                  {val ? t('yes') : t('no')}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Info Box */}
                      <div className="mt-8 p-4 bg-indigo-50 rounded-2xl flex items-start gap-4 text-left border border-indigo-100/50">
                        <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-indigo-600 shrink-0 shadow-sm">
                          <ShieldCheck size={16} />
                        </div>
                        <p className="text-[11px] font-bold text-indigo-900/60 leading-relaxed pt-1">
                          Your information is only used to check your voting eligibility as per Election Commission guidelines.
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-4 pt-6">
                        {step > 0 && (
                          <button
                            onClick={handleBack}
                            className="flex-1 h-16 rounded-2xl border-2 border-slate-100 text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-colors"
                          >
                            Back
                          </button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleNext}
                          disabled={
                            (step === 0 && !eligibility.age) ||
                            (step === 1 && eligibility.isIndian === null) ||
                            (step === 2 && (!eligibility.state || eligibility.isRegistered === null))
                          }
                          className="flex-[2] h-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:shadow-none"
                        >
                          {step === 2 ? "Check Result" : "Next Step"} <ArrowRight size={18} />
                        </motion.button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-12 text-center space-y-8"
              >
                <div className="flex justify-center">
                  <div className={cn(
                    "w-24 h-24 rounded-[2.5rem] flex items-center justify-center shadow-2xl transition-all border-8",
                    isEligible ? "bg-emerald-500 border-emerald-50 text-white" : "bg-rose-500 border-rose-50 text-white"
                  )}>
                    {isEligible ? <CheckCircle2 size={48} strokeWidth={3} /> : <XCircle size={48} strokeWidth={3} />}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className={cn(
                    "text-4xl font-black tracking-tight",
                    isEligible ? 'text-emerald-600' : 'text-rose-600'
                  )}>
                    {isEligible ? t('result_eligible') : t('result_not_eligible')}
                  </h3>
                  <p className="text-slate-500 font-bold text-lg max-w-md mx-auto leading-relaxed">
                    {isEligible ? t('desc_eligible') : t('desc_not_eligible')}
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      systemOrchestrator.onStepComplete('ready');
                      window.location.href = '/';
                    }}
                    className="flex-[2] h-16 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3"
                  >
                    Continue Journey <ArrowRight size={18} />
                  </button>
                  <button
                    onClick={resetForm}
                    className="flex-1 h-16 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200"
                  >
                    Start Over
                  </button>
                </div>
              </motion.div>
            )}
          </Card>

          {/* BOTTOM RECOMMENDED ACTION */}
          {!showResult && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-[#0A0F1D] text-white p-4 rounded-3xl flex items-center justify-between group cursor-pointer hover:bg-slate-900 transition-all border border-white/5"
            >
              <div className="flex items-center gap-4 pl-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recommended Next Step</span>
                  <span className="text-sm font-black uppercase tracking-widest">Check Documents</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                <ArrowRight size={20} className="text-white" />
              </div>
            </motion.div>
          )}
        </div>

        {/* RIGHT COLUMN: INFO CARDS */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-8 border-none shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] bg-white rounded-[2rem] space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Sparkles size={24} />
              </div>
              <h4 className="text-lg font-black text-slate-900">Why we ask for this?</h4>
            </div>
            <p className="text-slate-500 font-bold text-sm leading-relaxed pt-2">
              We follow the guidelines set by the Election Commission of India to ensure a fair and transparent democratic process.
            </p>

            <div className="space-y-4 pt-4 border-t border-slate-50">
              {[
                { label: "18 years or older", desc: "As on the qualifying date", icon: GraduationCap },
                { label: "Indian Citizen", desc: "Citizen of India", icon: ShieldCheck },
                { label: "Ordinary Resident", desc: "Resident of the constituency", icon: MapPin },
                { label: "Not Disqualified", desc: "Not disqualified under any law", icon: UserCheck }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 items-center group">
                  <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    <item.icon size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-700">{item.label}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 border-none bg-indigo-50/50 rounded-[2rem] border border-indigo-100 flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-indigo-600 shrink-0 shadow-sm">
              <UserCheck size={20} />
            </div>
            <div className="space-y-1">
              <h5 className="text-[11px] font-black text-indigo-900 uppercase tracking-widest pt-2">Your information is safe</h5>
              <p className="text-[10px] font-bold text-indigo-900/50 leading-relaxed">
                We don't store your personal data. It is only used for eligibility checking.
              </p>
            </div>
          </Card>


        </div>
      </div>
    </div>
  );
};
