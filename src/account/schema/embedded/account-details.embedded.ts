import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

@Schema({ versionKey: false, _id: false })
export class AccountDetails {
  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  internalName: string;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  type: string;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  currency: string;
}

export const AccountDetailsSchema = SchemaFactory.createForClass(
  AccountDetails,
);
