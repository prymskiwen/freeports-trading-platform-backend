import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

@Schema({ versionKey: false, _id: false })
export class GeneralDetails {
  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  orgName: string;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  street: string;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  street2: string;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  zip: string;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  city: string;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  country: string;
}

export const GeneralDetailsSchema = SchemaFactory.createForClass(
  GeneralDetails,
);
