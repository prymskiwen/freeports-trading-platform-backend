import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false, _id: false })
export class AccountFiatDetails {
  @Prop()
  iban?: string;
}

export const AccountFiatDetailsSchema = SchemaFactory.createForClass(
  AccountFiatDetails,
);
