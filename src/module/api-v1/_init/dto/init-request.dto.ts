import { Type } from 'class-transformer';
import { IsNotEmptyObject, ValidateNested } from 'class-validator';
import { CreateOrganizationRequestDto } from '../../organization/dto/create-organization-request.dto';
import { CreateUserRequestDto } from '../../user/dto/create-user-request.dto';

export class InitRequestDto {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateOrganizationRequestDto) // <= Mandatory to validate subobject
  organization: CreateOrganizationRequestDto;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateUserRequestDto) // <= Mandatory to validate subobject
  user: CreateUserRequestDto;
}
