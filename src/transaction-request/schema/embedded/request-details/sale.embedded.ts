import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Currencies, CurrenciesSchema } from './currencies.embedded';

@Schema({ versionKey: false, _id: false })
export class Sale {
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
  minimalUnitPrice: number;
}

export const SaleSchema = SchemaFactory.createForClass(Sale);
