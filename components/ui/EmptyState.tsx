import * as React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center",
        className
      )}
    >
      <div className="w-20 h-20 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-400 mb-6 shadow-inner-white border border-gray-100">
        <Icon size={32} strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">{title}</h3>
      <p className="text-gray-500 max-w-[260px] leading-relaxed mb-8">{description}</p>
      {action && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
};
