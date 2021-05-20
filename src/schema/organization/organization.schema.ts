import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
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
import {
  OrganizationRoleClearer,
  OrganizationRoleClearerSchema,
} from './embedded/organization-role-clearer.embedded';
import {
  OrganizationRoleOrganization,
  OrganizationRoleOrganizationSchema,
} from './embedded/organization-role-organization.embedded';

export type OrganizationDocument = Organization & Document;

@Schema({ versionKey: false })
export class Organization {
  @ApiProperty({
    format: 'ObjectId',
  })
  _id?: string;

  @Prop({ type: OrganizationDetailsSchema })
  details: OrganizationDetails;

  @Prop({ type: [OrganizationClearingSchema] })
  clearing?: OrganizationClearing[];

  @Prop({ type: OrganizationCommissionRatioSchema })
  commissionRatio?: OrganizationCommissionRatio;

  @Prop({ type: [OrganizationRoleClearerSchema] })
  roleClearer?: OrganizationRoleClearer[];

  @Prop({ type: [OrganizationRoleOrganizationSchema] })
  roleOrganization?: OrganizationRoleOrganization[];
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
