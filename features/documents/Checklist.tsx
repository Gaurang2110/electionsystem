"use client";
import * as React from "react";
import { Check, FileText, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";

export const Checklist: React.FC = () => {
  const { documentChecklist, toggleDocument } = useAppStore();
  const t = useTranslations('documents');
  
  const completedCount = documentChecklist.filter(d => d.completed).length;
  const totalCount = documentChecklist.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500 pb-32">
      <div className="px-2">
        <h2 className="text-2xl font-black text-gray-900 leading-tight">{t('title')}</h2>
        <p className="text-gray-500 font-medium text-sm">{t('subtitle')}</p>
      </div>

      <Card className="bg-blue-600 text-white border-none shadow-xl shadow-blue-100 flex items-center justify-between p-6">
        <div>
          <h3 className="text-lg font-bold">{t('status')}</h3>
          <p className="text-blue-100 text-sm font-medium">
            {t('items_ready', { count: completedCount, total: totalCount })}
          </p>
        </div>
        <div className="relative w-16 h-16 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="32" cy="32" r="28"
              stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="transparent"
            />
            <circle
              cx="32" cy="32" r="28"
              stroke="white" strokeWidth="6" fill="transparent"
              strokeDasharray={176}
              strokeDashoffset={176 - (176 * percentage) / 100}
              className="transition-all duration-1000"
            />
          </svg>
          <span className="absolute text-[10px] font-black">{percentage}%</span>
        </div>
      </Card>

      <div className="flex flex-col gap-4">
        {documentChecklist.map((doc) => (
          <Card 
            key={doc.id}
            onClick={() => toggleDocument(doc.id)}
            className={cn(
              "flex items-center gap-4 py-4 px-5 cursor-pointer transition-all duration-300",
              doc.completed ? "bg-emerald-50 border-emerald-100" : "bg-white"
            )}
            hover={!doc.completed}
          >
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
              doc.completed ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100" : "bg-gray-50 text-gray-400"
            )}>
              {doc.completed ? <Check size={24} /> : <FileText size={24} />}
            </div>
            <div className="flex-1">
              <h4 className={cn(
                "font-bold text-gray-900",
                doc.completed && "text-emerald-900"
              )}>
                {doc.id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </h4>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {doc.completed ? t('ready') : t('action_required')}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6 flex gap-4">
        <AlertCircle className="text-amber-500 shrink-0" size={24} />
        <p className="text-sm font-medium text-amber-900 leading-relaxed">
          {t('alert')}
        </p>
      </div>
    </div>
  );
};
