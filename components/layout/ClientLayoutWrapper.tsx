"use client";
import * as React from "react";
import { usePathname } from "@/i18n/navigation";
import { TopHeader } from "./TopHeader";
import { PageTransition } from "@/components/ui/PageTransition";
import { TrustBadges } from "@/components/ui/TrustBadges";
import { LegalDisclaimer } from "@/components/ui/LegalDisclaimer";
import { cn } from "@/utils/cn";

export const ClientLayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isAssistant = pathname.includes('/assistant');

  return (
    <div className={cn(
      "flex-1 ml-[240px] flex flex-col min-h-screen",
      isAssistant && "h-screen overflow-hidden"
    )}>
      <TopHeader />
      <main className={cn(
        "flex-1 p-6 max-w-[1600px] mx-auto w-full",
        isAssistant && "p-0 h-full overflow-hidden flex flex-col"
      )}>
        <PageTransition className={cn(isAssistant && "flex-1 overflow-hidden flex flex-col")}>
          {children}
        </PageTransition>
        
        {!isAssistant && (
          <>
            <TrustBadges variant="minimal" className="mt-20 mb-10" />
            <LegalDisclaimer className="mb-10 opacity-50" />
          </>
        )}
      </main>
    </div>
  );
};
