import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { PermissionOrganization } from 'src/schema/user/enum/permission.enum';
import { User } from 'src/schema/user/user.schema';

@Schema({ versionKey: false, _id: false })
export class OrganizationRoleOrganization {
  @Prop()
  name: string;

  @Prop()
  disabled?: boolean;

  @Prop({ type: [String], enum: PermissionOrganization })
  permissions?: PermissionOrganization[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'User' }] })
  users?: User[];
}

export const OrganizationRoleOrganizationSchema = SchemaFactory.createForClass(
  OrganizationRoleOrganization,
);
