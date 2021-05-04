import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { User } from 'src/module/user/schema/user.schema';

@Schema({ versionKey: false, _id: false })
export class AccountOperationAuditLog {
  @Prop()
  editedAt?: Date;

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  editedBy?: User;

  @Prop()
  jsonUpdate?: string;
}

export const AccountOperationAuditLogSchema = SchemaFactory.createForClass(
  AccountOperationAuditLog,
);
