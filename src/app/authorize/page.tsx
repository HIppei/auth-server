import Login from '@/components/login';
import { clientList } from '@/settings/clientList';

export default function Page({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  // TODO: Sanitize url paramenters
  const scope = searchParams.scope;
  const responseType = searchParams.response_type;
  const clientId = searchParams.client_id as string;
  const redirectUri = searchParams.redirect_uri;
  const challenge = searchParams.code_challenge;
  const challengeMethod = searchParams.code_challenge_method;

  if (!scope || !responseType || !clientId || !redirectUri || !challenge || !challengeMethod)
    return <div>Wrong request configuration.</div>;

  const appClient = clientList[clientId];

  // TODO: Standardize error responses
  if (!appClient) return <div>Unknown client.</div>;
  if (appClient.scope !== scope) return <div>Unknown client.</div>;
  if (appClient.redirect_urls !== redirectUri) return <div>Unknown client.</div>;

  return (
    <div>
      <Login />
    </div>
  );
}
