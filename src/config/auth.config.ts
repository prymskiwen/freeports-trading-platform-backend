import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  secret: process.env.TOKEN_SECRET || 'secr3t',
  type: process.env.TOKEN_TYPE || 'Bearer',
  access_expires_in: process.env.TOKEN_ACCESS_EXPIRES_IN || '1h',
  refresh_expires_in: process.env.TOKEN_REFRESH_EXPIRES_IN || '1d',
  authentication_two_factor_app_name:
    process.env.AUTHENTICATION_TWO_FACTOR_APP_NAME ||
    'Freeports trading platform',
}));
