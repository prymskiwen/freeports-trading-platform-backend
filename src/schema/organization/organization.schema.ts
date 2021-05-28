import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
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

export type OrganizationDocument = Organization & Document;

@Schema({ versionKey: false })
export class Organization {
  @Prop({ type: OrganizationDetailsSchema })
  details: OrganizationDetails;

  @Prop({ type: [OrganizationClearingSchema] })
  clearing?: OrganizationClearing[];

  @Prop({ type: OrganizationCommissionRatioSchema })
  commissionRatio?: OrganizationCommissionRatio;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
