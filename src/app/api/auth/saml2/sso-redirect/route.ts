import { NextRequest, NextResponse } from 'next/server';
import { idp, sp } from '@/lib/samlify';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export async function GET(_req: NextRequest) {
  const { context } = sp.createLoginRequest(idp, 'redirect');
  // console.log({ context });
  return NextResponse.redirect(context);
}
