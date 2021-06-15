import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { User } from 'src/schema/user/user.schema';
import { AccountDetails } from './embedded/account-details.embedded';
import { AccountCryptoDetails } from './embedded/account-crypto-details.embedded';
import { AccountFiatDetails } from './embedded/account-fiat-details.embedded';
import { OrganizationDocument } from '../organization/organization.schema';

export type AccountClearerDocument = AccountClearer & Document;

@Schema({ versionKey: false })
export class AccountClearer {
  kind: string;
  owner?: User;
  details?: AccountDetails;
  fiatDetails?: AccountFiatDetails;
  cryptotDetails?: AccountCryptoDetails;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Organization' }] })
  organizations?: OrganizationDocument[];
}

export const AccountClearerSchema = SchemaFactory.createForClass(
  AccountClearer,
);
