import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Currencies } from './currencies.embedded';

export class Sale {
  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  nbTokens: number;

  @Prop(Currencies)
  @ApiProperty({
    type: Currencies,
    required: false,
  })
  @IsOptional()
  currencies: Currencies;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  minimalUnitPrice: number;
}
