import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ClearerModule } from './clearer/clearer.module';
import { OrganizationModule } from './organization/organization.module';

@Module({
  imports: [AuthModule, ClearerModule, OrganizationModule],
})
export class APIV1Module {}
