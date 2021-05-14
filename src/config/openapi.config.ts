import { registerAs } from '@nestjs/config';
import { APIV0Module } from 'src/module/api-v0/api.v0.module';
import { APIV1Module } from 'src/module/api-v1/api.v1.module';

export default registerAs('openapi', () => [
  {
    path: 'api/v0',
    title: 'API for all schemas',
    description: 'API description',
    version: '0.0.1',
    tag: 'tag',
    auth: false,
    root: [APIV0Module],
  },
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
