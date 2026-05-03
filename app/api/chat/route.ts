import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';
import { getFAQResponse } from '@/lib/services/electionService';

// Initialize Gemini
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
// Using gemini-2.0-flash-exp as the next-gen high performance model
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-3-flash-preview" }) : null;

// Basic Rate Limiting (In-memory)
const rateLimitMap = new Map<string, { count: number, resetAt: number }>();
const LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10;

const SYSTEM_PROMPT = `You are a helpful, human-like election assistant for India. 
Your goal is to make the voting process feel simple and stress-free.

USER CONTEXT:
- Name: {userName}
- Readiness Score: {readiness}%
- Next Step in App: {nextAction}
- Eligibility: {eligibilityStatus}
- Last Activity: {lastActivity}
- Current Screen: {currentScreen}

Style Guidelines:
- Tone: Extremely simple, friendly, and non-technical. Use everyday language.
- Structure for every response:
  1. A short, direct answer (max 2 sentences).
  2. Clear, numbered steps if the user needs to do something.
  3. "Your Next Best Action": A final line telling the user exactly what to do next based on their app context.
- Length: Be concise. Don't use complicated legal terms.
- Neutrality: Stay neutral and don't mention any political parties.

If the user asks "What should I do next?", point them directly to their "{nextAction}".

Respond in the language requested.
Current Language: {locale}`;

export async function POST(request: Request) {
  try {
    const { message, locale = 'en', userContext } = await request.json();
    
    const readiness = userContext?.readiness || 0;
    const userName = userContext?.userName || 'Citizen';
    const nextAction = userContext?.nextRecommendedAction || 'Complete your profile';
    const eligibilityStatus = userContext?.isEligible ? 'Eligible' : 'Check pending';
    const lastActivity = userContext?.lastActivity || 'None';
    const currentScreen = userContext?.currentScreen || 'Dashboard';

    const dynamicPrompt = SYSTEM_PROMPT
      .replace('{locale}', locale)
      .replace('{userName}', userName)
      .replace('{readiness}', readiness.toString())
      .replace('{nextAction}', nextAction)
      .replace('{eligibilityStatus}', eligibilityStatus)
      .replace('{lastActivity}', lastActivity)
      .replace('{currentScreen}', currentScreen);
    
    // 0. Simple Rate Limiting
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    const now = Date.now();
    const userLimit = rateLimitMap.get(ip);

    if (userLimit && now < userLimit.resetAt) {
      if (userLimit.count >= MAX_REQUESTS) {
        return NextResponse.json({ 
          error: 'Too many requests. Please wait a minute.',
          fallback: true
        }, { status: 429 });
      }
      userLimit.count++;
    } else {
      rateLimitMap.set(ip, { count: 1, resetAt: now + LIMIT_WINDOW });
    }

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // 1. Try Gemini API first
    if (model) {
      try {
        const prompt = `${dynamicPrompt}\n\nUser Question: ${message}`;
        
        // Basic timeout to prevent long hangs
        const result = await Promise.race([
          model.generateContent(prompt),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 8000))
        ]) as any;

        const responseText = result.response.text();

        if (responseText) {
          return NextResponse.json({ 
            text: responseText,
            source: 'gemini'
          });
        }
      } catch (geminiError) {
        console.warn("Gemini API failed or timed out, falling back to local data:", geminiError);
        console.log('[RELIABILITY] fallback_triggered: ai_assistant');
      }
    }

    // 2. Fallback to local FAQ matching
    console.log('[RELIABILITY] fallback_triggered: local_faq_activated');
    const localResponse = getFAQResponse(message);
    
    // Simulate thinking delay for consistent UX
    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json({ 
      text: localResponse,
      source: 'local_fallback'
    });

  } catch (error) {
    console.error("Chat API Critical Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
