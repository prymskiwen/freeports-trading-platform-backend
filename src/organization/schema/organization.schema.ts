import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Document } from 'mongoose';
import {
  GeneralDetails,
  GeneralDetailsSchema,
} from './embedded/general-details.embedded';
import { Clearing, ClearingSchema } from './embedded/clearing.embedded';
import { Commission, CommissionSchema } from './embedded/commission.embedded';

export type OrganizationDocument = Organization & Document;

@Schema({ versionKey: false })
export class Organization {
  @ApiProperty({ required: false })
  @IsOptional()
  _id: string;

  @Prop({ type: GeneralDetailsSchema })
  @ApiProperty({ required: false })
  @IsOptional()
  generalDetails: GeneralDetails;

  @Prop({ type: [ClearingSchema] })
  @ApiProperty({ type: [Clearing], required: false })
  @IsOptional()
  clearing: [Clearing];

  @Prop({ type: CommissionSchema })
  @ApiProperty({ required: false })
  @IsOptional()
  commission: Commission;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
