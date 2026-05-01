"use client";
import * as React from "react";
import { Bell, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";

const EVENTS = [
  {
    date: "May 10",
    title: "Voter Registration Opens",
    description: "Start of special drive for new voter registration across states.",
    type: "Upcoming"
  },
  {
    date: "May 25",
    title: "Correction Deadline",
    description: "Last day to make changes to your existing voter details.",
    type: "Critical"
  },
  {
    date: "June 15",
    title: "Final List Publication",
    description: "ECI will publish the final electoral roll for the constituency.",
    type: "Milestone"
  }
];

export const Timeline: React.FC = () => {
  const t = useTranslations('timeline');

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500 pb-32">
      <div className="px-2">
        <h2 className="text-2xl font-black text-gray-900 leading-tight">{t('title')}</h2>
        <p className="text-gray-500 font-medium text-sm">{t('subtitle')}</p>
      </div>

      <div className="relative pl-8 space-y-8 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-1 before:bg-blue-100 before:rounded-full">
        {EVENTS.map((event, i) => (
          <div key={i} className="relative">
            {/* Timeline Dot */}
            <div className={cn(
              "absolute -left-8 w-4 h-4 rounded-full border-4 border-white shadow-sm z-10 top-2",
              event.type === "Critical" ? "bg-rose-500 shadow-rose-200" : "bg-blue-600 shadow-blue-200"
            )} />
            
            <Card className="flex flex-col gap-4 p-5">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest mb-1",
                    event.type === "Critical" ? "text-rose-500" : "text-blue-600"
                  )}>
                    {event.type}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">{event.title}</h3>
                </div>
                <div className="bg-gray-50 px-3 py-1 rounded-lg text-sm font-black text-gray-900">
                  {event.date}
                </div>
              </div>
              
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                {event.description}
              </p>
              
              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl text-[11px] font-black uppercase tracking-wider text-gray-600 transition-colors">
                  <Bell size={14} /> {t('remind_me')}
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-50 hover:bg-blue-100 rounded-xl text-[11px] font-black uppercase tracking-wider text-blue-600 transition-colors">
                  {t('details')} <ArrowUpRight size={14} />
                </button>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
