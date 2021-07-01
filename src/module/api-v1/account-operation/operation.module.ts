import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AccountOperation,
  AccountOperationSchema,
} from 'src/schema/account-operation/account-operation.schema';
import { AccountModule } from '../account/account.module';
import { DeskModule } from '../desk/desk.module';
import { InvestorModule } from '../investor/investor.module';
import { OrganizationModule } from '../organization/organization.module';
import { OperationInvestorController } from './operation-investor.controller';
import { OperationController } from './operation.controller';
import { OperationService } from './operation.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AccountOperation.name, schema: AccountOperationSchema },
    ]),
    AccountModule,
    DeskModule,
    OrganizationModule,
    InvestorModule,
  ],
  controllers: [OperationController, OperationInvestorController],
  providers: [OperationService],
  exports: [OperationService],
})
export class OperationModule {}
