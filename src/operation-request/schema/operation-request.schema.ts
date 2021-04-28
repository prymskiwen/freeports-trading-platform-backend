import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Document } from 'mongoose';
import { AuditLog, AuditLogSchema } from './embedded/audit-log.embedded';
import { Details, DetailsSchema } from './embedded/details.embedded';

export type OperationRequestDocument = OperationRequest & Document;

@Schema({ versionKey: false })
export class OperationRequest {
  @ApiProperty({ required: false })
  @IsOptional()
  _id: string;

  @Prop({ type: DetailsSchema })
  @ApiProperty({ required: false })
  @IsOptional()
  details: Details;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  processed: boolean;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  confirmed: boolean;

  @Prop({ type: [AuditLogSchema] })
  @ApiProperty({ type: [AuditLog], required: false })
  @IsOptional()
  auditLog: [AuditLog];
}

export const OperationRequestSchema = SchemaFactory.createForClass(
  OperationRequest,
);
