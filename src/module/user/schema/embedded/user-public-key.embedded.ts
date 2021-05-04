import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { User } from '../user.schema';
import {
  UserPublicKeyData,
  UserPublicKeyDataSchema,
} from './user-public-key-data.embedded';

@Schema({ versionKey: false, _id: false })
export class UserPublicKey {
  @Prop({ type: UserPublicKeyDataSchema })
  data?: UserPublicKeyData;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' }) // <= 'User' instead of User.name because it refers a parent class
  approvedBy?: User;
}

export const UserPublicKeySchema = SchemaFactory.createForClass(UserPublicKey);
