import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';
import { OperationModule } from './accountOperation/operation.module';
import { DeskModule } from './desk/desk.module';
import { OrganizationModule } from './organization/organization.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { InvestorModule } from './investor/investor.module';

@Module({
  imports: [
    AuthModule,
    AccountModule,
    OperationModule,
    DeskModule,
    InvestorModule,
    OrganizationModule,
    RoleModule,
    UserModule,
  ],
})
export class APIV1Module {}
