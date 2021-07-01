import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { AccountInvestor } from '../account/account-investor.schema';
import { Desk } from '../desk/desk.schema';
import { User } from '../user/user.schema';

export type InvestorDocument = Investor & Document;

@Schema({ versionKey: false })
export class Investor {
  @Prop()
  name: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  owner: User;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Desk' })
  desk: Desk;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Account' }] })
  accounts?: AccountInvestor[];
}

export const InvestorSchema = SchemaFactory.createForClass(Investor);
