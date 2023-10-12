'use client';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Amplify, Auth } from 'aws-amplify';
import Authenticated from './authenticated';
import { useEffect, useState } from 'react';
import { CognitoUser } from 'amazon-cognito-identity-js';

Amplify.configure({
  Auth: {
    region: process.env.NEXT_PUBLIC_REGION,
    userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
    userPoolWebClientId: process.env.NEXT_PUBLIC_USER_POOL_WEB_CLIENT_ID,
  },
});

export default function Login() {
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const cognitoUser = await Auth.currentUserPoolUser();
        if (cognitoUser instanceof CognitoUser) {
          await new Promise<void>((resolve) => {
            cognitoUser.getUserAttributes(async (err) => {
              if (err) await Auth.signOut();
              resolve();
            });
          });
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsAuthChecking(false);
      }
    };

    checkSession();
  }, []);

  if (isAuthChecking) return <div>Auth state checking...</div>;

  return (
    <Authenticator>
      <Authenticated />
    </Authenticator>
  );
}
