import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Organization } from 'src/schema/organization/organization.schema';
import { AccountInvestor } from '../account/account-investor.schema';
import { User } from '../user/user.schema';

export type InvestorDocument = Investor & Document;

@Schema({ versionKey: false })
export class Investor {
  @Prop()
  name: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  owner: User;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Organization' })
  organization: Organization;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Account' }] })
  accounts?: AccountInvestor[];
}

export const InvestorSchema = SchemaFactory.createForClass(Investor);
