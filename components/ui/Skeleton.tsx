import * as React from "react";
import { cn } from "@/utils/cn";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className, 
  variant = "rectangular", 
  ...props 
}) => {
  return (
    <div
      className={cn(
        "animate-shimmer rounded-md bg-gray-100",
        variant === "text" && "h-4 w-full",
        variant === "circular" && "h-12 w-12 rounded-full",
        variant === "rectangular" && "h-32 w-full",
        className
      )}
      {...props}
    />
  );
};
