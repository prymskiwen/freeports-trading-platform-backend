import { ApiProperty } from '@nestjs/swagger';
import { PermissionOrganization } from 'src/schema/role/permission.helper';

class GetPermissionOrganizationGroupDto {
  name: string;

  @ApiProperty({ type: String, enum: PermissionOrganization })
  code: PermissionOrganization;
}

export class GetPermissionOrganizationResponseDto {
  name: string;

  @ApiProperty({ type: [GetPermissionOrganizationGroupDto] })
  permissions: GetPermissionOrganizationGroupDto[];
}
