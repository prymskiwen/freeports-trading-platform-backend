import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { User } from 'src/schema/user/user.schema';
import { Organization } from '../organization/organization.schema';

export enum AccountType {
  fiat = 'fiat',
  crypto = 'crypto',
}

export type AccountDocument = Account & Document;

@Schema({ versionKey: false })
export class Account {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  owner?: User;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Organization' }] })
  organizations?: Organization[];

  @Prop()
  name?: string;

  @Prop({ type: String, enum: AccountType })
  type?: AccountType;

  @Prop()
  currency?: string;

  @Prop()
  balance?: number;

  @Prop()
  iban?: string;

  @Prop()
  publicAddress?: string;

  /**
   * Technical key which store the vault internal id of the wallet
   */
  @Prop()
  vaultWalletId?: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
