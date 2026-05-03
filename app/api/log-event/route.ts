import { NextResponse } from 'next/server';

/**
 * Next.js API Route to handle event logging.
 * This acts as a bridge to Google Cloud Function / BigQuery / Logging.
 */
// Module-level state for event summary (In-memory for demo purposes)
let totalEventsLogged = 0;
let lastEventLogged = 'None';
const eventCategories: Record<string, number> = {};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const now = new Date();
    const timeGroup = `${now.getHours()}:00`; // Simple hour-based grouping
    
    const processEvent = (event: any) => {
      // Basic Validation: Reject empty events or missing names
      if (!event || !event.event) {
        console.warn('[CLOUD_PIPELINE] Rejecting invalid event:', event);
        return;
      }

      totalEventsLogged++;
      lastEventLogged = event.event;
      
      // Categorization Logic
      const category = event.event.split('_')[0] || 'general';
      eventCategories[category] = (eventCategories[category] || 0) + 1;
      
      const severity = event.severity || 'INFO';
      console.log(`[CLOUD_PIPELINE] [${timeGroup}] [${severity}] [${category.toUpperCase()}] ${event.event} | Readiness: ${event.readiness || 0}%`, JSON.stringify(event.payload));
    };

    // Support both single events and batches
    if (body.batch && Array.isArray(body.batch)) {
      body.batch.forEach(processEvent);
    } else if (body.event) {
      processEvent(body);
    } else {
      // Reject empty payloads
      return NextResponse.json({ status: 'ignored', reason: 'empty_payload' }, { status: 200 });
    }

    // Return an event summary in the response (optional/non-blocking for client)
    return NextResponse.json({ 
      status: 'logged',
      event_summary: {
        totalEvents: totalEventsLogged,
        lastEvent: lastEventLogged,
        categories: eventCategories,
        system_health: 'optimal',
        last_categorization: timeGroup
      }
    }, { status: 200 });
  } catch (error) {
    // Fail silently but return a valid response
    return NextResponse.json({ status: 'error' }, { status: 200 });
  }
}
