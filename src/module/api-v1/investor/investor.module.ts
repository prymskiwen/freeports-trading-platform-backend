import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Investor, InvestorSchema } from 'src/schema/investor/investor.schema';
import { OrganizationModule } from '../organization/organization.module';
import { InvestorService } from './investor.service';
import { InvestorController } from './investor.controller';
import { InvestorAccountController } from './investor-account.controller';
import { DeskModule } from '../desk/desk.module';
import {
  InvestorAccount,
  InvestorAccountSchema,
} from 'src/schema/investor/embedded/investor-account.embedded';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Investor.name, schema: InvestorSchema },
      { name: InvestorAccount.name, schema: InvestorAccountSchema },
    ]),
    DeskModule,
    OrganizationModule,
  ],
  controllers: [InvestorController, InvestorAccountController],
  providers: [InvestorService],
  exports: [InvestorService],
})
export class InvestorModule {}
