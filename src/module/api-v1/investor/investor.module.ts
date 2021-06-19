import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Investor, InvestorSchema } from 'src/schema/investor/investor.schema';
import { OrganizationModule } from '../organization/organization.module';
import { InvestorService } from './investor.service';
import { InvestorController } from './investor.controller';
import { InvestorAccountController } from './investor-account.controller';
import { AccountModule } from '../account/account.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Investor.name, schema: InvestorSchema },
    ]),
    AccountModule,
    OrganizationModule,
  ],
  controllers: [InvestorController, InvestorAccountController],
  providers: [InvestorService],
  exports: [InvestorService],
})
export class InvestorModule {}
