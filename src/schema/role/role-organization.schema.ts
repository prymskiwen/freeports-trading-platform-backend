import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Organization } from '../organization/organization.schema';
import { User } from '../user/user.schema';
import { PermissionOrganization } from './permission.helper';

export type RoleOrganizationDocument = RoleOrganization & Document;

@Schema({ versionKey: false })
export class RoleOrganization {
  kind: string;
  name: string;
  owner: User;
  disabled?: boolean;
  system?: boolean;

  @Prop({ type: [String], enum: PermissionOrganization })
  permissions?: PermissionOrganization[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Organization' })
  organization: Organization;
}

export const RoleOrganizationSchema = SchemaFactory.createForClass(
  RoleOrganization,
);

RoleOrganizationSchema.pre('save', function () {
  console.info('role organization presave');
});

RoleOrganizationSchema.virtual('permissionsParsed').get(function () {
  return this.permissions.map((permission) => {
    return permission.replace('#organizationId#', this.organization);
  });
});
