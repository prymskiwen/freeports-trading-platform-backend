import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AccountOperation,
  AccountOperationSchema,
} from './schema/account-operation.schema';
import { AccountOperationController } from './account-operation.controller';
import { AccountOperationService } from './account-operation.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AccountOperation.name, schema: AccountOperationSchema },
    ]),
  ],
  controllers: [AccountOperationController],
  providers: [AccountOperationService],
})
export class AccountOperationModule {}
