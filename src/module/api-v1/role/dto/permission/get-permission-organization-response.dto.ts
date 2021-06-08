import { ApiProperty } from '@nestjs/swagger';
import { PermissionOrganization } from 'src/schema/role/enum/permission.enum';

export class GetPermissionOrganizationResponseDto {
  @ApiProperty({ type: [String], enum: PermissionOrganization })
  permissions?: PermissionOrganization[];
}
