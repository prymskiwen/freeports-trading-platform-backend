import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { User } from 'src/schema/user/user.schema';

@Schema({ versionKey: false, _id: false })
export class TransactionRequestRequestForQuotesCreation {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  initiator?: User;

  @Prop()
  createdAt?: Date;
}

export const TransactionRequestRequestForQuotesCreationSchema = SchemaFactory.createForClass(
  TransactionRequestRequestForQuotesCreation,
);
