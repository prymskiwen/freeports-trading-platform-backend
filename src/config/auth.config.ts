import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  secret: process.env.TOKEN_SECRET || 'secr3t',
  type: process.env.TOKEN_TYPE || 'Bearer',
  access_expires_in: process.env.TOKEN_ACCESS_EXPIRES_IN || '1h',
  refresh_expires_in: process.env.TOKEN_REFRESH_EXPIRES_IN || '1d',
  TWO_FACTOR_AUTHENTICATION_APP_NAME:
    process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME ||
    'freeports trading platform',
}));
