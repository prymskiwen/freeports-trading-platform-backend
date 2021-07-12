import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Investor } from '../investor/investor.schema';
import { Organization } from '../organization/organization.schema';

export type DeskDocument = Desk & Document;

@Schema({ versionKey: false })
export class Desk {
  @Prop()
  name: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Organization' })
  organization: Organization;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Investor' }] })
  investors?: Investor[];

  @Prop()
  createdAt?: Date;
}

export const DeskSchema = SchemaFactory.createForClass(Desk);
