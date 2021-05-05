import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { User } from 'src/schema/user/user.schema';

@Schema({ versionKey: false, _id: false })
export class TransactionRequestIdentification {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  initiator?: User;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  investor?: User;
}

export const TransactionRequestIdentificationSchema = SchemaFactory.createForClass(
  TransactionRequestIdentification,
);
