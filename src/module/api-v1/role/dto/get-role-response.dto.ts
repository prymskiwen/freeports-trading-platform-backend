import { ApiProperty } from '@nestjs/swagger';
import { PermissionAny } from 'src/schema/role/permission.helper';

export class GetRoleResponseDto {
  id: string;
  name: string;
  system: boolean;

  @ApiProperty({ type: [String], enum: PermissionAny })
  permissions?: PermissionAny[];
}
