"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  MapPin, 
  Calendar, 
  Languages, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle,
  Edit3,
  Save,
  Check,
  ChevronRight,
  TrendingUp,
  Award,
  Accessibility,
  Mic,
  Sparkles,
  Lock
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useAppStore } from "@/store/useAppStore";
import { getBadgeById } from "@/lib/gamificationService";
import { useTranslations, useLocale } from "next-intl";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ConfidenceMeter } from "@/components/ui/ConfidenceMeter";
import { cn } from "@/utils/cn";
import { usePathname, useRouter } from "@/i18n/navigation";
import { AnalyticsDashboard } from "./AnalyticsDashboard";

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'gu', label: 'ગુજરાતી' },
  { code: 'mr', label: 'मराठी' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ' }
];

export const ProfileScreen: React.FC = () => {
  const { 
    profile, 
    progress, 
    gamification, 
    updateProfile,
    isSimpleMode,
    toggleSimpleMode,
    isHighContrast,
    toggleHighContrast
  } = useAppStore();
  const t = useTranslations('profile');
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState(profile);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  const handleLanguageChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-6 pb-32 px-6 md:px-16 lg:px-24 xl:px-32"
    >
      {/* Profile Header Card - Soft 3D & Depth */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <Card className="relative overflow-hidden border-none p-0 bg-slate-900 shadow-2xl shadow-black/40">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-indigo-900 opacity-90" />
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-2xl overflow-hidden relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <User size={48} className="text-white relative z-10" />
            </motion.div>
            
            <div className="text-center md:text-left flex-1 space-y-2">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <h2 className="text-3xl md:text-4xl font-black font-display text-white tracking-tight">{profile.name || "Voter Profile"}</h2>
                {!isEditing && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                    <div className={cn("w-2 h-2 rounded-full shadow-[0_0_8px]", progress >= 80 ? "bg-emerald-400 shadow-emerald-400/50" : "bg-orange-400 shadow-orange-400/50")} />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">
                      {progress >= 80 ? "Verified Profile" : "Incomplete"}
                    </span>
                  </div>
                )}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                  <Lock size={10} className="text-white animate-pulse" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Local-Only Data</span>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-blue-100/60 text-[11px] font-black uppercase tracking-widest">
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-blue-300" />
                  <span>{profile.state || "Location Not Set"}</span>
                </div>
                <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-white/20" />
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-blue-300" />
                  <span>Voter ID: {profile.hasVoterId ? "Connected" : "Not Linked"}</span>
                </div>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="px-6 py-3 bg-white text-slate-900 font-black text-[11px] uppercase tracking-widest rounded-2xl shadow-xl shadow-black/20 flex items-center gap-2 transition-all hover:bg-slate-50"
            >
              {isEditing ? <><Save size={14} className="text-primary" /> {t('save')}</> : <><Edit3 size={14} className="text-primary" /> {t('edit')}</>}
            </motion.button>
          </div>
        </Card>
      </motion.div>

      {/* Progress & Stats - Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <Card className="p-6 bg-white border-none shadow-xl shadow-slate-200/50 h-full flex flex-col justify-between group overflow-hidden relative">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-50 rounded-full blur-2xl group-hover:bg-blue-100 transition-colors" />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100/50 shadow-sm">
                <TrendingUp size={20} />
              </div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{t('readiness')}</p>
              <ConfidenceMeter className="mt-4" />
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
          <Card className="p-6 bg-white border-none shadow-xl shadow-slate-200/50 h-full group overflow-hidden relative">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-purple-50 rounded-full blur-2xl group-hover:bg-purple-100 transition-colors" />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 border border-purple-100/50 shadow-sm">
                <Award size={20} />
              </div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{t('impact_score')}</p>
              <h4 className="text-3xl font-black text-slate-900">{gamification.points}</h4>
              <p className="text-slate-400 text-[11px] font-bold mt-2 leading-relaxed">Earn points by completing tasks and checking eligibility.</p>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <Card className="p-6 bg-slate-900 border-none shadow-xl shadow-slate-900/20 h-full relative overflow-hidden flex flex-col justify-center text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-3">
                <CheckCircle2 size={24} />
              </div>
              <h4 className="text-white font-black text-lg font-display tracking-tight">AI Ready</h4>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Chat Optimized Profile</p>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Information - Refined Cards */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}>
          <Card className="p-8 bg-white border-none shadow-xl shadow-slate-200/50 h-full">
            <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">{t('basic_info')}</h3>
              <User size={16} className="text-slate-300" />
            </div>
            <div className="space-y-6">
              <InfoRow icon={User} label={t('full_name')} value={profile.name || "—"} isEditing={isEditing} 
                onChange={(v) => setFormData(p => ({...p, name: v}))} />
              <InfoRow icon={Calendar} label={t('age')} value={profile.age?.toString() || "—"} isEditing={isEditing} 
                onChange={(v) => setFormData(p => ({...p, age: parseInt(v) || null}))} />
              <InfoRow icon={MapPin} label={t('state')} value={profile.state || "—"} isEditing={isEditing} 
                onChange={(v) => setFormData(p => ({...p, state: v}))} />
            </div>
          </Card>
        </motion.div>

        {/* Voting Status - Status Badges */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <Card className="p-8 bg-white border-none shadow-xl shadow-slate-200/50 h-full">
            <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">{t('voting_status')}</h3>
              <ShieldCheck size={16} className="text-slate-300" />
            </div>
            <div className="space-y-4">
              <StatusRow label={t('registered_voter')} status={profile.isRegistered} isEditing={isEditing}
                onChange={(v) => setFormData(p => ({...p, isRegistered: v}))} />
              <StatusRow label={t('voter_id_available')} status={profile.hasVoterId} isEditing={isEditing}
                onChange={(v) => setFormData(p => ({...p, hasVoterId: v}))} />
              <StatusRow label={t('first_time_voter')} status={profile.isFirstTimeVoter} isEditing={isEditing}
                onChange={(v) => setFormData(p => ({...p, isFirstTimeVoter: v}))} />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Language Selection - Premium Glassmorphism */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}>
        <Card className="p-8 bg-white border-none shadow-xl shadow-slate-200/50">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm">
              <Languages size={24} />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">{t('app_language')}</h3>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.15em] mt-0.5">Customize your interface language</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {LANGUAGES.map((lang) => (
              <motion.button
                key={lang.code}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleLanguageChange(lang.code)}
                className={cn(
                  "relative flex items-center justify-center p-5 rounded-3xl border transition-all duration-300 group overflow-hidden",
                  locale === lang.code 
                    ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/20" 
                    : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-white hover:border-slate-200 hover:shadow-lg hover:shadow-slate-100"
                )}
              >
                {locale === lang.code && (
                  <motion.div 
                    layoutId="lang-active"
                    className="absolute inset-0 bg-gradient-to-br from-primary to-indigo-600 -z-10"
                  />
                )}
                <div className="flex flex-col items-center gap-2">
                  <span className={cn("text-base font-black font-display", locale === lang.code ? "text-white" : "text-slate-900")}>{lang.label}</span>
                  {locale === lang.code ? (
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                      <Check size={12} strokeWidth={4} className="text-white" />
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">Select</span>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Accessibility Settings - Unified Hub */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.38 }}>
        <Card className="p-8 bg-white border-none shadow-xl shadow-slate-200/50">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm">
              <Accessibility size={24} />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Accessibility Settings</h3>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.15em] mt-0.5">Customize your assistance features</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Accessibility size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">Simple Mode</h4>
                    <p className="text-[10px] text-slate-400 font-bold">Larger icons & simplified text</p>
                  </div>
                </div>
                <button 
                  onClick={toggleSimpleMode}
                  className={cn(
                    "w-12 h-6 rounded-full relative transition-colors duration-300",
                    isSimpleMode ? "bg-primary" : "bg-slate-200"
                  )}
                >
                  <motion.div 
                    animate={{ x: isSimpleMode ? 24 : 2 }}
                    className="w-5 h-5 bg-white rounded-full absolute top-0.5"
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center text-yellow-600">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">High Contrast</h4>
                    <p className="text-[10px] text-slate-400 font-bold">Black & yellow visibility mode</p>
                  </div>
                </div>
                <button 
                  onClick={toggleHighContrast}
                  className={cn(
                    "w-12 h-6 rounded-full relative transition-colors duration-300",
                    isHighContrast ? "bg-yellow-400" : "bg-slate-200"
                  )}
                >
                  <motion.div 
                    animate={{ x: isHighContrast ? 24 : 2 }}
                    className="w-5 h-5 bg-white rounded-full absolute top-0.5"
                  />
                </button>
              </div>
            </div>

            <div className="p-6 bg-slate-900 rounded-[2rem] border border-white/5 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 text-white/5 group-hover:scale-110 transition-transform duration-700">
                <Mic size={120} />
              </div>
              <div className="relative z-10">
                <h4 className="text-white font-black text-sm uppercase tracking-tight mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Voice Control Ready
                </h4>
                <p className="text-slate-400 text-xs font-bold leading-relaxed mb-6">
                  You can navigate the entire app using your voice. Try saying "Open Map" or "What should I do next?".
                </p>
                <button 
                  onClick={() => {
                    const btn = document.getElementById('voice-trigger');
                    if (btn) btn.click();
                  }}
                  className="px-6 py-3 bg-white text-slate-900 font-black text-[10px] uppercase tracking-widest rounded-xl shadow-xl shadow-black/20 hover:bg-slate-100 transition-all flex items-center gap-2"
                >
                  <Mic size={14} /> Start Voice Control
                </button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Live Analytics Dashboard */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.39 }}>
        <AnalyticsDashboard />
      </motion.div>

      {/* Digital Achievements Section */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
        <Card className="p-8 bg-slate-900 border-none shadow-3d relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl -z-10" />
          
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-amber-400 border border-white/10">
              <Award size={24} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Digital Achievements</h3>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.15em] mt-0.5">Your democratic milestones</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Badges Earned ({gamification.badges.length})</h4>
              <div className="flex flex-wrap gap-3">
                {gamification.badges.length === 0 ? (
                  <p className="text-slate-600 text-[11px] font-bold">No badges earned yet. Complete quests to unlock!</p>
                ) : (
                  gamification.badges.map(id => {
                    const badge = getBadgeById(id);
                    return badge ? (
                      <div key={id} className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shadow-xl shadow-black/20" title={badge.label}>
                        {badge.icon}
                      </div>
                    ) : null;
                  })
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">States Discovered ({gamification.unlockedStates.length})</h4>
              <div className="flex flex-wrap gap-3">
                 {gamification.unlockedStates.length === 0 ? (
                  <p className="text-slate-600 text-[11px] font-bold">Explore the map to find state collectibles.</p>
                ) : (
                  gamification.unlockedStates.map(id => {
                    // Simple representation for discovered states in profile
                    return (
                      <div key={id} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest">
                        {id}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Danger Zone - Reset App */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45 }}>
        <Card className="p-8 bg-rose-50/50 border border-rose-100 shadow-xl shadow-rose-100/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="text-sm font-black text-rose-900 uppercase tracking-widest flex items-center gap-2">
                <XCircle size={16} /> Danger Zone
              </h3>
              <p className="text-rose-600/70 text-[10px] font-bold uppercase tracking-widest">Reset your entire app progress</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (confirm("This will clear all your progress, points, and badges. Are you sure?")) {
                  useAppStore.getState().resetStore();
                }
              }}
              className="px-8 py-4 bg-rose-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-rose-600/20 hover:bg-rose-700 transition-all flex items-center gap-2"
            >
              Reset App Experience
            </motion.button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

const InfoRow: React.FC<{ icon: any, label: string, value: string, isEditing?: boolean, onChange: (v: string) => void }> = ({ icon: Icon, label, value, isEditing, onChange }) => (
  <div className="group relative">
    <div className="flex items-center gap-5 w-full">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors shrink-0 shadow-sm">
        <Icon size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{label}</p>
        {isEditing ? (
          <input 
            type="text" 
            defaultValue={value === "—" ? "" : value}
            onChange={(e) => onChange(e.target.value)}
            className="bg-slate-50 text-slate-900 text-sm font-black p-2.5 rounded-xl border border-slate-100 focus:outline-none focus:border-primary focus:bg-white w-full transition-all"
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        ) : (
          <p className="text-sm font-black text-slate-900 truncate">{value}</p>
        )}
      </div>
    </div>
  </div>
);

const StatusRow: React.FC<{ label: string, status: boolean, isEditing?: boolean, onChange: (v: boolean) => void }> = ({ label, status, isEditing, onChange }) => (
  <motion.div 
    whileHover={{ x: 4 }}
    className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-all hover:bg-white hover:shadow-md hover:shadow-slate-100 group"
  >
    <span className="text-[11px] font-black uppercase text-slate-600 tracking-wider group-hover:text-slate-900 transition-colors">{label}</span>
    {isEditing ? (
      <button 
        onClick={() => onChange(!status)}
        className={cn(
          "px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all shadow-sm border",
          status 
            ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
            : "bg-slate-100 text-slate-500 border-slate-200"
        )}
      >
        {status ? "Yes" : "No"}
      </button>
    ) : (
      <div className={cn(
        "flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase border transition-all",
        status 
          ? "text-emerald-600 bg-emerald-50 border-emerald-100 shadow-[0_2px_10px_-4px_rgba(16,185,129,0.3)]" 
          : "text-slate-400 bg-slate-100 border-slate-200"
      )}>
        {status ? (
          <>
            <CheckCircle2 size={12} strokeWidth={3} />
            <span>Active</span>
          </>
        ) : (
          <>
            <XCircle size={12} strokeWidth={3} />
            <span>Not Set</span>
          </>
        )}
      </div>
    )}
  </motion.div>
);
