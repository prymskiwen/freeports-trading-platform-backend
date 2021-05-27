import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Desk } from 'src/schema/desk/desk.schema';
import { Role } from 'src/schema/role/role.schema';
import { User } from '../user.schema';

@Schema({ versionKey: false, _id: false })
export class UserRole {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Role' })
  role: Role;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Desk' }] })
  effectiveDesks?: Desk[];

  @Prop()
  assignedAt: Date;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  assignedBy: User;
}

export const UserRoleSchema = SchemaFactory.createForClass(UserRole);

UserRoleSchema.virtual('permissions').get(function () {
  return this.role.get('permissionsParsed');
});
