import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import {
  OrganizationDetails,
  OrganizationDetailsSchema,
} from './embedded/organization-details.embedded';
import {
  OrganizationClearing,
  OrganizationClearingSchema,
} from './embedded/organization-clearing.embedded';
import {
  OrganizationCommissionRatio,
  OrganizationCommissionRatioSchema,
} from './embedded/organization-commission-ratio.embedded';
import { User } from '../user/user.schema';

export type OrganizationDocument = Organization & Document;

@Schema({ versionKey: false })
export class Organization {
  @Prop({ type: OrganizationDetailsSchema })
  details: OrganizationDetails;

  @Prop({ type: [OrganizationClearingSchema] })
  clearing?: OrganizationClearing[];

  @Prop({ type: OrganizationCommissionRatioSchema })
  commissionRatio?: OrganizationCommissionRatio;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'User' }] })
  users?: User[];

  @Prop({ unique: true })
  vaultOrganizationId?: string;

  @Prop()
  createdAt?: Date;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
