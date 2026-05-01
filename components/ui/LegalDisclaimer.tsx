"use client";
import * as React from "react";
import { Info, ExternalLink } from "lucide-react";
import { cn } from "@/utils/cn";

interface LegalDisclaimerProps {
  className?: string;
  showIcon?: boolean;
}

export const LegalDisclaimer: React.FC<LegalDisclaimerProps> = ({ className, showIcon = true }) => {
  return (
    <div className={cn("flex flex-col gap-2 items-center text-center px-4", className)}>
      <div className="flex items-center justify-center gap-2 text-slate-500">
        {showIcon && <Info size={12} className="shrink-0" />}
        <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed max-w-md">
          This platform provides informational guidance and is not affiliated with official election authorities.
        </p>
      </div>
      <a 
        href="https://voters.eci.gov.in" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-[9px] font-black text-primary uppercase tracking-tighter hover:text-white transition-colors"
      >
        Visit Official ECI Website
        <ExternalLink size={10} />
      </a>
    </div>
  );
};
