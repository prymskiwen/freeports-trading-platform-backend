import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false, _id: false })
export class AccountCryptoDetails {
  @Prop()
  publicAddress?: string;

  @Prop()
  vaultWalletId?: string;
}

export const AccountCryptoDetailsSchema = SchemaFactory.createForClass(
  AccountCryptoDetails,
);
