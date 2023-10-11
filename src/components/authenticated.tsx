'use client';

import { AccessCredentials } from '@/types/app-type';
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
        // Get authorization code
        const keyPrefix = `CognitoIdentityServiceProvider.${process.env.NEXT_PUBLIC_USER_POOL_WEB_CLIENT_ID}`;
        const userName = localStorage.getItem(`${keyPrefix}.LastAuthUser`);
        const idToken = localStorage.getItem(`${keyPrefix}.${userName}.idToken`);
        const accessToken = localStorage.getItem(`${keyPrefix}.${userName}.accessToken`);
        const refreshToken = localStorage.getItem(`${keyPrefix}.${userName}.refreshToken`);

        if (!userName || !idToken || !accessToken || !refreshToken) throw new Error('Authentication failure');

        const accessCredentials: AccessCredentials = {
          userName: userName,
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
