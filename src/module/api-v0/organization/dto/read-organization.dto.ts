import { Type } from 'class-transformer';
import { IsNotEmpty, IsNotEmptyObject, ValidateNested } from 'class-validator';

class ReadOrganizationDetailslDto {
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

export class ReadOrganizationDto {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => ReadOrganizationDetailslDto) // <= Mandatory to validate subobject
  details: ReadOrganizationDetailslDto;
}
