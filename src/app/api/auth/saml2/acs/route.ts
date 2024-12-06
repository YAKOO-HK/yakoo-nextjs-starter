import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { createSigner } from 'fast-jwt';
import { env } from '@/env';
import { responseJson } from '@/lib/api-utils';
import { idp, sp } from '@/lib/samlify';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const body = Object.fromEntries(formData);
    const { extract } = await sp.parseLoginResponse(idp, 'post', { body });
    // console.log({ extract });
    const expiresIn =
      new Date(extract.conditions.notOnOrAfter).getTime() - new Date(extract.conditions.notBefore).getTime();
    const signSync = createSigner({
      key: env.AUTH_SECRET, // reuse the nextauth secret with HS256
      algorithm: 'HS256',
      expiresIn: expiresIn,
      aud: extract.audience,
      iss: extract.issuer,
      sub: extract.nameID,
    });
    const token = signSync(extract.attributes);
    (await cookies()).set('x-saml-token', token, {
      path: '/',
      sameSite: 'strict',
      secure: true,
      httpOnly: true,
      maxAge: expiresIn / 1000,
    });
    return new Response(null, {
      status: 302,
      headers: {
        Location: `${env.NEXT_PUBLIC_SITE_URL}/login/saml`,
      },
    });
  } catch (e) {
    console.warn(e);
    return new Response(null, {
      status: 302,
      headers: {
        Location: `${env.NEXT_PUBLIC_SITE_URL}/login?error=${e}`,
      },
    });
  }
}

export async function GET(_req: NextRequest) {
  const samlToken = (await cookies()).get('x-saml-token');
  return responseJson({ token: samlToken?.value ?? '' });
}
