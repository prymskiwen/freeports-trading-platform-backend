import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  AccountOperation,
  AccountOperationSchema
} from 'src/schema/account-operation/account-operation.schema';
import { AccountModule } from "../account/account.module";
import { InvestorModule } from "../investor/investor.module";
import { OrganizationModule } from "../organization/organization.module";
import { InvestorAccountOperationController } from "./investor-operation.controller";
import { OperationController } from "./operation.controller";
import { OperationService } from "./operation.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: AccountOperation.name, schema: AccountOperationSchema},
    ]),
    AccountModule,
    OrganizationModule,
    InvestorModule,
  ],
  controllers: [OperationController, InvestorAccountOperationController],
  providers: [OperationService],
  exports: [OperationService],
})
export class OperationModule {}