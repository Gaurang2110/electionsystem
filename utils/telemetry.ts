import { logEventSafe as logFirebase } from "@/lib/firebase";
import { sendEventToCloud as logCloud } from "@/lib/cloudLogging";

/**
 * Unified Telemetry Utility
 * Provides a single entry point for all platform event logging.
 * Ensures consistent metadata (readiness, timestamp) across all services.
 */

export const telemetry = {
  /**
   * Logs a high-resiliency event to both Firebase and Google Cloud.
   */
  log: (eventName: string, payload: any, readiness: number = 0) => {
    try {
      // 1. Log to Firebase Analytics (Async/Safe)
      logFirebase(eventName, { ...payload, readiness });
      
      // 2. Log to Google Cloud Processing Pipeline (Batched/Async)
      logCloud(eventName, payload, readiness);
    } catch (err) {
      console.warn(`[Telemetry] Failed to log event ${eventName}:`, err);
    }
  }
};
