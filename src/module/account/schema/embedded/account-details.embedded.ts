import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum AccountDetailsType {
  'fiat',
  'crypto',
}

@Schema({ versionKey: false, _id: false })
export class AccountDetails {
  @Prop()
  internalName?: string;

  @Prop({ type: String, enum: AccountDetailsType })
  type?: AccountDetailsType;

  @Prop()
  currency?: string;
}

export const AccountDetailsSchema = SchemaFactory.createForClass(
  AccountDetails,
);
