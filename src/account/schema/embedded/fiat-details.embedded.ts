import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

@Schema({ versionKey: false, _id: false })
export class FiatDetails {
  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  iban: string;
}

export const FiatDetailsSchema = SchemaFactory.createForClass(FiatDetails);
