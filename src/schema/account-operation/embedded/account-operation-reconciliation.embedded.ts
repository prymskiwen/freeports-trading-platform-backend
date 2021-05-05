import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { OperationRequest } from 'src/schema/operation-request/operation-request.schema';
import { User } from 'src/schema/user/user.schema';

@Schema({ versionKey: false, _id: false })
export class AccountOperationReconciliation {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'OperationRequest' })
  operationRequest?: OperationRequest;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  reconciliatedBy?: User;

  @Prop()
  reconciliatedAt?: Date;
}

export const AccountOperationReconciliationSchema = SchemaFactory.createForClass(
  AccountOperationReconciliation,
);
