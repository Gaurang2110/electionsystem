"use client";
import * as React from "react";
import { useAppStore } from "@/store/useAppStore";
import { useLocale } from "next-intl";

export const useVoiceGuidance = () => {
  const { isSimpleMode } = useAppStore();
  const locale = useLocale();

  const speak = (text: string, force: boolean = false) => {
    if ((!isSimpleMode && !force) || !window.speechSynthesis) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    // Map locales to BCP 47 tags
    const langMap: Record<string, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      gu: 'gu-IN',
      bn: 'bn-IN',
      mr: 'mr-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      pa: 'pa-IN'
    };
    utterance.lang = langMap[locale] || 'en-IN';
    
    window.speechSynthesis.speak(utterance);
  };

  return { speak };
};
