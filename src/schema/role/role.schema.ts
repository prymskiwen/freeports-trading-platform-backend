import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Permission } from './enum/permission.enum';
import { User } from '../user/user.schema';
import { RoleClearer } from './role-clearer.schema';
import { RoleOrganization } from './role-organization.schema';
import { RoleDesk } from './role-desk.schema';
import { RoleDeskMulti } from './role-desk-multi.schema';

export const ROLE_DEFAULT = '_default';

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

  @Prop({ type: [String], enum: Permission })
  permissions?: Permission[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);

RoleSchema.pre('save', function () {
  console.info('role presave');
});

RoleSchema.virtual('permissionsParsed').get(function () {
  return this.permissions;
});
