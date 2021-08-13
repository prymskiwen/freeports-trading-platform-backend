import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from 'src/schema/account/account.schema';
import { OrganizationModule } from '../organization/organization.module';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { RequestModule } from '../request/request.module';
import { AccountRequestController } from './account-request.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
    OrganizationModule,
    RequestModule,
  ],
  controllers: [AccountController, AccountRequestController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
