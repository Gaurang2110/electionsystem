"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Calendar, User, ShieldCheck, CheckCircle2, ChevronRight, Volume2 } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useTranslations } from "next-intl";
import { cn } from "@/utils/cn";
import { Link } from "@/i18n/navigation";
import { SpeakerButton } from "./SpeakerButton";

export const NotificationPanel: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { notifications, markAsRead } = useAppStore();
  const t = useTranslations('notifications');
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'deadline': return <Calendar className="text-rose-500" size={16} />;
      case 'incomplete': return <User className="text-orange-500" size={16} />;
      case 'eligibility': return <ShieldCheck className="text-emerald-500" size={16} />;
      case 'document': return <CheckCircle2 className="text-blue-500" size={16} />;
      default: return <Bell className="text-slate-400" size={16} />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, scale: 0.95, filter: "blur(10px)" }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="absolute top-20 right-6 md:right-16 lg:right-24 xl:right-32 w-[calc(100vw-3rem)] md:w-[360px] bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-200/50 overflow-hidden z-[70] ring-1 ring-black/5"
          >
            <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
                  <Bell size={20} />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none">{t('title')}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">
                    {unreadCount > 0 ? t('new_alerts', { count: unreadCount }) : t('all_caught_up')}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm"
                title={t('mark_all_read')}
              >
                <X size={16} />
              </button>
            </div>

            <div className="max-h-[480px] overflow-y-auto custom-scrollbar">
              <AnimatePresence initial={false}>
                {notifications.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-12 text-center space-y-4"
                  >
                    <div className="relative inline-block">
                      <motion.div 
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="w-16 h-16 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-500 mx-auto"
                      >
                        <ShieldCheck size={32} />
                      </motion.div>
                      <motion.div 
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center"
                      >
                        <CheckCircle2 size={10} className="text-white" />
                      </motion.div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-900 font-black text-sm">{t('empty')}</p>
                      <p className="text-slate-400 text-[11px] font-bold uppercase tracking-tight">{t('empty_tip')}</p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {notifications.map((notif, i) => (
                      <motion.div 
                        key={notif.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: i * 0.05 }}
                        className={cn(
                          "flex transition-all relative group",
                          !notif.isRead ? "bg-blue-50/40" : "hover:bg-slate-50/50"
                        )}
                      >
                        <Link 
                          href={notif.link || "#"}
                          onClick={() => {
                            markAsRead(notif.id);
                            onClose();
                          }}
                          className="flex-1 p-5 flex gap-4"
                        >
                          {!notif.isRead && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full" />
                          )}
                          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                            {getIcon(notif.type)}
                          </div>
                          <div className="flex-1 space-y-1.5">
                            <p className={cn(
                              "text-[14px] leading-tight",
                              notif.isRead ? "text-slate-500 font-bold" : "text-slate-900 font-black"
                            )}>
                              {t(notif.message_key)}
                            </p>
                            <div className="flex items-center gap-2">
                              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                                {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                              <span className="w-1 h-1 rounded-full bg-slate-200" />
                              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                                {notif.type}
                              </p>
                            </div>
                          </div>
                        </Link>
                        
                        <div className="pr-5 py-5 flex flex-col justify-center gap-3">
                          <SpeakerButton 
                            text={t(notif.message_key)} 
                            className="w-9 h-9 rounded-2xl border border-slate-200 bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:border-primary hover:text-primary"
                          />
                          <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-slate-400 group-hover:translate-x-1 transition-all">
                            <ChevronRight size={16} />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
            
            {notifications.length > 0 && (
              <div className="p-4 bg-slate-50/80 backdrop-blur-md border-t border-slate-100 text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('end_of_notifications')}</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
