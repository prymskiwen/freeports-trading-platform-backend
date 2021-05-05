import { registerAs } from '@nestjs/config';

export default registerAs('openapi', () => ({
  path: 'api/v1',
  title: 'API Title',
  description: 'API description',
  version: '1.0',
  tag: 'tag',
}));
