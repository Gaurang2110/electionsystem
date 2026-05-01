"use client";
import * as React from "react";
import { useRouter } from "@/i18n/navigation";
import { useAppStore } from "@/store/useAppStore";
import { useVoiceGuidance } from "./useVoiceGuidance";
import { useLocale } from "next-intl";

export const useVoiceControl = () => {
  const router = useRouter();
  const locale = useLocale();
  const { getNextBestAction, logEvent } = useAppStore();
  const { speak } = useVoiceGuidance();
  const [isListening, setIsListening] = React.useState(false);
  const [transcript, setTranscript] = React.useState("");
  const recognitionRef = React.useRef<any>(null);

  React.useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
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
      recognitionRef.current.lang = langMap[locale] || 'en-IN';

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const currentText = (finalTranscript || interimTranscript).toLowerCase();
        setTranscript(currentText);

        // Command Matching
        if (finalTranscript) {
          handleCommand(currentText);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        setIsListening(false);
      };
    }
  }, []);

  const handleCommand = (command: string) => {
    logEvent(`voice_command_${command}`);
    if (command.includes("eligibility")) {
      speak("Navigating to Eligibility Check", true);
      router.push("/eligibility");
    } else if (command.includes("map") || command.includes("booth")) {
      speak("Opening Polling Booth Map", true);
      router.push("/map");
    } else if (command.includes("journey") || command.includes("roadmap")) {
      speak("Showing your personal journey", true);
      router.push("/journey");
    } else if (command.includes("next") || command.includes("do now")) {
      const next = getNextBestAction();
      speak(`Your next recommended step is ${next.label}. I am taking you there now.`, true);
      router.push(next.link as any);
    } else if (command.includes("home") || command.includes("dashboard")) {
      speak("Going to Home Dashboard", true);
      router.push("/");
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      recognitionRef.current?.start();
      setIsListening(true);
      speak("I am listening. Try saying, what should I do next?", true);
    }
  };

  return { isListening, transcript, toggleListening, hasSupport: !!recognitionRef.current };
};
