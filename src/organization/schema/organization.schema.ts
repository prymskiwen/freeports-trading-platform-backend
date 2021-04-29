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
  OrganizationCommission,
  OrganizationCommissionSchema,
} from './embedded/organization-commission.embedded';

export type OrganizationDocument = Organization & Document;

@Schema({ versionKey: false })
export class Organization {
  @ApiProperty({
    format: 'ObjectId',
  })
  _id?: string;

  @Prop({ type: OrganizationDetailsSchema })
  details?: OrganizationDetails;

  @Prop({ type: [OrganizationClearingSchema] })
  clearing?: OrganizationClearing[];

  @Prop({ type: OrganizationCommissionSchema })
  commission?: OrganizationCommission;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
