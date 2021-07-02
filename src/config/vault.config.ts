import { registerAs } from '@nestjs/config';

export default registerAs('vault', () => ({
  baseURL: process.env.VAULT_API_BASEURL || 'https://apif.hubsecurity.io',
}));
