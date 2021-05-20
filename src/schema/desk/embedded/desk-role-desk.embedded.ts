import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { PermissionDesk } from 'src/schema/user/enum/permission.enum';
import { User } from 'src/schema/user/user.schema';

@Schema({ versionKey: false, _id: false })
export class DeskRoleDesk {
  @Prop()
  name: string;

  @Prop()
  disabled?: boolean;

  @Prop({ type: [String], enum: PermissionDesk })
  permissions?: PermissionDesk[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'User' }] })
  users?: User[];
}

export const DeskRoleDeskSchema = SchemaFactory.createForClass(DeskRoleDesk);
