import { registerAs } from '@nestjs/config';
import { APIV1Module } from 'src/module/api-v1/api.v1.module';

export default registerAs('openapi', () => [
  {
    path: 'api/v1',
    title: 'API for features',
    description: 'API description',
    version: '1.0.0',
    tag: 'tag',
    auth: true,
    root: [APIV1Module],
  },
]);
