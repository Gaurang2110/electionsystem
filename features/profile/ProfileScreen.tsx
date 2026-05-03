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
  Lock,
  ExternalLink,
  History,
  Target,
  Eye,
  EyeOff,
  Settings,
  Bell,
  Trash2,
  Database,
  Zap
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useAppStore } from "@/store/useAppStore";
import { getBadgeById } from "@/lib/gamificationService";
import { useTranslations, useLocale } from "next-intl";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ConfidenceMeter } from "@/components/ui/ConfidenceMeter";
import { cn } from "@/utils/cn";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { AnalyticsDashboard } from "./AnalyticsDashboard";
import { BadgeItem } from "@/components/ui/BadgeItem";

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'gu', label: 'ગુજરાતી' },
  { code: 'mr', label: 'मરાઠી' },
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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-4 pb-24 max-w-[1100px] mx-auto px-4 md:px-0"
    >
      {/* Profile Header Card - Ultra Compact Premium */}
      <motion.div variants={itemVariants}>
        <Card className="relative overflow-hidden border-none p-0 bg-white shadow-xl shadow-slate-200/50 rounded-3xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_-10%,#f8fafc_0%,transparent_50%)]" />

          <div className="absolute right-0 top-0 w-1/3 h-full pointer-events-none opacity-[0.05] mix-blend-multiply overflow-hidden select-none hidden lg:block">
            <img
              src="/eligibity_header.png"
              alt="BG"
              className="w-full h-full object-contain object-right"
            />
          </div>

          <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="relative shrink-0">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-slate-50 flex items-center justify-center border-2 border-white shadow-xl shadow-slate-100 overflow-hidden relative group"
              >
                <User size={40} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                <div className={cn(
                  "absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-white shadow-sm",
                  progress >= 80 ? "bg-emerald-500" : "bg-amber-500"
                )} />
              </motion.div>
            </div>

            <div className="text-center md:text-left flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
                <h2 className="text-2xl md:text-3xl font-black font-display text-slate-900 tracking-tight truncate max-w-[400px]">
                  {profile.name || "Citizen"}
                </h2>
                <div className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100 flex items-center gap-1">
                  <ShieldCheck size={10} strokeWidth={3} />
                  <span className="text-[8px] font-black uppercase tracking-widest">{progress >= 80 ? "Verified" : "Active"}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-400">
                <div className="flex items-center gap-1.5 group cursor-default">
                  <MapPin size={12} className="text-indigo-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{profile.state || "Location Pending"}</span>
                </div>
                <div className="flex items-center gap-1.5 group cursor-default">
                  <Database size={12} className="text-emerald-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600/70">Secure Local Vault</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={cn(
                  "flex-1 md:flex-none px-6 py-3 rounded-xl font-black text-[9px] uppercase tracking-[0.15em] shadow-lg transition-all flex items-center justify-center gap-2",
                  isEditing ? "bg-indigo-600 text-white shadow-indigo-100" : "bg-slate-900 text-white shadow-slate-200"
                )}
              >
                {isEditing ? <><Save size={14} /> Save Changes</> : <><Edit3 size={14} /> Profile Settings</>}
              </motion.button>

            </div>
          </div>
        </Card>
      </motion.div>

      {/* Main Stats Grid - Compact */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Circular Progress Block */}
        <motion.div variants={itemVariants} className="md:col-span-2">
          <Card className="p-5 bg-white border-none shadow-lg shadow-slate-200/40 h-full relative overflow-hidden group">
            <div className="flex items-center gap-6">
              <div className="relative w-28 h-28 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-50" />
                  <motion.circle 
                    cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="8" fill="transparent"
                    strokeDasharray={276.46}
                    initial={{ strokeDashoffset: 276.46 }}
                    animate={{ strokeDashoffset: 276.46 - (276.46 * progress) / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                    className="text-indigo-600"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-black text-slate-900 leading-none">{progress}%</span>
                  <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter">Ready</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp size={14} className="text-indigo-600" />
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Personal Readiness</h4>
                </div>
                <p className="text-[11px] text-slate-500 font-bold leading-relaxed mb-3">Your voting profile is {progress}% complete. Verify remaining steps to reach 100%.</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="p-5 bg-white border-none shadow-lg shadow-slate-200/40 h-full flex flex-col justify-between group">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100/50 mb-4">
              <Award size={20} />
            </div>
            <div>
              <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Impact XP</p>
              <h4 className="text-3xl font-black text-slate-900 leading-none">{gamification.points}</h4>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="p-5 bg-white border-none shadow-lg shadow-slate-200/40 h-full flex flex-col justify-between group overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-5">
              <Sparkles size={40} className="text-slate-900" />
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-50 text-indigo-600 flex items-center justify-center border border-slate-100 mb-4">
              <Zap size={20} />
            </div>
            <div className="relative z-10">
              <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">AI Context</p>
              <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Active Sync</h4>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Personal Details */}
        <motion.div variants={itemVariants}>
          <Card className="p-6 bg-white border-none shadow-lg shadow-slate-200/40">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                <User size={16} />
              </div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Personal Details</h3>
            </div>
            <div className="space-y-4">
              <CompactInfo icon={User} label="Name" value={isEditing ? (formData.name || "") : (profile.name || "—")} isEditing={isEditing} 
                onChange={(v) => setFormData(p => ({...p, name: v}))} />
              <CompactInfo icon={Calendar} label="Age" value={isEditing ? (formData.age?.toString() || "") : (profile.age?.toString() || "—")} isEditing={isEditing} 
                onChange={(v) => setFormData(p => ({...p, age: parseInt(v) || null}))} />
              <CompactInfo icon={MapPin} label="State" value={isEditing ? (formData.state || "") : (profile.state || "—")} isEditing={isEditing} 
                onChange={(v) => setFormData(p => ({...p, state: v}))} />
            </div>
          </Card>
        </motion.div>

        {/* Voting Eligibility */}
        <motion.div variants={itemVariants}>
          <Card className="p-6 bg-white border-none shadow-lg shadow-slate-200/40">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
                <ShieldCheck size={16} />
              </div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Eligibility Status</h3>
            </div>
            <div className="space-y-3">
              <CompactStatus label="Registered Voter" status={isEditing ? (formData.isRegistered ?? false) : (profile.isRegistered ?? false)} isEditing={isEditing}
                onChange={(v) => setFormData(p => ({ ...p, isRegistered: v }))} />
              <CompactStatus label="Voter ID Card" status={isEditing ? (formData.hasVoterId ?? false) : (profile.hasVoterId ?? false)} isEditing={isEditing}
                onChange={(v) => setFormData(p => ({ ...p, hasVoterId: v }))} />
              <CompactStatus label="First-Time Voter" status={isEditing ? (formData.isFirstTimeVoter ?? false) : (profile.isFirstTimeVoter ?? false)} isEditing={isEditing}
                onChange={(v) => setFormData(p => ({ ...p, isFirstTimeVoter: v }))} />
            </div>
          </Card>
        </motion.div>

        {/* Language Pill Cluster */}
        <motion.div variants={itemVariants}>
          <Card className="p-6 bg-white border-none shadow-lg shadow-slate-200/40">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                <Languages size={16} />
              </div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">System Language</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2",
                    locale === lang.code
                      ? "bg-slate-900 text-white border-slate-900 shadow-lg"
                      : "bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100"
                  )}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Accessibility Toggles */}
        <motion.div variants={itemVariants}>
          <Card className="p-6 bg-white border-none shadow-lg shadow-slate-200/40">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shadow-sm">
                <Accessibility size={16} />
              </div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Accessibility</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">Simple</span>
                <button onClick={toggleSimpleMode} className={cn("w-10 h-5 rounded-full relative transition-all", isSimpleMode ? "bg-indigo-600" : "bg-slate-200")}>
                  <motion.div animate={{ x: isSimpleMode ? 22 : 2 }} className="w-3.5 h-3.5 bg-white rounded-full absolute top-0.5" />
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">Contrast</span>
                <button onClick={toggleHighContrast} className={cn("w-10 h-5 rounded-full relative transition-all", isHighContrast ? "bg-amber-500" : "bg-slate-200")}>
                  <motion.div animate={{ x: isHighContrast ? 22 : 2 }} className="w-3.5 h-3.5 bg-white rounded-full absolute top-0.5" />
                </button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Gamification & Achievements Cluster */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 bg-white border-none shadow-lg shadow-slate-200/40 overflow-hidden relative group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_right_top,rgba(79,70,229,0.03)_0%,transparent_50%)]" />

          <div className="relative z-10 flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-amber-500">
                  <Award size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Achievements</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">{gamification.badges.length} Milestones Unlocked</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {gamification.badges.length === 0 ? (
                  <p className="text-slate-400 text-[10px] font-bold uppercase italic">No achievements yet...</p>
                ) : (
                  gamification.badges.map(id => {
                    const badge = getBadgeById(id);
                    return badge ? (
                      <BadgeItem key={id} id={id} label={badge.label} />
                    ) : null;
                  })
                )}
              </div>
            </div>

            <div className="w-px bg-slate-100 hidden md:block" />

            <div className="md:w-1/3 space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex justify-between">
                State Discoveries <span className="text-slate-900">{gamification.unlockedStates.length}/28</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {gamification.unlockedStates.length === 0 ? (
                  <p className="text-slate-400 text-[10px] font-bold uppercase italic">Explore the map to find states...</p>
                ) : (
                  gamification.unlockedStates.map(id => (
                    <div key={id} className="px-2 py-1 bg-slate-50 border border-slate-100 rounded-lg text-slate-600 text-[8px] font-black uppercase tracking-widest">{id}</div>
                  ))
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Analytics Integration */}
      <motion.div variants={itemVariants}>
        <AnalyticsDashboard />
      </motion.div>

      {/* Account Control Section */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 bg-rose-50/20 border border-rose-100 rounded-3xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white text-rose-500 flex items-center justify-center shadow-md border border-rose-100">
                <Trash2 size={24} />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-black text-rose-900 uppercase tracking-widest leading-none">Session Control</h3>
                <p className="text-[9px] font-bold text-rose-600/70 uppercase tracking-widest">Wipe all local identity data</p>
              </div>
            </div>
            <button
              onClick={() => confirm("Clear all progress?") && useAppStore.getState().resetStore()}
              className="w-full md:w-auto px-8 py-3.5 bg-rose-600 text-white font-black text-[9px] uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-rose-200 hover:bg-rose-700 transition-all flex items-center justify-center gap-2"
            >
              Reset Environment <ChevronRight size={14} />
            </button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

const CompactInfo: React.FC<{ icon: any, label: string, value: string, isEditing?: boolean, onChange: (v: string) => void }> = ({ icon: Icon, label, value, isEditing, onChange }) => (
  <div className="flex items-center gap-4">
    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-all shadow-sm">
      <Icon size={18} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">{label}</p>
      {isEditing ? (
        <input 
          type="text" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-slate-50 text-slate-900 text-[11px] font-black p-2 rounded-lg border border-slate-100 focus:outline-none focus:border-indigo-600 w-full"
        />
      ) : (
        <p className="text-[13px] font-black text-slate-900 truncate">{value}</p>
      )}
    </div>
  </div>
);

const CompactStatus: React.FC<{ label: string, status: boolean, isEditing?: boolean, onChange: (v: boolean) => void }> = ({ label, status, isEditing, onChange }) => (
  <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl border border-slate-100">
    <span className="text-[10px] font-black uppercase text-slate-600 tracking-wider">{label}</span>
    {isEditing ? (
      <button
        onClick={() => onChange(!status)}
        className={cn(
          "px-4 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all shadow-sm border",
          status ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-400 border-slate-100"
        )}
      >
        {status ? "Yes" : "No"}
      </button>
    ) : (
      <div className={cn(
        "flex items-center gap-1.5 px-3 py-1 rounded-lg text-[8px] font-black uppercase border",
        status ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-slate-400 bg-slate-100 border-slate-200"
      )}>
        {status ? <><CheckCircle2 size={10} strokeWidth={3} /> Active</> : <><XCircle size={10} strokeWidth={3} /> Pending</>}
      </div>
    )}
  </div>
);
