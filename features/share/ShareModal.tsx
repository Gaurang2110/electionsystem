"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Copy, Check, X, Send, FileText, TrendingUp, BookOpen, ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";
import { useAppStore } from "@/store/useAppStore";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const t = useTranslations('help_others');
  const { progress, peopleHelpedCount, recordHelpAction } = useAppStore();
  const [copiedSteps, setCopiedSteps] = React.useState(false);
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const shareLink = "https://civic-ai-2026.vercel.app";

  if (!mounted) return null;
  
  const handleShare = async (type: 'checklist' | 'progress' | 'guide') => {
    let message = "";
    if (type === 'checklist') {
      message = t('share_checklist_msg', { link: shareLink });
    } else if (type === 'progress') {
      message = t('share_progress_msg', { progress, link: shareLink });
    } else {
      message = t('share_guide_msg', { link: shareLink });
    }

    const { shareContent } = await import('@/utils/share');
    const success = await shareContent({
      title: t('modal_title'),
      text: message,
      url: shareLink,
    });
    
    if (success) {
      recordHelpAction();
      if (!navigator.share) {
        alert(t('copied'));
      }
    }
  };

  const shareMessage = t('share_message', { link: shareLink });

  const handleCopySteps = async () => {
    const { copyToClipboard } = await import('@/utils/share');
    copyToClipboard(shareMessage);
    setCopiedSteps(true);
    setTimeout(() => setCopiedSteps(false), 2000);
  };

  const handleCopyLink = async () => {
    const { copyToClipboard } = await import('@/utils/share');
    copyToClipboard(shareLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleNativeShare = async () => {
    const { shareContent } = await import('@/utils/share');
    await shareContent({
      title: t('modal_title'),
      text: shareMessage,
      url: shareLink,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-4 right-4 bottom-4 md:left-1/2 md:right-auto md:top-1/2 md:bottom-auto md:-translate-x-1/2 md:-translate-y-1/2 md:w-[450px] bg-[#0B0E14] border border-white/10 rounded-[2.5rem] p-8 z-[201] shadow-2xl"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-black text-white font-display">{t('modal_title')}</h2>
                <p className="text-slate-500 text-sm font-medium">{t('modal_subtitle')}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="space-y-4 mb-8">
              {/* Option 1: Share Checklist */}
              <button 
                onClick={() => handleShare('checklist')}
                className="w-full flex items-center justify-between p-5 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                    <FileText size={20} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-black text-white uppercase tracking-tight">{t('option_checklist')}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t('desc_checklist')}</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <ArrowRight size={14} className="text-slate-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Option 2: Share Progress */}
              <button 
                onClick={() => handleShare('progress')}
                className="w-full flex items-center justify-between p-5 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <TrendingUp size={20} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-black text-white uppercase tracking-tight">{t('option_progress')}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t('desc_progress')}</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <ArrowRight size={14} className="text-slate-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Option 3: Share Guide */}
              <button 
                onClick={() => handleShare('guide')}
                className="w-full flex items-center justify-between p-5 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <BookOpen size={20} />
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-black text-white uppercase tracking-tight">{t('option_guide')}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{t('desc_guide')}</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <ArrowRight size={14} className="text-slate-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10">
              <div className="flex items-center gap-3">
                <Users size={16} className="text-primary" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('people_helped')}</span>
              </div>
              <span className="text-lg font-black text-white">{peopleHelpedCount}</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
