import { NextResponse } from 'next/server';
import { getElectionTimeline } from '@/lib/services/electionService';

export async function GET() {
  const timeline = getElectionTimeline();
  return NextResponse.json(timeline);
}
