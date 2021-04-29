import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false, _id: false })
export class AccountDetails {
  @Prop()
  internalName?: string;

  @Prop()
  type?: string;

  @Prop()
  currency?: string;
}

export const AccountDetailsSchema = SchemaFactory.createForClass(
  AccountDetails,
);
