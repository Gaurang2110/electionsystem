import { logEventSafe as logFirebase } from "@/lib/firebase";
import { sendEventToCloud as logCloud } from "./cloudLogging";
import { safeExecuteSync } from "./reliability";

export const telemetry = {
  /**
   * Logs a high-resiliency event to both Firebase and Google Cloud.
   * Now includes enriched metadata: readiness, timestamp, and feature context.
   * Wrapped in safeExecuteSync for global error safety.
   */
  log: (eventName: string, payload: any, readiness: number = 0, feature?: string) => {
    safeExecuteSync(() => {
      const timestamp = new Date().toISOString();
      const enrichedPayload = { 
        ...payload, 
        readiness, 
        timestamp,
        feature: feature || eventName.split('_')[0] || 'general'
      };

      // 1. Log to Firebase Analytics (Async/Safe)
      logFirebase(eventName, enrichedPayload);
      
      // 2. Log to Google Cloud Processing Pipeline (Batched/Async)
      logCloud(eventName, enrichedPayload, readiness);
    }, undefined, 'telemetry');
  }
};
