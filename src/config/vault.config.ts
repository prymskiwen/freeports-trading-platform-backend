import { registerAs } from '@nestjs/config';

export default registerAs('vault', () => ({
  baseURL: process.env.VAULT_API_BASEURL || 'https://apif.hubsecurity.io',
  privateKey: process.env.VAULT_API_PRIVATE_KEY || 'private.key',
  publicKey: process.env.VAULT_API_PUBLIC_KEY || 'public.key',
}));
