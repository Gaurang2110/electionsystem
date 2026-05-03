import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, logEvent, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDummyKey-For-Setup",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "civic-ai-demo.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "civic-ai-demo",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "civic-ai-demo.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-ABCDEF123"
};

// Helper to check if a key is a dummy or empty
const isValidKey = (key?: string) => key && key.length > 10 && !key.includes("DummyKey");

// Initialize Firebase only if we have a real-looking key
const hasValidConfig = isValidKey(firebaseConfig.apiKey);

const app = (getApps().length === 0 && hasValidConfig) 
  ? initializeApp(firebaseConfig) 
  : getApps()[0] || null;

export const isFirebaseActive = !!app && hasValidConfig;

export const logFirebaseEvent = async (eventName: string, params?: any) => {
  if (typeof window !== "undefined" && isFirebaseActive) {
    const supported = await isSupported();
    if (supported && app) {
      const analytics = getAnalytics(app);
      logEvent(analytics, eventName, params);
    }
  }
};

/**
 * High-resiliency Firebase Event Logger.
 * Wraps analytics calls in try/catch to ensure non-blocking, zero-side-effect tracking.
 */
export const logEventSafe = (eventName: string, params?: any) => {
  if (typeof window === "undefined" || !isFirebaseActive) return;
  
  // Use a promise to ensure it doesn't block the main execution flow
  isSupported().then(supported => {
    if (supported && app) {
      try {
        const analytics = getAnalytics(app);
        logEvent(analytics, eventName, params);
      } catch (err) {
        console.warn(`[Firebase Analytics] Failed to log event ${eventName}:`, err);
      }
    }
  }).catch(() => {
    // Silently fail if isSupported errors
  });
};

