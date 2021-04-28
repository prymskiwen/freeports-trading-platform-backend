import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import {
  Creation,
  CreationSchema,
} from './request-for-quotes/creation.embedded';
import { Details, DetailsSchema } from './request-for-quotes/details.embedded';

@Schema({ versionKey: false, _id: false })
export class RequestForQuotes {
  @Prop({ type: CreationSchema })
  @ApiProperty({ required: false })
  @IsOptional()
  creation: Creation;

  @Prop({ type: DetailsSchema })
  @ApiProperty({ required: false })
  @IsOptional()
  details: Details;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  status: string;
}

export const RequestForQuotesSchema = SchemaFactory.createForClass(
  RequestForQuotes,
);
