import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  uri:
    process.env.MONGO_URI ||
    'mongodb://localhost/freeports-trading-platform-backend',
}));
