import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  OperationRequest,
  OperationRequestSchema,
} from 'src/schema/operation-request/operation-request.schema';
import { OperationRequestController } from './operation-request.controller';
import { OperationRequestService } from './operation-request.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OperationRequest.name, schema: OperationRequestSchema },
    ]),
  ],
  controllers: [OperationRequestController],
  providers: [OperationRequestService],
})
export class OperationRequestModule {}
