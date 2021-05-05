import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { User } from 'src/schema/user/user.schema';

@Schema({ versionKey: false, _id: false })
export class OperationRequestAuditLog {
  @Prop()
  editedAt?: Date;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  editedBy?: User;

  @Prop()
  jsonUpdate?: string;
}

export const OperationRequestAuditLogSchema = SchemaFactory.createForClass(
  OperationRequestAuditLog,
);
