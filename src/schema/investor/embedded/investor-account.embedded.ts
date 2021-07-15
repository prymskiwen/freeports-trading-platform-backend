import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InvestorAccountDocument = InvestorAccount & Document;

@Schema({ versionKey: false })
export class InvestorAccount {
  @Prop()
  name?: string;

  @Prop()
  currency?: string;

  @Prop()
  balance?: number;

  @Prop()
  publicAddress?: string;

  /**
   * Technical key which store the vault internal id of the wallet
   */
  @Prop()
  vaultWalletId?: string;
}

export const InvestorAccountSchema = SchemaFactory.createForClass(
  InvestorAccount,
);
