import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
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
  @ApiProperty({ required: false })
  @IsOptional()
  _id: string;

  @Prop({ type: OrganizationDetailsSchema })
  @ApiProperty({ required: false })
  @IsOptional()
  details: OrganizationDetails;

  @Prop({ type: [OrganizationClearingSchema] })
  @ApiProperty({ type: [OrganizationClearing], required: false })
  @IsOptional()
  clearing: [OrganizationClearing];

  @Prop({ type: OrganizationCommissionSchema })
  @ApiProperty({ required: false })
  @IsOptional()
  commission: OrganizationCommission;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
