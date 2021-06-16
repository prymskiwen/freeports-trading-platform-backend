import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Account } from 'src/schema/account/account.schema';

@Schema({ versionKey: false, _id: false })
export class OrganizationClearing {
  @Prop()
  currency?: string;

  @Prop()
  iban?: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Account' })
  account?: Account;
}

export const OrganizationClearingSchema = SchemaFactory.createForClass(
  OrganizationClearing,
);
