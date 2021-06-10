import { ApiProperty } from '@nestjs/swagger';
import { PermissionOrganization } from 'src/schema/role/permission.helper';

export class GetRoleOrganizationResponseDto {
  id: string;
  name: string;

  @ApiProperty({ type: [String], enum: PermissionOrganization })
  permissions?: PermissionOrganization[];
}
