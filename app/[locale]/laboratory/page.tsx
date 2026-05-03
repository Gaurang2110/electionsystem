"use client";
import * as React from "react";
import { FlaskConical, Beaker, Zap, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";

export default function LaboratoryPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-slate-900 font-display">Innovation Lab</h1>
        <p className="text-slate-500 font-medium">Experimental features and election simulations.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-8 space-y-4 border-dashed border-2 border-primary/20 bg-primary/5">
          <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
            <Beaker size={24} />
          </div>
          <h2 className="text-xl font-black text-slate-900">Virtual EVM Sim</h2>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            Practice using a virtual Electronic Voting Machine. Understand the VVPAT process and how your vote is secured.
          </p>
          <div className="pt-4">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">Under Construction</span>
          </div>
        </Card>

        <Card className="p-8 space-y-4 border-dashed border-2 border-amber-200 bg-amber-50/50">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Zap size={24} />
          </div>
          <h2 className="text-xl font-black text-slate-900">AI Fact-Check Hub</h2>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            Test our real-time deepfake detection and social media rumor monitoring tools for the upcoming elections.
          </p>
          <div className="pt-4">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-black uppercase tracking-widest">Coming Soon</span>
          </div>
        </Card>
      </div>

      <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white flex items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
        <div className="flex-1 space-y-2 relative z-10">
          <h3 className="text-xl font-black">Want to be a beta tester?</h3>
          <p className="text-slate-400 text-sm font-medium">Join our community of digital volunteers helping secure the 2026 elections.</p>
        </div>
        <button className="px-6 py-3 rounded-xl bg-white text-slate-900 font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform shrink-0 relative z-10">
          Apply Now
        </button>
      </div>
    </div>
  );
}
