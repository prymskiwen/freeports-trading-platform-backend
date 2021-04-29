import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    format: 'ObjectId',
  })
  _id?: string;

  @Prop({ type: AccountOperationDetailsSchema })
  details?: AccountOperationDetails;

  @Prop({ type: AccountOperationReconciliationSchema })
  reconciliation?: AccountOperationReconciliation;

  @Prop({ type: [AccountOperationAuditLogSchema] })
  auditLog?: AccountOperationAuditLog[];
}

export const AccountOperationSchema = SchemaFactory.createForClass(
  AccountOperation,
);
