'use client';

import { AccessCredentials } from '@/constants/app-type';
import { Auth } from 'aws-amplify';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import Login from './login';

export default function Authenticated() {
  const searchParams = useSearchParams();
  const { push } = useRouter();

  useEffect(() => {
    const approve = async () => {
      try {
        // Establish session and get authorization code
        const session = await Auth.currentSession();
        const accessCredentials: AccessCredentials = {
          accessToken: session.getAccessToken().getJwtToken(),
          idToken: session.getIdToken().getJwtToken(),
          refreshToken: session.getRefreshToken().getToken(),
          clientId: searchParams.get('client_id') as string,
          challenge: searchParams.get('code_challenge') as string,
          challengeMethod: searchParams.get('code_challenge_method') as string,
        };

        const res = await fetch('api/session', {
          method: 'POST',
          body: JSON.stringify(accessCredentials),
        });

        if (!res.ok) throw new Error('Authentication failure');

        const result = await res.json();
        const code = result.code;

        // Redirect to the client
        const state = searchParams.get('state') as string;
        const params = new URLSearchParams({ code: code, state: state });
        const redirectUri = `${searchParams.get('redirect_uri')}?${params.toString()}`;

        push(redirectUri);
      } catch (err) {
        console.log(err);
        return <Login />;
      }
    };

    approve();
  }, []);

  return <div>Authenticated</div>;
}
