import { NextRequest, NextResponse } from 'next/server';

export const GET = async function (req: NextRequest) {
  return NextResponse.json({ status: 'ok' });
};
