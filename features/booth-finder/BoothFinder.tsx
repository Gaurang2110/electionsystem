"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Navigation, Map as MapIcon, Info, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";
import { systemOrchestrator } from "@/lib/systemOrchestrator";
import { useRouter } from "@/i18n/navigation";
import { SignLanguageGuide } from "@/components/ui/SignLanguageGuide";

export const BoothFinder: React.FC = () => {
  const [search, setSearch] = React.useState("");
  const [results, setResults] = React.useState<any[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [selectedBoothId, setSelectedBoothId] = React.useState<string | null>(null);
  const t = useTranslations('booth_finder');
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search) return;

    setIsSearching(true);
    try {
      const response = await fetch(`/api/booth?pincode=${search}`);
      const data = await response.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleComplete = () => {
    systemOrchestrator.onStepComplete('locate');
    router.push('/');
  };

  return (
    <div className="flex flex-col gap-8 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="px-2 pt-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white leading-none font-display mb-3">{t('title')}</h2>
          <p className="text-slate-500 font-medium text-lg">{t('subtitle')}</p>
        </div>
        <SignLanguageGuide type="map" />
      </div>

      <Card className="p-2 bg-slate-900/40 border-white/5 shadow-2xl backdrop-blur-xl">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="text"
              placeholder={t('placeholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
            />
          </div>
          <Button type="submit" className="px-8 h-auto py-4 sm:py-0" disabled={isSearching}>
            {isSearching ? t('searching') : t('search')}
          </Button>
        </form>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {results.length > 0 ? (
              results.map((booth, i) => (
                <motion.div
                  key={booth.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className={cn(
                    "p-6 transition-all duration-500 group relative overflow-hidden",
                    selectedBoothId === booth.id
                      ? "bg-primary/10 border-primary/50 shadow-2xl shadow-primary/20"
                      : "bg-slate-900/40 border-white/5 hover:bg-slate-900/60"
                  )}>
                    {selectedBoothId === booth.id && (
                      <div className="absolute top-4 right-4 text-primary animate-bounce">
                        <CheckCircle2 size={24} strokeWidth={3} />
                      </div>
                    )}
                    <div className="flex justify-between items-start mb-4">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner transition-colors",
                        selectedBoothId === booth.id ? "bg-primary text-white" : "bg-primary/10 text-primary"
                      )}>
                        <MapPin size={24} />
                      </div>
                      <span className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        {t('distance_away', { distance: booth.distance })}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white font-display mb-1">{booth.name}</h3>
                    <p className="text-slate-500 text-sm font-medium mb-6">{booth.address}</p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setSelectedBoothId(booth.id)}
                        variant={selectedBoothId === booth.id ? "primary" : "secondary"}
                        className={cn(
                          "flex-1 gap-2 text-xs font-black uppercase tracking-widest h-12 rounded-xl",
                          selectedBoothId === booth.id ? "bg-primary" : "bg-white/5 text-white"
                        )}
                      >
                        {selectedBoothId === booth.id ? t('selected_booth') : t('mark_booth')}
                      </Button>
                      <Button variant="secondary" className="p-3 bg-white/5 border-white/5 text-white h-12 rounded-xl">
                        <Navigation size={18} />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))
            ) : search && !isSearching ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-12 text-center bg-slate-900/20 rounded-[2.5rem] border border-dashed border-white/10"
              >
                <Info size={40} className="mx-auto text-slate-700 mb-4" />
                <p className="text-slate-500 font-medium">{t('no_results')}</p>
              </motion.div>
            ) : (
              <div className="p-12 text-center bg-slate-900/20 rounded-[2.5rem] border border-dashed border-white/10">
                <MapIcon size={40} className="mx-auto text-slate-700 mb-4" />
                <p className="text-slate-500 font-medium">{t('empty_state')}</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Map View & Milestone Completion */}
        <div className="flex flex-col gap-8">
          <div className="h-[400px] rounded-[2.5rem] bg-slate-900/40 border border-white/5 relative overflow-hidden group shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://www.google.com/maps/d/u/0/thumbnail?mid=1_48e7B_U_Z0B5L2_2h8M6_5H_4Y&msa=0')] bg-cover bg-center opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-white/5 backdrop-blur-md rounded-3xl flex items-center justify-center text-white/20 mb-4 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                <MapIcon size={32} />
              </div>
              <h4 className="text-white font-bold text-lg mb-1">{t('map_title')}</h4>
              <p className="text-slate-500 text-sm max-w-[200px]">{t('map_desc')}</p>
            </div>
          </div>

          {selectedBoothId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 bg-slate-900 border-2 border-primary/30 rounded-[2.5rem] shadow-2xl shadow-primary/10 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl -z-10" />
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30 animate-pulse">
                   <Sparkles size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">{t('location_locked')}</h3>
                  <p className="text-slate-500 text-xs font-black uppercase tracking-widest mt-1">{t('ready_day')}</p>
                </div>
              </div>

              <p className="text-slate-400 text-sm font-bold leading-relaxed mb-8">
                {t.rich('milestone_desc', {
                  badge: (chunks) => <span className="text-white">{t('booth_explorer')}</span>
                })}
              </p>

              <button
                onClick={handleComplete}
                className="w-full py-5 bg-white text-slate-900 rounded-3xl text-sm font-black uppercase tracking-[0.1em] flex items-center justify-center gap-3 hover:bg-slate-100 transition-all shadow-xl shadow-white/10"
              >
                {t('complete_milestone')} <ArrowRight size={20} />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
