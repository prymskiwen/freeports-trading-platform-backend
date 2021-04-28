import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import {
  TransactionRequestRequestDetailsCurrencies,
  TransactionRequestRequestDetailsCurrenciesSchema,
} from './transaction-request-request-details-currencies.embedded';

@Schema({ versionKey: false, _id: false })
export class TransactionRequestRequestDetailsPurchase {
  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  nbTokens: number;

  @Prop({ type: TransactionRequestRequestDetailsCurrenciesSchema })
  @ApiProperty({ required: false })
  @IsOptional()
  currencies: TransactionRequestRequestDetailsCurrencies;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  maximalUnitPrice: number;
}

export const TransactionRequestRequestDetailsPurchaseSchema = SchemaFactory.createForClass(
  TransactionRequestRequestDetailsPurchase,
);
