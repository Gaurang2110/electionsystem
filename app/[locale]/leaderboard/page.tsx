"use client";
import * as React from "react";
import { Trophy, Medal, Star, ArrowUpRight, Search } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";

const TOP_USERS = [
  { rank: 1, name: "Priya Singh", points: 4850, badge: "Master Citizen", color: "text-amber-400" },
  { rank: 2, name: "Arjun Mehta", points: 4200, badge: "Democracy Hero", color: "text-slate-400" },
  { rank: 3, name: "Sneha Kapur", points: 3950, badge: "Voter Advocate", color: "text-amber-700" },
  { rank: 4, name: "You", points: 3250, badge: "Explorer", color: "text-primary", isUser: true },
  { rank: 5, name: "Rahul Varma", points: 3100, badge: "Active Voter", color: "text-slate-500" },
  { rank: 6, name: "Ananya Das", points: 2900, badge: "Community Guide", color: "text-slate-500" },
];

export default function LeaderboardPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-slate-900 font-display">Leaderboard</h1>
        <p className="text-slate-500 font-medium">Compete with citizens across India to promote voting awareness.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { label: "Current Rank", value: "#42", sub: "Top 2%", icon: Trophy, color: "text-amber-500", bg: "bg-amber-50" },
          { label: "Total Points", value: "3,250", sub: "+450 this week", icon: Star, color: "text-primary", bg: "bg-indigo-50" },
          { label: "Badges", value: "12", sub: "3 new unlocked", icon: Medal, color: "text-emerald-500", bg: "bg-emerald-50" },
        ].map((stat, i) => (
          <Card key={i} className={cn("p-6 border-none shadow-sm", stat.bg)}>
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-3 rounded-xl bg-white shadow-sm", stat.color)}>
                <stat.icon size={24} />
              </div>
              <ArrowUpRight size={16} className="text-slate-300" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{stat.value}</p>
            <p className="text-[10px] font-bold text-slate-500 mt-1">{stat.sub}</p>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden border-slate-100 shadow-xl shadow-slate-200/50">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Top Contributors</h3>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-primary transition-all w-48"
            />
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {TOP_USERS.map((user) => (
            <div 
              key={user.rank} 
              className={cn(
                "p-4 px-6 flex items-center gap-6 transition-colors",
                user.isUser ? "bg-primary/5" : "hover:bg-slate-50"
              )}
            >
              <div className={cn("w-8 text-lg font-black italic", user.color)}>
                #{user.rank}
              </div>
              <div className="w-12 h-12 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center text-slate-400 font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h4 className="font-black text-slate-900 text-sm">{user.name} {user.isUser && "(You)"}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.badge}</p>
              </div>
              <div className="text-right">
                <p className="font-black text-slate-900">{user.points.toLocaleString()}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Points</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
