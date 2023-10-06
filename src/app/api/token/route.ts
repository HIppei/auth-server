import dataStore from '@/data-store/data-store';
import { clientList } from '@/settings/clientList';
import { createHash } from 'crypto';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  // Check token request parameters
  const clientId = body.client_id;
  const clientSecret = body.client_secret;
  const grantType = body.grant_type;
  const verifier = body.code_verifier;

  if (!clientId || !clientSecret || !grantType || !verifier) {
    return NextResponse.json({ error: 'Wrong request configuration' }, { status: 401 });
  }

  const appClient = clientList[clientId];
  if (!appClient) return NextResponse.json({ error: 'invalid_client' }, { status: 401 });
  if (appClient.client_secret !== clientSecret) return NextResponse.json({ error: 'Unknown client' }, { status: 401 });
  if (appClient.grant_type !== grantType) return NextResponse.json({ error: 'Unknown client' }, { status: 401 });

  // Retrieve access credentials using the code in the body
  const accessCredentials = dataStore.records[body.code];

  if (!accessCredentials) return NextResponse.json({ error: 'Invalid_code' }, { status: 400 });
  if (accessCredentials.clientId !== clientId) return NextResponse.json({ error: 'Client mismatch' }, { status: 400 });

  // PKCE verify
  let result = verifier;
  if (accessCredentials.challengeMethod === 'S256')
    result = createHash('sha256')
      .update(verifier)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

  if (result !== accessCredentials.challenge) return NextResponse.json({ error: 'Client mismatch' }, { status: 400 });

  return NextResponse.json(
    {
      accessToken: accessCredentials.accessToken,
      idToken: accessCredentials.idToken,
      refreshToken: accessCredentials.refreshToken,
    },
    { status: 200 }
  );
}
