"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { useTranslations } from "next-intl";
import { Newspaper, Bell, Info, ArrowRight, Filter, Bookmark, Share2, Calendar } from "lucide-react";
import updatesData from "@/data/updates.json";
import { cn } from "@/utils/cn";

export const UpdatesFeed: React.FC = () => {
  const t = useTranslations('updates');
  const [filter, setFilter] = React.useState('all');
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [filter]);

  const filteredUpdates = updatesData.filter(u => 
    filter === 'all' || u.type === filter
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'official': return <Bell className="text-blue-500" size={16} />;
      case 'tip': return <Bookmark className="text-emerald-500" size={16} />;
      case 'process': return <Info className="text-orange-500" size={16} />;
      default: return <Newspaper className="text-slate-400" size={16} />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'official': return "bg-blue-50 text-blue-600 border-blue-100 shadow-sm shadow-blue-50/50";
      case 'tip': return "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm shadow-emerald-50/50";
      case 'process': return "bg-orange-50 text-orange-600 border-orange-100 shadow-sm shadow-orange-50/50";
      default: return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  const filters = ['all', 'official', 'tip', 'process'];

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto px-6 md:px-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="px-2 py-0.5 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full">New</div>
            <h2 className="text-4xl font-black text-white font-display tracking-tight uppercase leading-none">{t('title')}</h2>
          </div>
          <p className="text-slate-500 text-xs font-black uppercase tracking-[0.3em] pl-1">{t('subtitle')}</p>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-2 bg-slate-900/40 backdrop-blur-3xl rounded-[1.5rem] border border-white/10 shadow-2xl overflow-x-auto no-scrollbar">
          {filters.map((f) => (
            <motion.button
              key={f}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(f)}
              className={cn(
                "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                filter === f 
                  ? "bg-white text-slate-900 shadow-xl shadow-white/10 ring-1 ring-white/20" 
                  : "text-slate-400 hover:text-white"
              )}
            >
              {t(`filter_${f}`)}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <div className="contents">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-64 rounded-[2.5rem] bg-white/5 animate-pulse border border-white/5" />
              ))}
            </div>
          ) : filteredUpdates.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-20 text-center space-y-4"
            >
              <div className="w-20 h-20 bg-slate-900/50 rounded-[2.5rem] border border-white/5 flex items-center justify-center text-slate-500 mx-auto">
                <Newspaper size={40} />
              </div>
              <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No updates in this category</p>
            </motion.div>
          ) : (
            <div className="contents">
              {filteredUpdates.map((update, index) => (
                <motion.div
                  key={update.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05, type: "spring", stiffness: 200 }}
                >
                  <Card className="p-0 overflow-hidden group bg-white border-none shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] h-full flex flex-col hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] hover:-translate-y-2 transition-all duration-500 rounded-[2.5rem]">
                    <div className="p-8 flex-1 flex flex-col space-y-6">
                      <div className="flex items-center justify-between">
                        <div className={cn(
                          "px-4 py-1.5 rounded-full border text-[9px] font-black tracking-widest uppercase flex items-center gap-2",
                          getBadgeColor(update.type)
                        )}>
                          {getTypeIcon(update.type)}
                          {t(`type_${update.type}`)}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <Calendar size={12} className="opacity-50" />
                          {new Date(update.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      
                      <div className="space-y-3 flex-1">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-[1.1] group-hover:text-primary transition-colors">
                          {update.title}
                        </h3>
                        <p className="text-[15px] text-slate-500 font-bold leading-relaxed line-clamp-3">
                          {update.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 px-8 bg-slate-50/50 border-t border-slate-100/50 flex items-center justify-between group-hover:bg-slate-50 transition-colors">
                      <button className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-[0.2em] hover:gap-3 transition-all">
                        {t('read_more')}
                        <ArrowRight size={14} strokeWidth={3} />
                      </button>
                      <div className="flex items-center gap-2">
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 shadow-sm transition-all"
                        >
                          <Share2 size={16} />
                        </motion.button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
