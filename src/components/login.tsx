'use client';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import Authenticated from './authenticated';

Amplify.configure({
  Auth: {
    region: 'ap-northeast-1',
    userPoolId: 'ap-northeast-1_ucp8tMk4K',
    userPoolWebClientId: '4n5fjc6qf88sbgfhq9gj7mur21',
  },
});

export default function Login() {
  return (
    <Authenticator>
      <Authenticated />
    </Authenticator>
  );
}
