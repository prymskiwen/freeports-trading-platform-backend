import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Sale } from './sale.embedded';

@Schema()
export class Details {
  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  type: string;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  mode: string;

  @Prop(Sale)
  @ApiProperty({ type: Sale, required: false })
  @IsOptional()
  sale: Sale;
}
