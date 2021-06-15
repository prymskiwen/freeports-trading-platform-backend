import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from 'src/schema/account/account.schema';
import { OrganizationModule } from '../organization/organization.module';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import {
  AccountClearer,
  AccountClearerSchema,
} from 'src/schema/account/account-clearer.schema';
import {
  AccountInvestor,
  AccountInvestorSchema,
} from 'src/schema/account/account-investor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Account.name,
        schema: AccountSchema,
        discriminators: [
          { name: AccountClearer.name, schema: AccountClearerSchema },
          { name: AccountInvestor.name, schema: AccountInvestorSchema },
        ],
      },
    ]),
    OrganizationModule,
  ],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
