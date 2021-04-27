import { registerAs } from '@nestjs/config';

export default registerAs('openapi', () => ({
  path: 'api',
  title: 'API Title',
  description: 'API description',
  version: '1.0',
  tag: 'tag',
}));
