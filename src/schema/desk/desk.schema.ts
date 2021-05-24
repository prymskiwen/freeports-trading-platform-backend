import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, SchemaTypes } from 'mongoose';
import { Organization } from '../organization/organization.schema';

export type DeskDocument = Desk & Document;

@Schema({ versionKey: false })
export class Desk {
  @ApiProperty({
    format: 'ObjectId',
  })
  _id?: string;

  @Prop()
  name: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Organization' })
  organization?: Organization;
}

export const DeskSchema = SchemaFactory.createForClass(Desk);
