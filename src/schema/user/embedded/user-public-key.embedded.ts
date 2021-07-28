import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Document } from 'mongoose';
import { User } from '../user.schema';

export enum UserPublicKeyStatus {
  'requested',
  'confirmed',
  'revocation_request',
  'revocation_done',
}

export type UserPublicKeyDocument = UserPublicKey & Document;

@Schema({ versionKey: false })
export class UserPublicKey {
  @Prop()
  key?: string;

  @Prop()
  name?: string;

  @Prop()
  current?: boolean;

  @Prop({ type: String, enum: UserPublicKeyStatus })
  status?: UserPublicKeyStatus;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  approvedBy?: User;
}

export const UserPublicKeySchema = SchemaFactory.createForClass(UserPublicKey);
