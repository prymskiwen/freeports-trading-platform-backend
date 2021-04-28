import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { User } from '../user.schema';
import {
  UserPublicKeyData,
  UserPublicKeyDataSchema,
} from './user-public-key-data.embedded';

@Schema({ versionKey: false, _id: false })
export class UserPublicKey {
  @Prop({ type: UserPublicKeyDataSchema })
  @ApiProperty({ required: false })
  @IsOptional()
  data: UserPublicKeyData;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: false })
  @ApiProperty({ type: () => User, required: false })
  @IsOptional()
  approvedBy: User;
}

export const UserPublicKeySchema = SchemaFactory.createForClass(UserPublicKey);
