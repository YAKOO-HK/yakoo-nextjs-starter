import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { addDays } from 'date-fns';
import { responseJson } from '@/lib/api-utils';

export const GET = async () => {
  const cookieStore = cookies();
  return responseJson({ accepted: Boolean(cookieStore.get('accepted-cookie-usage')) });
};

export const POST = async () => {
  const cookieStore = cookies();
  cookieStore.set({
    name: 'accepted-cookie-usage',
    value: '1',
    expires: addDays(new Date(), 365),
    path: '/', // For all paths
  });
  return new NextResponse(null, { status: 204 });
};
