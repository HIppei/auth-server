import { AccessCredentials } from '@/constants/app-type';
import dataStore from '@/data-store/data-store';
import { createHash } from 'crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const sessionSecret = process.env.SESSION_SECRET;

export async function POST(req: Request) {
  // TODO: Rest API protection
  const body: AccessCredentials = await req.json();

  // Generate a hash from tokens for the token-code exchange
  const code = createHash('sha256').update(JSON.stringify(body)).digest('hex');

  // Store the code and its corresponding tokens
  dataStore.insert(code, body);

  // Just signify that this session is generated by this server. Data itself does not have any meaning.
  const data = code.substring(20);
  const sigData = createHash('sha256')
    .update(data + sessionSecret)
    .digest('hex');
  const cookieValue = `${data}:${sigData}`;
  cookies().set('sso-session', cookieValue, {
    secure: true,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 180,
  });

  return NextResponse.json({ code: code }, { status: 200 });
}
