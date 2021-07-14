import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { Desk } from '../desk/desk.schema';
import { User } from '../user/user.schema';
import {
  InvestorAccountDocument,
  InvestorAccountSchema,
} from './embedded/investor-account.embedded';

export type InvestorDocument = Investor & Document;

@Schema({ versionKey: false })
export class Investor {
  @Prop()
  name: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  owner: User;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Desk' })
  desk: Desk;

  @Prop({ type: [InvestorAccountSchema] })
  accounts?: Types.DocumentArray<InvestorAccountDocument>;
}

export const InvestorSchema = SchemaFactory.createForClass(Investor);
