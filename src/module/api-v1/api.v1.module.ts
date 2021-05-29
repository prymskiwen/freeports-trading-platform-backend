import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ClearerModule } from './clearer/clearer.module';
import { DeskModule } from './desk/desk.module';
import { OrganizationModule } from './organization/organization.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    ClearerModule,
    DeskModule,
    OrganizationModule,
    RoleModule,
    UserModule,
  ],
})
export class APIV1Module {}
