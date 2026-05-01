"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, FileText, IdCard, Home, ShieldCheck, AlertCircle, Sparkles, ArrowRight } from "lucide-react";
import { systemOrchestrator } from "@/lib/systemOrchestrator";
import { Card } from "@/components/ui/Card";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";

const DOCUMENT_METADATA = {
  'aadhar': { icon: IdCard, color: 'text-blue-400' },
  'voter-id': { icon: ShieldCheck, color: 'text-indigo-400' },
  'address-proof': { icon: Home, color: 'text-emerald-400' },
};

export const DocumentChecklist: React.FC = () => {
  const { documentChecklist, toggleDocument, progress } = useAppStore();
  const t = useTranslations('documents');
  
  const completedCount = documentChecklist.filter(d => d.completed).length;
  const percentage = Math.round((completedCount / documentChecklist.length) * 100);

  return (
    <div className="flex flex-col gap-8 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="px-2 pt-8">
        <h2 className="text-3xl font-black text-white leading-none font-display mb-3">{t('title')}</h2>
        <p className="text-slate-500 font-medium text-lg">{t('subtitle')}</p>
      </div>

      {/* Progress Summary Card */}
      <Card className="p-8 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20 relative overflow-hidden group">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">{t('status_label')}</span>
            <h3 className="text-4xl font-black text-white font-display">
              {percentage}% {t('complete')}
            </h3>
            <p className="text-slate-400 text-sm font-medium">
              {completedCount} {t('of')} {documentChecklist.length} {t('documents_ready')}
            </p>
          </div>
          
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-white/5"
              />
              <motion.circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="251.2"
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 - (251.2 * percentage) / 100 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="text-primary"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <FileText className="text-primary" size={24} />
            </div>
          </div>
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] -mr-32 -mt-32 rounded-full" />
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {documentChecklist.map((doc, i) => {
          const meta = DOCUMENT_METADATA[doc.id as keyof typeof DOCUMENT_METADATA] || { icon: FileText, color: 'text-slate-400' };
          const Icon = meta.icon;

          return (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card 
                onClick={() => systemOrchestrator.onDocumentUpdate(doc.id)}
                className={cn(
                  "p-6 cursor-pointer transition-all duration-500 flex items-center gap-6 group",
                  doc.completed ? "bg-emerald-500/5 border-emerald-500/20 shadow-none" : "bg-slate-900/40 border-white/5 hover:bg-slate-900/60"
                )}
                hover={!doc.completed}
              >
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shrink-0",
                  doc.completed ? "bg-emerald-500 text-white" : "bg-slate-800 text-slate-500 group-hover:text-white group-hover:bg-primary/20"
                )}>
                  <Icon size={28} />
                </div>

                <div className="flex-1">
                  <h4 className={cn(
                    "font-bold text-lg font-display transition-colors",
                    doc.completed ? "text-emerald-400" : "text-white"
                  )}>
                    {t(`items.${doc.id}.title`)}
                  </h4>
                  <p className={cn(
                    "text-sm font-medium transition-colors",
                    doc.completed ? "text-emerald-400/60" : "text-slate-500"
                  )}>
                    {t(`items.${doc.id}.desc`)}
                  </p>
                </div>

                <div className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500",
                  doc.completed ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-700 text-transparent"
                )}>
                  <CheckCircle2 size={18} strokeWidth={3} />
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Milestone Completion Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "mt-8 p-8 border-2 rounded-[2.5rem] shadow-2xl relative overflow-hidden group transition-all duration-500",
          percentage === 100 
            ? "bg-slate-900 border-primary/30 shadow-primary/10" 
            : "bg-slate-50 border-slate-200 shadow-slate-100"
        )}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl -z-10" />
        <div className="flex items-center gap-4 mb-6">
          <div className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all",
            percentage === 100 
              ? "bg-primary text-white shadow-primary/30 animate-pulse" 
              : "bg-slate-200 text-slate-400 shadow-none"
          )}>
            {percentage === 100 ? <Sparkles size={28} /> : <FileText size={28} />}
          </div>
          <div>
            <h3 className={cn(
              "text-xl font-black uppercase tracking-tight",
              percentage === 100 ? "text-white" : "text-slate-900"
            )}>
              {percentage === 100 ? "Documents Ready!" : "Incomplete Checklist"}
            </h3>
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest mt-1">
              {percentage === 100 ? "Milestone Unlocked" : "Verification Required"}
            </p>
          </div>
        </div>

        <p className={cn(
          "text-sm font-bold leading-relaxed mb-8",
          percentage === 100 ? "text-slate-400" : "text-slate-500"
        )}>
          {percentage === 100 
            ? "Your identity documents are verified and ready for the polling booth. Complete this milestone to earn points."
            : "Please ensure you have checked all required documents before completing this milestone. Missing items will affect your Readiness Score."
          }
        </p>

        <button 
          onClick={() => {
            if (percentage === 100) {
              systemOrchestrator.onStepComplete('ready');
              window.location.href = '/';
            }
          }}
          disabled={percentage < 100}
          className={cn(
            "w-full py-5 rounded-3xl text-sm font-black uppercase tracking-[0.1em] flex items-center justify-center gap-3 transition-all shadow-xl",
            percentage === 100 
              ? "bg-white text-slate-900 hover:bg-slate-100 shadow-white/10" 
              : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
          )}
        >
          {percentage === 100 ? "Complete Milestone" : "Check Remaining Items"} 
          {percentage === 100 ? <ArrowRight size={20} /> : <AlertCircle size={20} />}
        </button>
      </motion.div>

      {/* Info Alert */}
      <Card className="p-6 bg-amber-500/5 border-amber-500/20 flex gap-4">
        <AlertCircle className="text-amber-500 shrink-0" size={24} />
        <p className="text-amber-500/80 text-sm font-medium leading-relaxed">
          {t('kcy_alert')}
        </p>
      </Card>
    </div>
  );
};
