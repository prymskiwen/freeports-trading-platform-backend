import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

@Schema({ versionKey: false, _id: false })
export class TransactionRequestRequestForQuotesConvertDestination {
  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  amount: number;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  currency: string;
}

export const TransactionRequestRequestForQuotesConvertDestinationSchema = SchemaFactory.createForClass(
  TransactionRequestRequestForQuotesConvertDestination,
);
