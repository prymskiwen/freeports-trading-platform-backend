import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from '../user/user.schema';
import { PermissionClearer } from './permission.helper';

export type RoleClearerDocument = RoleClearer & Document;

@Schema({ versionKey: false })
export class RoleClearer {
  kind: string;
  name: string;
  owner: User;
  disabled?: boolean;
  system?: boolean;

  @Prop({ type: [String], enum: PermissionClearer })
  permissions?: PermissionClearer[];
}

export const RoleClearerSchema = SchemaFactory.createForClass(RoleClearer);

RoleClearerSchema.pre('save', function () {
  console.info('role clearer presave');
});

RoleClearerSchema.virtual('permissionsParsed').get(function () {
  return this.permissions;
});
