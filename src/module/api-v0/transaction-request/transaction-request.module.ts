import { Module } from '@nestjs/common';
import { TransactionRequestService } from './transaction-request.service';
import { TransactionRequestController } from './transaction-request.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TransactionRequest,
  TransactionRequestSchema,
} from 'src/schema/transaction-request/transaction-request.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TransactionRequest.name, schema: TransactionRequestSchema },
    ]),
  ],
  controllers: [TransactionRequestController],
  providers: [TransactionRequestService],
})
export class TransactionRequestModule {}
