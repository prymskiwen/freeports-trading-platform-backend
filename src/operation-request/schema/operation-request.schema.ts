import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
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
  @ApiProperty({ required: false })
  @IsOptional()
  _id: string;

  @Prop({ type: OperationRequestDetailsSchema })
  @ApiProperty({ required: false })
  @IsOptional()
  details: OperationRequestDetails;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  processed: boolean;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  confirmed: boolean;

  @Prop({ type: [OperationRequestAuditLogSchema] })
  @ApiProperty({ type: [OperationRequestAuditLog], required: false })
  @IsOptional()
  auditLog: [OperationRequestAuditLog];
}

export const OperationRequestSchema = SchemaFactory.createForClass(
  OperationRequest,
);
