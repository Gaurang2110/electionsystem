export const LOCALE_TO_VOICE_LANG: Record<string, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  gu: 'gu-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
};

export const speak = (text: string, locale: string) => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const targetLang = LOCALE_TO_VOICE_LANG[locale] || 'en-IN';
  utterance.lang = targetLang;
  
  // Find the best voice for this language
  const voices = window.speechSynthesis.getVoices();
  const bestVoice = voices.find(v => v.lang.includes(targetLang) || v.lang.includes(locale));
  
  if (bestVoice) {
    utterance.voice = bestVoice;
  }

  utterance.rate = 1.0; 
  utterance.pitch = 1.0;

  window.speechSynthesis.speak(utterance);
};

export const stopSpeaking = () => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
};
