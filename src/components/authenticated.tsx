'use client';

import { AccessCredentials } from '@/types/app-type';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import Login from './login';
import { Auth } from 'aws-amplify';

export default function Authenticated() {
  const searchParams = useSearchParams();
  const { push } = useRouter();

  useEffect(() => {
    const approve = async () => {
      try {
        const session = await Auth.currentSession();

        const idToken = session.getIdToken().getJwtToken();
        const accessToken = session.getAccessToken().getJwtToken();
        const refreshToken = session.getRefreshToken().getToken();

        // TODO: Standirdize error handling
        if (!idToken || !accessToken || !refreshToken) throw new Error('Authentication failure');

        const accessCredentials: AccessCredentials = {
          idToken: idToken,
          accessToken: accessToken,
          refreshToken: refreshToken,
          clientId: searchParams.get('client_id') as string,
          challenge: searchParams.get('code_challenge') as string,
          challengeMethod: searchParams.get('code_challenge_method') as string,
        };

        const res = await fetch('api/code', {
          method: 'POST',
          body: JSON.stringify(accessCredentials),
        });

        if (!res.ok) throw new Error('Authentication failure');

        const result = await res.json();
        const code = result.code;

        // Redirect to the client
        const state = searchParams.get('state') ?? '';
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
