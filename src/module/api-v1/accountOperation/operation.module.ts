import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  AccountOperation,
  AccountOperationSchema
} from 'src/schema/account-operation/account-operation.schema';
import { AccountModule } from "../account/account.module";
import { OperationController } from "./operation.controller";
import { OperationService } from "./operation.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: AccountOperation.name, schema: AccountOperationSchema},
    ]),
    AccountModule,
  ],
  controllers: [OperationController],
  providers: [OperationService],
  exports: [OperationService],
})
export class OperationModule {}