import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Document } from 'mongoose';
import { Details, DetailsSchema } from './embedded/details.embedded';
import {
  Reconciliation,
  ReconciliationSchema,
} from './embedded/reconciliation.embedded';
import { AuditLog, AuditLogSchema } from './embedded/audit-log.embedded';

export type AccountOperationDocument = AccountOperation & Document;

@Schema({ versionKey: false })
export class AccountOperation {
  @ApiProperty({ required: false })
  @IsOptional()
  _id: string;

  @Prop({ type: DetailsSchema })
  @ApiProperty({ required: false })
  @IsOptional()
  details: Details;

  @Prop({ type: ReconciliationSchema })
  @ApiProperty({ required: false })
  @IsOptional()
  reconciliation: Reconciliation;

  @Prop({ type: [AuditLogSchema] })
  @ApiProperty({ type: [AuditLog], required: false })
  @IsOptional()
  auditLog: [AuditLog];
}

export const AccountOperationSchema = SchemaFactory.createForClass(
  AccountOperation,
);
