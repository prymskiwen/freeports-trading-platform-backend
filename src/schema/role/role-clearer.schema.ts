import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Organization } from '../organization/organization.schema';
import { User } from '../user/user.schema';
import { PermissionClearer } from './enum/permission.enum';

export type RoleClearerDocument = RoleClearer & Document;

@Schema({ versionKey: false })
export class RoleClearer {
  kind: string;
  name: string;
  owner: User;
  disabled?: boolean;

  @Prop({ type: [String], enum: PermissionClearer })
  permissions?: PermissionClearer[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Organization' })
  organization: Organization;
}

export const RoleClearerSchema = SchemaFactory.createForClass(RoleClearer);

RoleClearerSchema.pre('save', function () {
  console.info('role clearer presave');
});

RoleClearerSchema.virtual('permissionsParsed').get(function () {
  return this.permissions.map((permission) => {
    return permission.replace('#id#', this.organization);
  });
});
