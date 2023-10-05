import Login from '@/components/login';
import { clientList } from '@/settings/clientList';

export default function Page({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  // TODO: Sanitize url paramenters
  const scope = searchParams.scope;
  const responseType = searchParams.response_type;
  const clientId = searchParams.client_id as string;
  const redirectUri = searchParams.redirect_uri;

  if (!scope || !responseType || !clientId || !redirectUri) return <div>Wrong request configuration.</div>;

  const appClient = clientList[clientId];

  if (!appClient) return <div>Unknown client.</div>;
  if (appClient.scope !== scope) return <div>Unknown client.</div>;
  if (appClient.redirect_urls !== redirectUri) return <div>Unknown client.</div>;

  // TODO: Check current session

  return (
    <div>
      <Login />
    </div>
  );
}
