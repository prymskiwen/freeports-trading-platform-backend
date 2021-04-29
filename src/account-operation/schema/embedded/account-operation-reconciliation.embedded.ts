import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { OperationRequest } from 'src/operation-request/schema/operation-request.schema';
import { User } from 'src/user/schema/user.schema';

@Schema({ versionKey: false, _id: false })
export class AccountOperationReconciliation {
  @Prop({ type: SchemaTypes.ObjectId, ref: OperationRequest.name })
  operationRequest?: OperationRequest;

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  reconciliatedBy?: User;

  @Prop()
  reconciliatedAt?: Date;
}

export const AccountOperationReconciliationSchema = SchemaFactory.createForClass(
  AccountOperationReconciliation,
);
