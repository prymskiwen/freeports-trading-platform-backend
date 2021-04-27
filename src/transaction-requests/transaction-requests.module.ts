import { Module } from '@nestjs/common';
import { TransactionRequestsService } from './transaction-requests.service';
import { TransactionRequestsController } from './transaction-requests.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TransactionRequest,
  TransactionRequestSchema,
} from './schemas/transaction-request.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TransactionRequest.name, schema: TransactionRequestSchema },
    ]),
  ],
  controllers: [TransactionRequestsController],
  providers: [TransactionRequestsService],
})
export class TransactionRequestsModule {}
