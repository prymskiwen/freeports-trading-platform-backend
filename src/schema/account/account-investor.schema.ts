import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { User } from 'src/schema/user/user.schema';
import { AccountDetails } from './embedded/account-details.embedded';
import { AccountCryptoDetails } from './embedded/account-crypto-details.embedded';
import { AccountFiatDetails } from './embedded/account-fiat-details.embedded';
import { Investor } from '../investor/investor.schema';

export type AccountInvestorDocument = AccountInvestor & Document;

@Schema({ versionKey: false })
export class AccountInvestor {
  kind: string;
  owner?: User;
  details?: AccountDetails;
  fiatDetails?: AccountFiatDetails;
  cryptotDetails?: AccountCryptoDetails;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Investor' })
  investor: Investor;
}

export const AccountInvestorSchema = SchemaFactory.createForClass(
  AccountInvestor,
);
