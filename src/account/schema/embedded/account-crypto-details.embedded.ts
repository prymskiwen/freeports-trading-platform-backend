import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false, _id: false })
export class AccountCryptoDetails {
  @Prop()
  publicAddress?: string;

  /**
   * Technical key which store the vault internal id of the wallet
   */
  @Prop()
  vaultWalletId?: string;
}

export const AccountCryptoDetailsSchema = SchemaFactory.createForClass(
  AccountCryptoDetails,
);
