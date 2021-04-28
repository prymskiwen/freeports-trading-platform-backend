import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

@Schema({ versionKey: false, _id: false })
export class TransactionRequestRequestDetailsCurrencies {
  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  from: string;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  to: string;
}

export const TransactionRequestRequestDetailsCurrenciesSchema = SchemaFactory.createForClass(
  TransactionRequestRequestDetailsCurrencies,
);
