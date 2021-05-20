import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { PermissionClearer } from 'src/schema/user/enum/permission.enum';
import { User } from 'src/schema/user/user.schema';

@Schema({ versionKey: false, _id: false })
export class OrganizationRoleClearer {
  @Prop()
  name: string;

  @Prop()
  disabled?: boolean;

  @Prop({ type: [String], enum: PermissionClearer })
  permissions?: PermissionClearer[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'User' }] })
  users?: User[];
}

export const OrganizationRoleClearerSchema = SchemaFactory.createForClass(
  OrganizationRoleClearer,
);
