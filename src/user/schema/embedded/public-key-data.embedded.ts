import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

@Schema({ versionKey: false, _id: false })
export class PublicKeyData {
  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  key: string;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  current: boolean;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  status: string;
}

export const PublicKeyDataSchema = SchemaFactory.createForClass(PublicKeyData);
