import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  OperationRequestAuditLog,
  OperationRequestAuditLogSchema,
} from './embedded/operation-request-audit-log.embedded';
import {
  OperationRequestDetails,
  OperationRequestDetailsSchema,
} from './embedded/operation-request-details.embedded';

export type OperationRequestDocument = OperationRequest & Document;

@Schema({ versionKey: false })
export class OperationRequest {
  @Prop({ type: OperationRequestDetailsSchema })
  details?: OperationRequestDetails;

  @Prop()
  processed?: boolean;

  @Prop()
  confirmed?: boolean;

  @Prop({ type: [OperationRequestAuditLogSchema] })
  auditLog?: OperationRequestAuditLog[];
}

export const OperationRequestSchema = SchemaFactory.createForClass(
  OperationRequest,
);
