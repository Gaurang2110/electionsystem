import { NextResponse } from 'next/server';
import { getBoothByPincode } from '@/lib/services/electionService';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pincode = searchParams.get('pincode');

  if (!pincode) {
    return NextResponse.json({ error: 'Pincode is required' }, { status: 400 });
  }

  const results = getBoothByPincode(pincode);
  return NextResponse.json(results);
}
