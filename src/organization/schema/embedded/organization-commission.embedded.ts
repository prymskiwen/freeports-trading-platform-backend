import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

@Schema({ versionKey: false, _id: false })
export class OrganizationCommission {
  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  clearer: string;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  organization: string;
}

export const OrganizationCommissionSchema = SchemaFactory.createForClass(
  OrganizationCommission,
);
