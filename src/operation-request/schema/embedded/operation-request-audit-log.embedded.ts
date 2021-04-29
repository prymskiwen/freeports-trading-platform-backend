import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { User } from 'src/user/schema/user.schema';

@Schema({ versionKey: false, _id: false })
export class OperationRequestAuditLog {
  @Prop()
  editedAt?: Date;

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  editedBy?: User;

  @Prop()
  jsonUpdate?: string;
}

export const OperationRequestAuditLogSchema = SchemaFactory.createForClass(
  OperationRequestAuditLog,
);
