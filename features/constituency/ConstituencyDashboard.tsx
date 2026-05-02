"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import {
  ChevronDown,
  User,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  BarChart3,
  Briefcase,
  Info
} from "lucide-react";
import constituencyData from "@/data/constituency.json";
import { cn } from "@/utils/cn";
import { systemOrchestrator } from "@/lib/systemOrchestrator";
import { Link } from "@/i18n/navigation";

export const ConstituencyDashboard: React.FC = () => {
  const [selectedState, setSelectedState] = React.useState(constituencyData[0].state);
  const [selectedAreaId, setSelectedAreaId] = React.useState(constituencyData[0].constituencies[0].id);

  React.useEffect(() => {
    systemOrchestrator.onConstituencyView();
  }, []);

  const currentState = constituencyData.find(s => s.state === selectedState);
  const currentArea = currentState?.constituencies.find(c => c.id === selectedAreaId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-emerald-500 bg-emerald-50";
      case "in-progress": return "text-amber-500 bg-amber-50";
      default: return "text-slate-400 bg-slate-50";
    }
  };

  const budgetPercent = currentArea ? (currentArea.budget.used / currentArea.budget.allocated) * 100 : 0;

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Premium Header with Illustration */}
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 sm:px-0 mb-4">
        <div className="space-y-1 z-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight font-display">Constituency Insights</h2>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em]">Know your local development progress</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          <div className="relative">
            <select
              value={selectedState}
              onChange={(e) => {
                const newState = e.target.value;
                setSelectedState(newState);
                const firstArea = constituencyData.find(s => s.state === newState)?.constituencies[0];
                if (firstArea) setSelectedAreaId(firstArea.id);
              }}
              className="appearance-none bg-white border-2 border-slate-100 text-slate-900 text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-xl pr-12 focus:outline-none focus:border-indigo-600 transition-all cursor-pointer shadow-sm"
            >
              {constituencyData.map(s => <option key={s.state} value={s.state}>{s.state}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={selectedAreaId}
              onChange={(e) => setSelectedAreaId(e.target.value)}
              className="appearance-none bg-white border-2 border-slate-100 text-slate-900 text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-xl pr-12 focus:outline-none focus:border-indigo-600 transition-all cursor-pointer shadow-sm"
            >
              {currentState?.constituencies.map(c => <option key={c.id} value={c.id}>{c.area}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <Link href="/assistant">
            <button className="h-10 px-5 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-100 flex items-center gap-2 hover:bg-indigo-700 transition-all">
              <BarChart3 size={14} /> Ask AI
            </button>
          </Link>
        </div>

        <div className="hidden md:block absolute  -top-20 right-0 w-96 h-48 opacity-15 pointer-events-none">
          <img
            src="/eligibity_header.png"
            alt="Illustration"
            className="w-full h-full object-contain object-right"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedAreaId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 sm:px-0"
        >
          {/* LEFT COLUMN: Representative & Pillar Commitments */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Representative Hero Card */}
              <Card className="p-8 bg-gradient-to-br from-indigo-600 to-blue-700 border-none relative overflow-hidden group shadow-2xl shadow-indigo-100 min-h-[320px] flex flex-col justify-center">
                <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/15 transition-colors" />
                <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl" />

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/30 mb-6 backdrop-blur-md">
                    <User size={40} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-white font-display mb-1">{currentArea?.representative}</h3>
                  <p className="text-indigo-100/60 text-[10px] font-black uppercase tracking-[0.2em] mb-6">Current Representative</p>
                  <div className="h-[1px] w-12 bg-white/30 mb-6" />
                  <div className="flex items-center gap-3">
                    <Calendar size={14} className="text-white/60" />
                    <span className="text-[11px] font-black text-white uppercase tracking-widest">Term: {currentArea?.term}</span>
                  </div>
                </div>
              </Card>

              {/* Pillar Commitments Card */}
              <Card className="p-6 bg-white border-slate-100 shadow-xl shadow-slate-100 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <CheckCircle2 size={18} />
                    </div>
                    <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Pillar Commitments</h4>
                  </div>
                  <button className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:underline">View All</button>
                </div>

                <div className="space-y-4 flex-1">
                  {currentArea?.promises.map((promise, i) => (
                    <motion.div
                      key={promise.title}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl border border-slate-50 hover:bg-slate-50 transition-all group cursor-default"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                          <Briefcase size={14} />
                        </div>
                        <span className="text-[12px] font-bold text-slate-800">{promise.title}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg",
                          getStatusColor(promise.status)
                        )}>
                          {promise.status.replace('-', ' ')}
                        </span>
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center border",
                          promise.status === 'completed' ? "border-emerald-200 text-emerald-500 bg-emerald-50" : "border-slate-100 text-slate-300"
                        )}>
                          {promise.status === 'completed' ? <CheckCircle2 size={12} /> : <ChevronDown size={12} className="-rotate-90" />}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <button className="w-full py-3 mt-4 text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em] border-t border-slate-50 hover:bg-slate-50 transition-colors">See All Commitments →</button>
              </Card>
            </div>

            {/* Development Overview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Roads Constructed", value: "128 km", change: "+14 km this year", icon: BarChart3, color: "text-indigo-600 bg-indigo-50" },
                { label: "Parks Developed", value: "56", change: "+6 new parks", icon: User, color: "text-emerald-600 bg-emerald-50" },
                { label: "Water Supply", value: "92%", change: "+2% this year", icon: Info, color: "text-blue-600 bg-blue-50" },
                { label: "School Infra", value: "78%", change: "+5% this year", icon: Briefcase, color: "text-purple-600 bg-purple-50" }
              ].map((stat, i) => (
                <Card key={i} className="p-4 bg-white border-slate-100 shadow-md shadow-slate-50 flex flex-col items-center text-center group hover:border-indigo-200 transition-all">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform", stat.color)}>
                    <stat.icon size={18} />
                  </div>
                  <h5 className="text-[14px] font-black text-slate-900 mb-1">{stat.value}</h5>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 leading-tight">{stat.label}</p>
                  <span className="text-[8px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">{stat.change}</span>
                </Card>
              ))}
            </div>

            {/* Transparency & Accountability Banner */}
            <Card className="p-6 bg-slate-50 border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
              <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-indigo-50/50 to-transparent pointer-events-none" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                  <BarChart3 size={24} />
                </div>
                <div>
                  <h5 className="text-[12px] font-black text-slate-900 uppercase tracking-widest mb-1">Transparency & Accountability</h5>
                  <p className="text-[10px] font-bold text-slate-500 leading-relaxed max-w-md">
                    We collect data from official government sources to ensure transparency. All insights are updated regularly for accuracy.
                  </p>
                </div>
              </div>
              <img src="https://img.icons8.com/fluency/96/shield.png" className="w-16 h-16 opacity-50 absolute right-8" alt="" />
            </Card>
          </div>

          {/* RIGHT COLUMN: Budget & Projects */}
          <div className="lg:col-span-4 space-y-8">
            {/* Fund Utilization Card */}
            <Card className="p-8 bg-white border-slate-100 shadow-xl shadow-slate-100">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <BarChart3 size={18} />
                  </div>
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Fund Utilization</h4>
                </div>
                <button className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Details</button>
              </div>

              <div className="flex flex-col items-center">
                <div className="relative w-50 h-50 mb-8">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="88" cy="88" r="80" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
                    <motion.circle
                      cx="88" cy="88" r="80" stroke="#4f46e5" strokeWidth="12" fill="transparent"
                      strokeDasharray="502.4"
                      initial={{ strokeDashoffset: 502.4 }}
                      animate={{ strokeDashoffset: 502.4 - (502.4 * budgetPercent) / 100 }}
                      transition={{ duration: 2, ease: "circOut" }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-slate-900">{Math.round(budgetPercent)}%</span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Utilized</span>
                  </div>
                </div>

                <div className="w-full space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Allocated Budget</p>
                      <p className="text-lg font-black text-slate-900 font-display">₹{currentArea?.budget.allocated} Cr</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <div>
                      <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Utilized Budget</p>
                      <p className="text-lg font-black text-emerald-700 font-display">₹{currentArea?.budget.used} Cr</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-[9px] font-bold text-slate-400 text-center mt-6 flex items-center justify-center gap-2">
                <Clock size={10} /> Last updated: 20 May 2024
              </p>
            </Card>

            {/* Active Projects Card */}
            <Card className="p-8 bg-white border-slate-100 shadow-xl shadow-slate-100">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Briefcase size={18} />
                  </div>
                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Active Projects</h4>
                </div>
                <button className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:underline">View All</button>
              </div>

              <div className="space-y-8">
                {currentArea?.projects.map((project, i) => (
                  <motion.div
                    key={project.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (i + 3) * 0.1 }}
                    className="group/proj"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-[13px] font-black text-slate-800 group-hover/proj:text-indigo-600 transition-colors">{project.name}</h5>
                      <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{i === 0 ? "72%" : "45%"}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: i === 0 ? "72%" : "45%" }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="h-full bg-indigo-600 rounded-full"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 font-bold leading-relaxed">{project.desc}</p>
                  </motion.div>
                ))}
              </div>
              <button className="w-full py-3 mt-8 text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em] border-t border-slate-50 hover:bg-slate-50 transition-colors">See All Projects →</button>
            </Card>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
