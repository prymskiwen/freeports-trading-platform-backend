import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { User } from 'src/schema/user/user.schema';
import {
  AccountDetails,
  AccountDetailsSchema,
} from './embedded/account-details.embedded';
import {
  AccountCryptoDetails,
  AccountCryptoDetailsSchema,
} from './embedded/account-crypto-details.embedded';
import {
  AccountFiatDetails,
  AccountFiatDetailsSchema,
} from './embedded/account-fiat-details.embedded';
import { AccountClearer } from './account-clearer.schema';
import { AccountInvestor } from './account-investor.schema';

export type AccountDocument = Account & Document;

@Schema({ versionKey: false, discriminatorKey: 'kind' })
export class Account {
  @Prop({
    type: String,
    required: true,
    enum: [AccountClearer.name, AccountInvestor.name],
  })
  kind: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  owner?: User;

  @Prop({ type: AccountDetailsSchema })
  details?: AccountDetails;

  @Prop({ type: AccountFiatDetailsSchema })
  fiatDetails?: AccountFiatDetails;

  @Prop({ type: AccountCryptoDetailsSchema })
  cryptotDetails?: AccountCryptoDetails;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
