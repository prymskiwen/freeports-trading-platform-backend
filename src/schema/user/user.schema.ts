import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, SchemaTypes } from 'mongoose';
import { Organization } from 'src/schema/organization/organization.schema';
import {
  UserPublicKey,
  UserPublicKeySchema,
} from './embedded/user-public-key.embedded';
import { Role } from './enum/role.enum';

export type UserDocument = User & Document;

@Schema({ versionKey: false })
export class User {
  @ApiProperty({
    format: 'ObjectId',
  })
  _id?: string;

  /**
   * This field will be set when registering an user, then it will be read only. Nobody will be transfered to another organization
   */
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Organization' })
  organization?: Organization;

  @Prop()
  vault_user_id?: string;

  @Prop(
    raw({
      nickname: { type: String },
      password: { type: String },
      email: { type: String, unique: true },
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

  @Prop({ type: [String], enum: Role })
  roles?: Role[];

  @Prop({ type: [String] })
  permissions?: string[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  relationhipManager?: User;

  @Prop()
  commission?: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
