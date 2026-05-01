"use client";
import * as React from "react";
import { Volume2 } from "lucide-react";
import { speak } from "@/utils/speech";
import { useLocale } from "next-intl";
import { cn } from "@/utils/cn";

interface SpeakerButtonProps {
  text: string;
  className?: string;
}

export const SpeakerButton: React.FC<SpeakerButtonProps> = ({ text, className }) => {
  const locale = useLocale();
  const [isSpeaking, setIsSpeaking] = React.useState(false);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    speak(text, locale);
    
    // Simple visual feedback
    setIsSpeaking(true);
    setTimeout(() => setIsSpeaking(false), 2000);
  };

  return (
    <button
      onClick={handleSpeak}
      className={cn(
        "p-1.5 rounded-lg hover:bg-black/5 active:scale-90 transition-all text-slate-400 hover:text-primary shrink-0",
        isSpeaking && "text-primary animate-pulse",
        className
      )}
      title="Listen to text"
    >
      <Volume2 size={16} strokeWidth={2.5} />
    </button>
  );
};
