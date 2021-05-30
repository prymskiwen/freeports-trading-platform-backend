import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty } from 'class-validator';
import { PermissionOrganization } from 'src/schema/role/enum/permission.enum';

export class CreateRoleOrganizationRequestDto {
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(PermissionOrganization, { each: true })
  permissions: PermissionOrganization[];
}
