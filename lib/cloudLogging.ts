let eventBatch: any[] = [];
const BATCH_SIZE = 3;

/**
 * Google Cloud Function Event Logging
 * Safely sends events to a remote logging endpoint.
 * Now supports event batching and automatic retries.
 */
export async function sendEventToCloud(eventName: string, payload: any) {
  const event = {
    event: eventName,
    payload,
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : 'server',
  };

  eventBatch.push(event);

  // Trigger send when batch size reached
  if (eventBatch.length >= BATCH_SIZE) {
    const batchToSend = [...eventBatch];
    eventBatch = [];
    performSend(batchToSend, true);
  }
}

async function performSend(data: any, retry: boolean) {
  try {
    const response = await fetch('/api/log-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ batch: data }),
    });

    // If failed and retry is true, try once more after a delay
    if (!response.ok && retry) {
      setTimeout(() => performSend(data, false), 3000);
    }
  } catch (error) {
    if (retry) {
      setTimeout(() => performSend(data, false), 3000);
    }
  }
}
