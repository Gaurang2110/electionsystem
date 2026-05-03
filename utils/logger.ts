import { logFirebaseEvent, isFirebaseActive } from "@/lib/firebase";

/**
 * Universal Safe Logger Utility
 * Centralizes the telemetry logging pattern to ensure zero UI crashes.
 * Wraps analytics calls in try/catch for non-blocking, zero-side-effect tracking.
 */
export const logEventSafe = async (eventName: string, params?: any) => {
  try {
    if (isFirebaseActive) {
      // Fire-and-forget to Firebase
      logFirebaseEvent(eventName, params).catch(() => {
        // Silent catch for internal firebase errors
      });
    } else {
      // Fallback for development/testing environments without Firebase keys
      if (process.env.NODE_ENV === 'development') {
        console.log(`[SafeLogger] ${eventName}`, params);
      }
    }
  } catch (error) {
    console.warn(`[SafeLogger] Failed to log event ${eventName}:`, error);
  }
};
