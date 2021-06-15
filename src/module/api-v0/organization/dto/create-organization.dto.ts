import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsMongoId,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';

class CreateOrganizationDetailslDto {
  @IsNotEmpty()
  name: string;
  street?: string;
  street2?: string;
  zip?: string;
  city?: string;
  country?: string;
  logofile?: string;
  createtime?: Date;
}

class CreateOrganizationClearingDto {
  @IsNotEmpty()
  currency: string;

  @ApiProperty({
    format: 'ObjectId',
    pattern: '/^[a-f\\d]{24}$/',
    description: 'Account Id',
  })
  @IsMongoId()
  account: string;
}

class CreateOrganizationCommissionRatioDto {
  @IsNotEmpty()
  clearer: number;

  @IsNotEmpty()
  organization: number;
}

export class CreateOrganizationDto {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateOrganizationDetailslDto) // <= Mandatory to validate subobject
  details: CreateOrganizationDetailslDto;

  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateOrganizationClearingDto) // <= Mandatory to validate subobject
  clearing?: CreateOrganizationClearingDto[];

  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateOrganizationCommissionRatioDto) // <= Mandatory to validate subobject
  commissionRatio?: CreateOrganizationCommissionRatioDto;
}
