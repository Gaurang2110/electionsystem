"use client";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { Card } from "@/components/ui/Card";
import { Share2, Download, CheckCircle2, Sparkles, Heart, Users, Shield } from "lucide-react";
import { cn } from "@/utils/cn";
import { getBadgeById } from "@/lib/gamificationService";
import { systemOrchestrator } from "@/lib/systemOrchestrator";
import { Button } from "@/components/ui/Button";

export const ShareCard: React.FC = () => {
  const { progress, gamification, userName, profile, incrementEngagement } = useAppStore();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isShared, setIsShared] = React.useState(false);

  const generateCard = async () => {
    setIsGenerating(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Canvas setup (high res)
    canvas.width = 1200;
    canvas.height = 630;

    // Background Gradient (Premium Light Theme)
    const grad = ctx.createLinearGradient(0, 0, 1200, 630);
    grad.addColorStop(0, "#ffffff");
    grad.addColorStop(1, "#f1f5f9");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 630);

    // Decorative Blur Circles (Simulated)
    ctx.fillStyle = "rgba(59, 130, 246, 0.05)";
    ctx.beginPath();
    ctx.arc(1000, 100, 300, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(249, 115, 22, 0.05)";
    ctx.beginPath();
    ctx.arc(200, 500, 250, 0, Math.PI * 2);
    ctx.fill();

    // Title
    ctx.fillStyle = "#0f172a";
    ctx.font = "900 48px 'Inter', sans-serif";
    ctx.textBaseline = "top";
    ctx.fillText("CIVIC AI", 80, 80);
    
    ctx.fillStyle = "#64748b";
    ctx.font = "900 48px 'Inter', sans-serif";
    ctx.fillText("ELECTION ASSISTANT", 300, 80);

    // Subtitle
    ctx.fillStyle = "#3b82f6";
    ctx.font = "900 24px 'Inter', sans-serif";
    ctx.fillText("DEMOCRACY READINESS REPORT", 80, 160);

    // Main Readiness Score
    ctx.fillStyle = "#0f172a";
    ctx.font = "900 220px 'Inter', sans-serif";
    ctx.fillText(`${progress}%`, 80, 240);

    ctx.fillStyle = "#10b981";
    ctx.font = "900 36px 'Inter', sans-serif";
    ctx.fillText("CITIZEN READY", 80, 480);

    // User Name
    ctx.fillStyle = "#0f172a";
    ctx.font = "900 40px 'Inter', sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(userName || profile.name || "ACTIVE CITIZEN", 1120, 80);

    // Points
    ctx.fillStyle = "#f59e0b";
    ctx.font = "900 56px 'Inter', sans-serif";
    ctx.fillText(`${gamification.points} POINTS`, 1120, 150);

    // Draw Badges Section
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(15, 23, 42, 0.03)";
    if (ctx.roundRect) ctx.roundRect(700, 260, 420, 280, 40);
    ctx.fill();

    ctx.fillStyle = "#64748b";
    ctx.font = "900 20px 'Inter', sans-serif";
    ctx.fillText("ACHIEVEMENTS", 740, 300);

    const unlockedBadges = gamification.badges.slice(-3);
    unlockedBadges.forEach((id, index) => {
      const b = getBadgeById(id);
      if (b) {
        ctx.font = "40px 'Inter'";
        ctx.fillText(b.icon, 740, 370 + (index * 60));
        ctx.fillStyle = "#0f172a";
        ctx.font = "900 20px 'Inter', sans-serif";
        ctx.fillText(b.label.toUpperCase(), 800, 365 + (index * 60));
      }
    });

    // Logo / Footer
    ctx.fillStyle = "#94a3b8";
    ctx.font = "900 18px 'Inter', sans-serif";
    ctx.fillText("Verify Your Readiness @ civic-ai.gov", 80, 560);

    setIsGenerating(false);
    return canvas.toDataURL("image/png");
  };

  const handleShare = async () => {
    setIsGenerating(true);
    const dataUrl = await generateCard();
    if (!dataUrl) {
      setIsGenerating(false);
      return;
    }

    try {
      if (navigator.share) {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        const file = new File([blob], "election_readiness.png", { type: "image/png" });
        
        await navigator.share({
          title: "My Election Readiness",
          text: `I'm ${progress}% ready for the upcoming elections! Join me on Civic AI and prepare for your vote.`,
          files: [file],
        });
        
        setIsShared(true);
        systemOrchestrator.onShare();
      } else {
        // Fallback to download if share not supported
        handleDownload();
      }
    } catch (error) {
      console.error("Share failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    const dataUrl = await generateCard();
    if (!dataUrl) {
      setIsGenerating(false);
      return;
    }

    const link = document.createElement("a");
    link.download = `readiness_report_${userName || 'citizen'}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setIsShared(true);
    systemOrchestrator.onShare();
    setIsGenerating(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-slate-900 font-display">Invite Your Community</h1>
        <p className="text-slate-500 font-medium">Inspire others by sharing your readiness journey and help build a stronger democracy.</p>
      </div>

      <Card className="p-8 md:p-12 bg-white border-none shadow-2xl shadow-slate-200/50 rounded-[3rem] overflow-hidden relative group">
        {/* Abstract background */}
        <div className="absolute top-0 right-0 w-full h-full opacity-[0.03] pointer-events-none select-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0,0 L100,0 L100,100 L0,80 Z" fill="currentColor" className="text-primary" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
          {/* Card Preview */}
          <div className="w-full lg:w-1/2">
            <motion.div
              whileHover={{ y: -10, rotate: -2 }}
              className="aspect-[1.91/1] bg-slate-50 rounded-[2.5rem] border-2 border-slate-100 shadow-xl overflow-hidden relative group/preview"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-100/50 p-10 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Civic AI Report</p>
                    <h3 className="text-xl font-black text-slate-900 uppercase leading-none">{profile.name || "CITIZEN"}</h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary">
                    <Shield size={20} />
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                     <p className="text-[80px] font-black text-slate-900 leading-none tracking-tighter">{progress}%</p>
                     <p className="text-xs font-black text-emerald-500 uppercase tracking-widest mt-2">Ready to Vote</p>
                  </div>
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full bg-white border-4 border-slate-50 flex items-center justify-center text-lg shadow-sm">
                        {['🏆', '⭐️', '🔥'][i-1]}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                 <p className="text-white font-black text-xs uppercase tracking-widest bg-primary/80 px-4 py-2 rounded-full">Share Preview</p>
              </div>
            </motion.div>
          </div>

          {/* Action Section */}
          <div className="w-full lg:w-1/2 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Sparkles size={20} fill="currentColor" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 font-display uppercase tracking-tight">Personalized Invite</h3>
              </div>
              <p className="text-slate-500 font-medium leading-relaxed">
                When you share your report, we generate a high-resolution, secure card that showcases your democratic commitment. Your influence can motivate friends and family to join the movement.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button 
                size="lg"
                onClick={handleShare}
                disabled={isGenerating}
                className="h-16 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 group"
              >
                {isGenerating ? "Preparing..." : "Share Now"}
                <Share2 size={18} className="ml-2 group-hover:scale-110 transition-transform" />
              </Button>
              <Button 
                variant="outline"
                size="lg"
                onClick={handleDownload}
                disabled={isGenerating}
                className="h-16 rounded-2xl border-2 border-slate-100 bg-white hover:bg-slate-50"
              >
                Download PNG
                <Download size={18} className="ml-2" />
              </Button>
            </div>

            <AnimatePresence>
              {isShared && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100"
                >
                  <CheckCircle2 className="text-emerald-500" size={20} />
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Awesome! +50 Community Points Earned</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Card>

      {/* Community Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { label: "Community Impact", value: "High", icon: Heart, color: "text-rose-500", bg: "bg-rose-50" },
          { label: "Voters Inspired", value: "12", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Quest Status", value: "Complete", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
        ].map((stat, i) => (
          <Card key={i} className="p-6 bg-white border-none shadow-sm flex items-center gap-5">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner", stat.bg, stat.color)}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
              <p className="text-xl font-black text-slate-900 uppercase font-display">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};
