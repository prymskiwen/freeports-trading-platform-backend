import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { OperationRequest } from 'src/operation-request/schema/operation-request.schema';
import { User } from 'src/user/schema/user.schema';

@Schema({ versionKey: false, _id: false })
export class Reconciliation {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: OperationRequest.name,
    required: false,
  })
  @ApiProperty({ type: () => OperationRequest, required: false })
  @IsOptional()
  operationRequest: OperationRequest;

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: false })
  @ApiProperty({ type: () => User, required: false })
  @IsOptional()
  reconciliatedBy: User;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  reconciliatedAt: Date;
}

export const ReconciliationSchema = SchemaFactory.createForClass(
  Reconciliation,
);
