import { NextResponse } from 'next/server';
import { sp } from '@/lib/samlify';

export async function GET() {
  const metadata = await sp.getMetadata();
  return new NextResponse(metadata, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
