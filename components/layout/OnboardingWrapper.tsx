"use client";
import * as React from "react";
import { useAppStore } from "@/store/useAppStore";
import { OnboardingScreen } from "@/features/onboarding/OnboardingScreen";
import { LanguageSelectionScreen } from "@/features/onboarding/LanguageSelectionScreen";

export const OnboardingWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isOnboarded } = useAppStore();
  const [mounted, setMounted] = React.useState(false);
  const [showLangSelection, setShowLangSelection] = React.useState(false);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    
    const savedLocale = localStorage.getItem("preferred-locale");
    if (!savedLocale) {
      setShowLangSelection(true);
    }
  }, []);

  if (!mounted) return null;

  return (
    <>
      {showLangSelection && (
        <LanguageSelectionScreen onSelect={() => setShowLangSelection(false)} />
      )}
      {!isOnboarded && !showLangSelection && <OnboardingScreen />}
      {children}
    </>
  );
};
