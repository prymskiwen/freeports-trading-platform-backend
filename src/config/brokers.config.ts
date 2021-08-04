import { registerAs } from '@nestjs/config';

export default registerAs('brokers', () => [
  {
    name: 'B2C2',
    accessToken: process.env.BROKERS_B2C2_ACCESS_TOKEN,
  },
]);
