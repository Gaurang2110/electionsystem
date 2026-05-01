import * as React from "react";
import { cn } from "@/utils/cn";
import { motion, HTMLMotionProps } from "framer-motion";

export interface CardProps extends HTMLMotionProps<"div"> {
  hover?: boolean;
  glass?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = true, glass = false, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={hover ? { 
          y: -8, 
          rotateX: 2,
          rotateY: -1,
          scale: 1.01,
          boxShadow: "0 40px 80px -20px rgba(0,0,0,0.6)"
        } : undefined}
        whileTap={hover ? { scale: 0.985 } : undefined}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          boxShadow: { duration: 0.4 }
        }}
        style={{ perspective: "1000px" }}
        className={cn(
          "bg-slate-900/60 rounded-[2.5rem] p-8 shadow-premium border border-white/5 relative",
          glass && "glass",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
Card.displayName = "Card";

export { Card };
