import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

@Schema({ versionKey: false, _id: false })
export class Currencies {
  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  from: string;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  to: string;
}

export const CurrenciesSchema = SchemaFactory.createForClass(Currencies);
