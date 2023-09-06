import { NextResponse } from 'next/server';

function NotFound() {
  return new NextResponse(null, { status: 404 });
}
export const GET = NotFound;
export const POST = NotFound;
export const PUT = NotFound;
export const PATCH = NotFound;
export const DELETE = NotFound;
