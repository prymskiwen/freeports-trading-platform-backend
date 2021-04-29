import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { User } from 'src/user/schema/user.schema';

@Schema({ versionKey: false, _id: false })
export class TransactionRequestIdentification {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  initiator?: User;

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  investor?: User;
}

export const TransactionRequestIdentificationSchema = SchemaFactory.createForClass(
  TransactionRequestIdentification,
);
