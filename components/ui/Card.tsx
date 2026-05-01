import * as React from "react";
import { cn } from "@/utils/cn";
import { motion, HTMLMotionProps } from "framer-motion";

export interface CardProps extends HTMLMotionProps<"div"> {
  hover?: boolean;
  glass?: boolean;
  variant?: "default" | "premium" | "glass" | "flat";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = true, variant = "default", children, ...props }, ref) => {
    
    const variants = {
      default: "bg-white border-slate-100 shadow-premium",
      premium: "bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#080C14] border-white/10 shadow-premium text-white",
      glass: "bg-white/40 backdrop-blur-3xl border-white/40 shadow-premium",
      flat: "bg-slate-50 border-slate-200 shadow-sm"
    };

    return (
      <motion.div
        ref={ref}
        whileHover={hover ? { 
          y: -4, 
          transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
        } : undefined}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 30
        }}
        className={cn(
          "rounded-[2rem] p-6 relative overflow-hidden border transition-all duration-500",
          variants[variant],
          className
        )}
        {...props}
      >
        {/* Inner Glow Polish for Premium feel */}
        <div className="absolute inset-0 pointer-events-none rounded-[2rem] ring-1 ring-inset ring-white/20 opacity-20" />
        
        {/* Subtle Radial Gradient Overlay on Hover (handled by CSS transition usually, but we keep it static for depth) */}
        {variant === "premium" && (
          <div className="absolute -inset-1/2 bg-gradient-to-tr from-primary/5 via-transparent to-white/5 opacity-50 blur-3xl pointer-events-none" />
        )}
        
        <div className="relative z-10">
          {children}
        </div>
      </motion.div>
    );
  }
);
Card.displayName = "Card";

export { Card };
