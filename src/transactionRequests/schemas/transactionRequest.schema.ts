import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Document } from 'mongoose';
import { Details } from './embedded/details.embedded';
import { Identification } from './embedded/identification.embedded';

export type TransactionRequestDocument = TransactionRequest & Document;

@Schema({ versionKey: false })
export class TransactionRequest {
  @ApiProperty({ required: false })
  @IsOptional()
  _id: string;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  transaction_date: Date;

  @Prop(Identification)
  @ApiProperty({ type: Identification })
  identification: Identification;

  @Prop(Details)
  @ApiProperty({ type: Details })
  details: Details;
}

export const TransactionRequestSchema = SchemaFactory.createForClass(
  TransactionRequest,
);
