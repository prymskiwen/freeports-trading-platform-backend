import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { User } from '../user/user.schema';
import { RoleClearer } from './role-clearer.schema';
import { RoleOrganization } from './role-organization.schema';
import { RoleDesk } from './role-desk.schema';
import { RoleDeskMulti } from './role-desk-multi.schema';

export const ROLE_DEFAULT = '_default';
export const ROLE_ADMIN = 'Administrator';

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
  owner?: User;

  @Prop()
  disabled?: boolean;

  // TODO: get all permission list if possible
  @Prop({ type: [String] })
  permissions?: string[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);

RoleSchema.pre('save', function () {
  console.info('role presave');
});

RoleSchema.virtual('permissionsParsed').get(function () {
  return this.permissions;
});
