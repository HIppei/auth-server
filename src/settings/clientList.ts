export const clientList: {
  [client_id: string]: { redirect_urls: string; scope: string; client_secret: string; grant_type: string };
} = {
  12345: {
    redirect_urls: 'http://localhost:3001/callback',
    scope: 'openid profile email',
    client_secret: 'secret',
    grant_type: 'authorization_code',
  },
  6789: {
    redirect_urls: 'http://localhost:3002/callback',
    scope: 'openid profile email',
    client_secret: 'secret',
    grant_type: 'authorization_code',
  },
};
