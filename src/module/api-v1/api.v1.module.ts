import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';
import { OperationModule } from './account-operation/operation.module';
import { DeskModule } from './desk/desk.module';
import { OrganizationModule } from './organization/organization.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { InvestorModule } from './investor/investor.module';
import { VaultModule } from './vault/vault.module';

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
    VaultModule,
  ],
})
export class APIV1Module {}
