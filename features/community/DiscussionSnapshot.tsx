"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { MessageCircle, Heart } from "lucide-react";
import discussions from "@/data/discussions.json";

export const DiscussionSnapshot: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="px-2">
        <h3 className="text-xl font-bold text-white font-display">Community Snapshot</h3>
        <p className="text-slate-500 text-xs font-medium">Real-time voter discussions</p>
      </div>
      
      <div className="grid gap-4">
        {discussions.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-4 bg-slate-900/40 border-white/5 hover:bg-slate-900/60 transition-all cursor-default">
              <div className="flex gap-4">
                <img src={post.avatar} alt={post.user} className="w-10 h-10 rounded-full border border-white/10" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-black text-white">{post.user}</span>
                    <span className="text-[10px] font-medium text-slate-500">{post.time}</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed mb-3">{post.text}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-slate-500">
                      <Heart size={14} className="group-hover:text-rose-500 transition-colors" />
                      <span className="text-[10px] font-bold">{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500">
                      <MessageCircle size={14} />
                      <span className="text-[10px] font-bold">Reply</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
