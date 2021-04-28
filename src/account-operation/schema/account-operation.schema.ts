import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Document } from 'mongoose';
import {
  AccountOperationDetails,
  AccountOperationDetailsSchema,
} from './embedded/account-operation-details.embedded';
import {
  AccountOperationReconciliation,
  AccountOperationReconciliationSchema,
} from './embedded/account-operation-reconciliation.embedded';
import {
  AccountOperationAuditLog,
  AccountOperationAuditLogSchema,
} from './embedded/account-operation-audit-log.embedded';

export type AccountOperationDocument = AccountOperation & Document;

@Schema({ versionKey: false })
export class AccountOperation {
  @ApiProperty({ required: false })
  @IsOptional()
  _id: string;

  @Prop({ type: AccountOperationDetailsSchema })
  @ApiProperty({ required: false })
  @IsOptional()
  details: AccountOperationDetails;

  @Prop({ type: AccountOperationReconciliationSchema })
  @ApiProperty({ required: false })
  @IsOptional()
  reconciliation: AccountOperationReconciliation;

  @Prop({ type: [AccountOperationAuditLogSchema] })
  @ApiProperty({ type: [AccountOperationAuditLog], required: false })
  @IsOptional()
  auditLog: [AccountOperationAuditLog];
}

export const AccountOperationSchema = SchemaFactory.createForClass(
  AccountOperation,
);
