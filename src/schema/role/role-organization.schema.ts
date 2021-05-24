import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Organization } from '../organization/organization.schema';
import { PermissionOrganization } from './enum/permission.enum';
import { User } from '../user/user.schema';
import { RoleKind } from './role.schema';

export type RoleOrganizationDocument = RoleOrganization & Document;

@Schema({ versionKey: false })
export class RoleOrganization {
  kind: RoleKind.Organization;
  name: string;
  owner: User;
  disabled?: boolean;

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
    return permission.replace('#id#', this.organization);
  });
});
