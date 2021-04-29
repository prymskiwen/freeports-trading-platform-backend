import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, SchemaTypes } from 'mongoose';
import {
  UserPublicKey,
  UserPublicKeySchema,
} from './embedded/user-public-key.embedded';

export enum UserRoles {
  'admin',
  'org_user',
  'investor',
  'permissions_manager',
  'clearer',
}

export type UserDocument = User & Document;

@Schema({ versionKey: false })
export class User {
  @ApiProperty({
    format: 'ObjectId',
  })
  _id?: string;

  @Prop()
  vault_user_id?: string;

  @Prop(
    raw({
      nickname: { type: String },
      password: { type: String },
      email: { type: String },
    }),
  )
  @ApiProperty({
    required: false,
    type: 'object',
    properties: {
      nickname: { type: 'string', example: 'John Doe' },
      password: { type: 'string' },
      email: { type: 'string', example: 'john@doe.com' },
    },
  })
  personal?: Record<string, any>;

  @Prop({ type: [UserPublicKeySchema] })
  publicKeys?: UserPublicKey[];

  @Prop({ type: [String], enum: UserRoles })
  roles?: UserRoles[];

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  relationhipManager?: User;

  @Prop()
  commission?: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
