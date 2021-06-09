import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty } from 'class-validator';
import { PermissionOrganization } from 'src/schema/role/permission.helper';

export class CreateRoleOrganizationRequestDto {
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(PermissionOrganization, { each: true })
  @ApiProperty({ type: [String], enum: PermissionOrganization })
  permissions: PermissionOrganization[];
}
