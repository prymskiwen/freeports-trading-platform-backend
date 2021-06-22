import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { User } from '../user/user.schema';
import { RoleClearer } from './role-clearer.schema';
import { RoleOrganization } from './role-organization.schema';
import { RoleDesk } from './role-desk.schema';
import { RoleDeskMulti } from './role-desk-multi.schema';
import { PermissionAny } from './permission.helper';

export const ROLE_MANAGER = 'Manager';

export type RoleDocument = Role & Document;

@Schema({ versionKey: false, discriminatorKey: 'kind' })
export class Role {
  @Prop({
    type: String,
    required: true,
    enum: [
      RoleClearer.name,
      RoleOrganization.name,
      RoleDeskMulti.name,
      RoleDesk.name,
    ],
  })
  kind: string;

  @Prop()
  name: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  owner: User;

  @Prop()
  disabled?: boolean;

  @Prop()
  system?: boolean;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'User' }] })
  users?: User[];

  @Prop({ type: [String], enum: PermissionAny })
  permissions?: PermissionAny[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);

RoleSchema.pre('save', function () {
  console.info('role presave');
});

RoleSchema.virtual('permissionsParsed').get(function () {
  return this.permissions;
});
