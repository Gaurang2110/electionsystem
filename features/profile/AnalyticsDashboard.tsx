"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { Card } from "@/components/ui/Card";
import { BarChart3, Activity, Clock, Zap } from "lucide-react";
import { cn } from "@/utils/cn";

export const AnalyticsDashboard: React.FC = () => {
  const { analytics, completedSteps, engagementScore } = useAppStore();

  const eventCounts = analytics.reduce((acc, curr) => {
    const type = curr.event.split('_')[0];
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const stats = [
    { label: "Total Steps", value: completedSteps.length, icon: Zap, color: "text-amber-500" },
    { label: "Interactions", value: analytics.length, icon: Activity, color: "text-emerald-500" },
    { label: "Constituency", value: eventCounts['constituency'] || 0, icon: BarChart3, color: "text-blue-500" },
    { label: "Engagement", value: engagementScore, icon: Clock, color: "text-purple-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 px-2">
        <div className="w-2 h-2 rounded-full bg-primary" />
        <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">Live Insights</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={stat.label} className="p-4 bg-white border-none shadow-md shadow-slate-200/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity text-slate-900">
              <stat.icon size={48} />
            </div>
            <div className="relative z-10">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h4 className={cn("text-2xl font-black font-display", stat.color)}>{stat.value}</h4>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-white border-none shadow-lg shadow-slate-200/40">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Recent Activity Log</h4>
          <span className="text-[9px] font-black text-slate-400 uppercase">Last 100 events</span>
        </div>
        <div className="space-y-3 max-h-[300px] overflow-y-auto no-scrollbar">
          {analytics.length === 0 ? (
            <p className="text-center py-10 text-slate-400 text-xs font-bold uppercase italic">No interaction data yet</p>
          ) : (
            analytics.map((log, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    log.event.includes('assistant') ? "bg-blue-500" :
                      log.event.includes('map') ? "bg-emerald-500" :
                        log.event.includes('step') ? "bg-amber-500" : "bg-slate-500"
                  )} />
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight truncate max-w-[180px]">
                    {log.event.replace(/_/g, ' ')}
                  </span>
                </div>
                <span className="text-[8px] font-black text-slate-400 uppercase">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
