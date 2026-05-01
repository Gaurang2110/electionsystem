import * as React from "react";
import { cn } from "@/utils/cn";
import { motion, HTMLMotionProps } from "framer-motion";

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "variant"> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "accent";
  size?: "sm" | "md" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "premium-gradient text-white shadow-lg shadow-indigo-500/20 active:shadow-inner",
      secondary: "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20",
      accent: "bg-purple-600 text-white shadow-lg shadow-purple-500/20",
      outline: "border-2 border-white/10 text-slate-300 hover:border-primary hover:text-white bg-white/5 shadow-sm",
      ghost: "text-slate-400 hover:bg-white/5 hover:text-white",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm rounded-xl font-bold",
      md: "px-6 py-3.5 text-base rounded-2xl font-bold tracking-tight",
      lg: "px-8 py-4.5 text-lg rounded-[1.5rem] font-bold tracking-tight",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98, y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={cn(
          "inline-flex items-center justify-center transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none font-display",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
