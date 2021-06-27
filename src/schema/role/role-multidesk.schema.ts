import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Organization } from '../organization/organization.schema';
import { User } from '../user/user.schema';
import { PermissionDesk } from './permission.helper';

export type RoleMultideskDocument = RoleMultidesk & Document;

@Schema({ versionKey: false })
export class RoleMultidesk {
  kind: string;
  name: string;
  owner: User;
  disabled?: boolean;
  system?: boolean;
  users?: User[];

  @Prop({ type: [String], enum: PermissionDesk })
  permissions?: PermissionDesk[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Organization' })
  organization: Organization;
}

export const RoleMultideskSchema = SchemaFactory.createForClass(RoleMultidesk);

RoleMultideskSchema.pre('save', function () {
  console.info('role multidesk presave');
});

RoleMultideskSchema.virtual('rolePermissions').get(function () {
  return this.permissions;
});
