import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { User } from '../user.schema';
import { PublicKeyData, PublicKeyDataSchema } from './public-key-data.embedded';

@Schema({ versionKey: false, _id: false })
export class PublicKey {
  @Prop({ type: PublicKeyDataSchema })
  @ApiProperty({ required: false })
  @IsOptional()
  data: PublicKeyData;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: false })
  @ApiProperty({ type: () => User, required: false })
  @IsOptional()
  approvedBy: User;
}

export const PublicKeySchema = SchemaFactory.createForClass(PublicKey);
