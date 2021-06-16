import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Desk } from '../desk/desk.schema';
import { User } from '../user/user.schema';
import { PermissionDesk } from './permission.helper';

export type RoleDeskDocument = RoleDesk & Document;

@Schema({ versionKey: false })
export class RoleDesk {
  kind: string;
  name: string;
  owner: User;
  disabled?: boolean;
  system?: boolean;

  @Prop({ type: [String], enum: PermissionDesk })
  permissions?: PermissionDesk[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Desk' })
  desk: Desk;
}

export const RoleDeskSchema = SchemaFactory.createForClass(RoleDesk);

RoleDeskSchema.pre('save', function () {
  console.info('role desk presave');
});

RoleDeskSchema.virtual('permissionsParsed').get(function () {
  return this.permissions.map((permission) => {
    return permission.replace('#id#', this.desk);
  });
});
