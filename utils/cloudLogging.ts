let eventBatch: any[] = [];
const BATCH_SIZE = 3;
let debounceTimer: NodeJS.Timeout | null = null;
const DEBOUNCE_MS = 2000;

/**
 * Google Cloud Function Event Logging
 * Safely sends events to a remote logging endpoint.
 * Now supports event batching, debouncing, and automatic retries.
 */
export async function sendEventToCloud(eventName: string, payload: any, readiness?: number) {
  const event = {
    event: eventName,
    payload,
    severity: eventName.includes('error') ? 'ERROR' : eventName.includes('fallback') ? 'WARNING' : 'INFO',
    serviceContext: { service: 'civic-ai-assistant', version: '1.0.0' },
    context: typeof window !== 'undefined' ? { 
      url: window.location.href,
      userAgent: navigator.userAgent
    } : { source: 'server' },
  };

  eventBatch.push(event);

  if (debounceTimer) clearTimeout(debounceTimer);

  // Trigger send if batch size reached OR after debounce period
  if (eventBatch.length >= BATCH_SIZE) {
    sendNow();
  } else {
    debounceTimer = setTimeout(sendNow, DEBOUNCE_MS);
  }
}

function sendNow() {
  if (eventBatch.length === 0) return;
  const batchToSend = [...eventBatch];
  eventBatch = [];
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = null;
  performSend(batchToSend);
}

import { retryAsync } from '@/utils/reliability';

async function performSend(data: any) {
  try {
    await retryAsync(async () => {
      const response = await fetch('/api/log-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ batch: data }),
      });
      
      if (!response.ok) throw new Error(`Logging failed: ${response.statusText}`);
      return response;
    }, 1); // Retry once
  } catch (error) {
    // Logging failure is non-blocking, ignore after retry
    console.warn('[Cloud Logging] Final failure after retries, ignoring:', error);
  }
}
