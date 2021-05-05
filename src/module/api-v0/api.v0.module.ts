import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { AccountOperationModule } from './account-operation/account-operation.module';
import { OrganizationModule } from './organization/organization.module';
import { TransactionRequestModule } from './transaction-request/transaction-request.module';
import { UserModule } from './user/user.module';
import { OperationRequestModule } from './operation-request/operation-request.module';

@Module({
  imports: [
    AccountModule,
    AccountOperationModule,
    OrganizationModule,
    OperationRequestModule,
    UserModule,
    TransactionRequestModule,
  ],
})
export class APIV0Module {}
