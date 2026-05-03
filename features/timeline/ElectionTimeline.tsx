"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Bell, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/utils/cn";

export const ElectionTimeline: React.FC = () => {
  const t = useTranslations('timeline');
  const locale = useLocale();

  const [events, setEvents] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/timeline')
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setLoading(false);
      });
  }, []);

  if (loading) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-white font-display">{t('title')}</h2>
          <p className="text-slate-500 text-xs font-medium">{t('subtitle')}</p>
        </div>
        <button className="p-2 rounded-xl bg-slate-900/40 border border-white/5 text-slate-400 hover:text-white transition-colors">
          <Calendar size={18} />
        </button>
      </div>

      <div className="flex overflow-x-auto no-scrollbar gap-4 pb-4 -mx-2 px-2 snap-x">
        {events.map((event, i) => {
          const isCompleted = event.daysLeft < 0;
          const isActive = event.daysLeft >= 0 && event.daysLeft <= 30;
          const status = isCompleted ? 'completed' : isActive ? 'active' : 'upcoming';
          const countdownText = event.daysLeft > 0 
            ? t('days_left', { days: event.daysLeft }) 
            : isCompleted 
              ? t('finished') 
              : t('today');

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="snap-center min-w-[240px] flex-shrink-0"
            >
              <Card className={cn(
                "p-5 relative overflow-hidden transition-all duration-500",
                status === "active" ? "bg-primary/10 border-primary/30 ring-1 ring-primary/20" : "bg-slate-900/40 border-white/5"
              )}>
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center border",
                      status === "completed" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
                      status === "active" ? "bg-primary/20 border-primary/30 text-primary" :
                      "bg-slate-800/50 border-white/5 text-slate-500"
                    )}>
                      {status === "completed" ? <Clock size={20} /> : <Calendar size={20} />}
                    </div>
                    {event.daysLeft !== undefined && (
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full",
                        event.daysLeft <= 7 ? "bg-rose-500 text-white" : "bg-primary text-white"
                      )}>
                        {countdownText}
                      </span>
                    )}
                  </div>

                  <h3 className={cn(
                    "font-bold text-base mb-1 font-display",
                    status === "upcoming" ? "text-slate-400" : "text-white"
                  )}>
                    {event.title}
                  </h3>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-tight">
                    {new Date(event.date).toLocaleDateString(locale === 'en' ? 'en-IN' : locale, { day: 'numeric', month: 'short' })}
                  </p>

                  <div className="mt-6 flex items-center justify-between">
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest",
                      status === "completed" ? "text-emerald-500" :
                      status === "active" ? "text-primary" :
                      "text-slate-600"
                    )}>
                      {t(`status.${status}`)}
                    </span>
                    <button className="text-slate-600 hover:text-white transition-colors">
                      <Bell size={14} />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
