import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Currencies, CurrenciesSchema } from './currencies.embedded';

@Schema({ versionKey: false, _id: false })
export class Purchase {
  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  nbTokens: number;

  @Prop({ type: CurrenciesSchema })
  @ApiProperty({ required: false })
  @IsOptional()
  currencies: Currencies;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  maximalUnitPrice: number;
}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
