import { NextResponse } from 'next/server';
import { checkEligibility } from '@/lib/services/electionService';

export async function POST(request: Request) {
  const body = await request.json();
  const result = checkEligibility(body);
  return NextResponse.json(result);
}
