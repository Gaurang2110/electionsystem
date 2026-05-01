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

export const ConstituencyDashboard: React.FC = () => {
  const [selectedState, setSelectedState] = React.useState(constituencyData[0].state);
  const [selectedAreaId, setSelectedAreaId] = React.useState(constituencyData[0].constituencies[0].id);

  React.useEffect(() => {
    systemOrchestrator.onConstituencyView();
  }, []);

  const currentState = constituencyData.find(s => s.state === selectedState);
  const currentArea = currentState?.constituencies.find(c => c.id === selectedAreaId);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 size={16} className="text-emerald-500" />;
      case "in-progress": return <Clock size={16} className="text-amber-500" />;
      default: return <AlertCircle size={16} className="text-slate-500" />;
    }
  };

  const budgetPercent = currentArea ? (currentArea.budget.used / currentArea.budget.allocated) * 100 : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header & Selection */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900/40 p-6 rounded-[2rem] border border-white/5 backdrop-blur-xl">
        <div>
          <h2 className="text-2xl font-black text-white font-display uppercase tracking-wider">Constituency Insights</h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Know your local development progress</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <select 
              value={selectedState}
              onChange={(e) => {
                const newState = e.target.value;
                setSelectedState(newState);
                const firstArea = constituencyData.find(s => s.state === newState)?.constituencies[0];
                if (firstArea) setSelectedAreaId(firstArea.id);
              }}
              className="appearance-none bg-white/5 border border-white/10 text-white text-xs font-bold px-6 py-3 rounded-xl pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer hover:bg-white/10"
            >
              {constituencyData.map(s => <option key={s.state} value={s.state}>{s.state}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-white transition-colors" />
          </div>

          <div className="relative group">
            <select 
              value={selectedAreaId}
              onChange={(e) => setSelectedAreaId(e.target.value)}
              className="appearance-none bg-white/5 border border-white/10 text-white text-xs font-bold px-6 py-3 rounded-xl pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer hover:bg-white/10"
            >
              {currentState?.constituencies.map(c => <option key={c.id} value={c.id}>{c.area}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-white transition-colors" />
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={selectedAreaId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Left Column: Rep & Budget */}
          <div className="lg:col-span-4 space-y-8">
            {/* Representative Card */}
            <Card className="p-8 bg-gradient-to-br from-primary/20 to-purple-500/10 border-white/10 relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center border border-white/10 mb-6 group-hover:scale-110 transition-transform">
                  <User size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-black text-white font-display mb-2">{currentArea?.representative}</h3>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-6">Current Representative</p>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                  <Calendar size={14} className="text-primary" />
                  <span className="text-[11px] font-bold text-white tracking-wide">Term: {currentArea?.term}</span>
                </div>
              </div>
            </Card>

            {/* Budget Visualization */}
            <Card className="p-8 bg-slate-900/40 border-white/5">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <BarChart3 size={20} className="text-primary" />
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">Fund Utilization</h4>
                </div>
                <span className="text-xs font-black text-primary bg-primary/10 px-3 py-1 rounded-lg">
                  {Math.round(budgetPercent)}%
                </span>
              </div>
              
              <div className="space-y-6">
                <div className="h-4 bg-slate-800 rounded-full overflow-hidden p-1 border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${budgetPercent}%` }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full relative shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Allocated</p>
                    <p className="text-lg font-black text-white font-display">₹{currentArea?.budget.allocated} Cr</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Utilized</p>
                    <p className="text-lg font-black text-emerald-400 font-display">₹{currentArea?.budget.used} Cr</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Promises & Projects */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Promises vs Work */}
              <Card className="p-8 bg-slate-900/40 border-white/5 flex flex-col h-full">
                <h4 className="text-xs font-black text-white uppercase tracking-wider mb-8 flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-primary" />
                  Pillar Commitments
                </h4>
                <div className="space-y-6 flex-1">
                  {currentArea?.promises.map((promise, i) => (
                    <motion.div 
                      key={promise.title}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors"
                    >
                      <span className="text-[13px] font-bold text-white">{promise.title}</span>
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "text-[9px] font-black uppercase tracking-widest",
                          promise.status === 'completed' ? "text-emerald-400" : 
                          promise.status === 'in-progress' ? "text-amber-400" : "text-slate-400"
                        )}>
                          {promise.status.replace('-', ' ')}
                        </span>
                        {getStatusIcon(promise.status)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>

              {/* Projects List */}
              <Card className="p-8 bg-slate-900/40 border-white/5 flex flex-col h-full">
                <h4 className="text-xs font-black text-white uppercase tracking-wider mb-8 flex items-center gap-3">
                  <Briefcase size={18} className="text-primary" />
                  Active Projects
                </h4>
                <div className="space-y-6 flex-1">
                  {currentArea?.projects.map((project, i) => (
                    <motion.div 
                      key={project.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (i + 3) * 0.1 }}
                      className="group/proj"
                    >
                      <h5 className="text-[13px] font-black text-white mb-1 group-hover/proj:text-primary transition-colors">{project.name}</h5>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{project.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Disclaimer */}
            <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Info size={18} className="text-primary" />
              </div>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                <strong className="text-primary uppercase tracking-widest text-[10px] block mb-1">Educational Disclaimer</strong>
                This is a demo for public awareness. All names, projects, and figures used here are sample data meant to demonstrate the transparency framework.
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
