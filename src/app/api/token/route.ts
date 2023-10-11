import DataStore from '@/data-store/data-store';
import { clientList } from '@/settings/clientList';
import { createHash } from 'crypto';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();

  // Check if the authorization header exists
  let clientId;
  let clientSecret;
  const authorization = req.headers.get('Authorization');
  if (authorization) {
    [clientId, clientSecret] = authorization.split(' ')[1].split(':');
  }

  if (!clientId || !clientSecret) return NextResponse.json({ error: 'invalid_client' }, { status: 401 });

  // Check contents
  const code = body.code;
  const grantType = body.grant_type;
  const verifier = body.code_verifier;

  if (!code || !grantType || !verifier) return NextResponse.json({ error: 'invalid_client' }, { status: 401 });

  const appClient = clientList[clientId];
  if (!appClient || appClient.client_secret !== clientSecret)
    return NextResponse.json({ error: 'invalid_client' }, { status: 401 });
  if (appClient.grant_type !== grantType)
    return NextResponse.json({ error: 'unsupported_grant_type' }, { status: 400 });

  // Retrieve access credentials using the code
  const accessCredentials = { ...DataStore.records[code] };
  DataStore.remove(code);

  if (!accessCredentials || accessCredentials.clientId !== clientId)
    return NextResponse.json({ error: 'invalid_code' }, { status: 400 });

  // Verify PKCE contents
  let result = verifier;
  if (accessCredentials.challengeMethod === 'S256')
    result = createHash('sha256')
      .update(verifier)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

  if (result !== accessCredentials.challenge) return NextResponse.json({ error: 'invalid_client' }, { status: 400 });

  return NextResponse.json(
    {
      token_type: 'Bearer',
      id_token: accessCredentials.idToken,
      access_token: accessCredentials.accessToken,
      refresh_token: accessCredentials.refreshToken,
    },
    { status: 200 }
  );
}
