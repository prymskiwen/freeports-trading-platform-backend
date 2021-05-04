import { registerAs } from '@nestjs/config';

export default registerAs('common', () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
}));
