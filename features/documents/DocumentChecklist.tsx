"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  FileText,
  IdCard,
  Home,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ArrowRight,
  MoreVertical,
  ChevronRight,
  UserCheck,
  Lock,
  ExternalLink,
  UploadCloud,
  Eye,
  Info
} from "lucide-react";
import { systemOrchestrator } from "@/lib/systemOrchestrator";
import { Card } from "@/components/ui/Card";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

const DOCUMENT_METADATA = {
  'aadhar': { icon: IdCard, color: 'bg-emerald-50 text-emerald-600', badge: 'Verified', date: 'Verified on 12 May 2024' },
  'voter-id': { icon: ShieldCheck, color: 'bg-indigo-50 text-indigo-600', badge: 'Optional', date: 'Link your EPIC number' },
  'address-proof': { icon: Home, color: 'bg-blue-50 text-blue-600', badge: 'In Progress', date: 'Takes ~ 2 mins' },
  'pan-card': { icon: FileText, color: 'bg-purple-50 text-purple-600', badge: 'Optional', date: 'Recommended' },
};

export const DocumentChecklist: React.FC = () => {
  const { documentChecklist, toggleDocument, progress } = useAppStore();
  const t = useTranslations('documents');

  const completedCount = documentChecklist.filter(d => d.completed).length;
  const percentage = Math.round((completedCount / documentChecklist.length) * 100);

  return (
    <div className="max-w-[1200px] pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative pb-6 px-4 sm:px-0">
        <div className="space-y-2 relative z-10 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight font-display">{t('title')}</h2>
            <div className="px-2 py-0.5 bg-indigo-600 text-white text-[9px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-indigo-200">
              Official
            </div>
          </div>
          <p className="text-slate-500 font-bold text-xs max-w-lg">{t('subtitle')}</p>
        </div>

        <div className="flex items-center gap-3 relative z-20">

          <div className="hidden md:block relative w-48 h-40 opacity-40">
            <img
              src="/eligibity_header.png"
              alt="Illustration"
              className="w-full h-full object-contain object-right"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-4 sm:px-0">
        <div className="lg:col-span-8 space-y-4">
          {/* Hero Progress Card */}
          <Card className="p-6 bg-gradient-to-br from-indigo-600 to-blue-600 border-none relative overflow-hidden group shadow-xl shadow-indigo-100">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <UploadCloud size={100} className="text-white" />
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="relative w-30 h-30 flex-shrink-0">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="44" cy="44" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="transparent" />
                    <motion.circle
                      cx="44" cy="44" r="40" stroke="white" strokeWidth="8" fill="transparent"
                      strokeDasharray="251.2"
                      initial={{ strokeDashoffset: 251.2 }}
                      animate={{ strokeDashoffset: 251.2 - (251.2 * percentage) / 100 }}
                      transition={{ duration: 1.5, ease: "circOut" }}
                    />
                  </svg>
                  <div className="absolute  right-10 top-17 -translate-y-1/2 flex flex-col items-center justify-center text-white">
                    <span className="text-xl font-black">{percentage}%</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-indigo-100 text-[9px] font-black uppercase tracking-[0.2em] opacity-80">Document Readiness</span>
                  <h3 className="text-2xl font-black text-white font-display leading-tight">{percentage}% Complete</h3>
                  <p className="text-indigo-100/60 text-[10px] font-bold uppercase tracking-wider">
                    {completedCount} of {documentChecklist.length} documents verified
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] font-black text-emerald-300 uppercase tracking-widest">On Track</span>
                  </div>
                </div>
              </div>

              {/* <button className="h-10 px-5 bg-white rounded-xl text-indigo-600 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-black/10 hover:scale-105 transition-transform flex items-center gap-2">
                Continue Verification <ChevronRight size={14} />
              </button> */}
            </div>
          </Card>

          {/* Document List */}
          <div className="space-y-3">
            {documentChecklist.map((doc, i) => {
              const meta = DOCUMENT_METADATA[doc.id as keyof typeof DOCUMENT_METADATA] || { icon: FileText, color: 'bg-slate-50 text-slate-400', badge: 'Required', date: 'Action required' };
              const Icon = meta.icon;

              return (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card
                    className={cn(
                      "p-4 transition-all duration-300 group hover:shadow-lg hover:shadow-slate-100 border-2",
                      doc.completed ? "border-indigo-600/10 bg-indigo-50/5" : "border-slate-50 hover:border-indigo-50"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0",
                        meta.color
                      )}>
                        <Icon size={20} strokeWidth={2.5} />
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-base text-slate-900 font-display">{t(`items.${doc.id}.title`)}</h4>
                          <span className={cn(
                            "px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                            doc.completed ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"
                          )}>
                            {doc.completed ? 'Verified' : meta.badge}
                          </span>
                        </div>
                        <p className="text-slate-400 text-xs font-bold leading-tight">{t(`items.${doc.id}.desc`)}</p>
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <div className="w-1 h-1 rounded-full bg-slate-200" />
                          <span className="text-[9px] font-black text-slate-350 uppercase tracking-widest">
                            {doc.completed ? 'Verified on 12 May 2024' : meta.date}
                          </span>
                        </div>

                        {/* Action Buttons - Placed below with spacing */}
                        <div className="flex items-center gap-3 pt-3">
                          <button
                            onClick={() => toggleDocument(doc.id)}
                            className={cn(
                              "h-8 px-4 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all flex items-center gap-2",
                              doc.completed
                                ? "bg-slate-50 text-slate-400"
                                : "bg-indigo-600 text-white shadow-md shadow-indigo-100 hover:bg-indigo-700"
                            )}
                          >
                            {doc.completed ? <><Eye size={12} /> View Details</> : <><UploadCloud size={12} /> Upload Now</>}
                          </button>
                          {/* {!doc.completed && (
                            <button className="h-8 px-4 bg-slate-50 text-slate-500 rounded-lg font-black text-[9px] uppercase tracking-widest hover:bg-slate-100 transition-colors">
                              Add Details
                            </button>
                          )} */}
                          <div className="ml-auto text-slate-200 hover:text-slate-400 transition-colors cursor-pointer">
                            <MoreVertical size={16} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Verification Alert */}
          {percentage < 100 && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-red-500 shadow-sm">
                  <AlertCircle size={18} />
                </div>
                <div>
                  <h5 className="text-[10px] font-black text-red-900 uppercase tracking-widest leading-none">Verification Incomplete</h5>
                  <p className="text-[9px] font-bold text-red-900/40 mt-1">Missing mandatory documents. This may delay approval.</p>
                </div>
              </div>
              <button className="h-8 px-3 bg-white border border-red-100 rounded-lg text-red-500 font-black text-[9px] uppercase tracking-widest hover:bg-red-50 transition-colors">
                Complete Now
              </button>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="p-5 space-y-5 bg-slate-50 border-slate-100">
            <div className="flex items-center gap-3 pb-1">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                <ShieldCheck size={18} />
              </div>
              <h4 className="text-base font-black text-slate-900 font-display">Why these documents?</h4>
            </div>

            <div className="space-y-5 pt-1">
              {[
                { title: "Prevent Fraud", desc: "Prevents duplicate voting.", icon: UserCheck },
                { title: "ECI Guidelines", desc: "Official requirement for all voters.", icon: Info },
                { title: "Secure & Private", desc: "Data is encrypted and safe.", icon: Lock },
                { title: "Faster Approval", desc: "Speeds up the verification.", icon: Sparkles }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-white text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm shrink-0 border border-indigo-50">
                    <item.icon size={16} />
                  </div>
                  <div className="space-y-0.5">
                    <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{item.title}</h5>
                    <p className="text-[10px] font-bold text-slate-500 leading-tight">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 bg-emerald-50 border-emerald-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                <Lock size={16} />
              </div>
              <h4 className="text-[11px] font-black text-emerald-900 uppercase tracking-widest pt-1">Data Safety</h4>
            </div>
            <p className="text-[10px] font-bold text-emerald-900/50 leading-relaxed mb-4">
              Documents are used only for verification and then securely deleted.
            </p>
            <button className="flex items-center gap-2 text-emerald-700 font-black text-[9px] uppercase tracking-widest hover:underline group">
              Privacy Policy <ExternalLink size={10} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </Card>


        </div>
      </div>
    </div>
  );
};
