import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Permission } from './enum/permission.enum';
import { User } from '../user/user.schema';

export enum RoleKind {
  Clearer = 'clearer',
  Organization = 'organization',
  Desk = 'desk',
  Investor = 'investor',
}

export type RoleDocument = Role & Document;

@Schema({ versionKey: false, discriminatorKey: 'kind' })
export class Role {
  @Prop({ type: String, required: true, enum: RoleKind })
  kind: RoleKind;

  @Prop()
  name: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  owner?: User;

  @Prop()
  disabled?: boolean;

  @Prop({ type: [String], enum: Permission })
  permissions?: Permission[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);

RoleSchema.pre('save', function () {
  console.info('role presave');
});

RoleSchema.virtual('permissionsParsed').get(function () {
  return this.permissions.map((permission) => {
    return permission;
  });
});
