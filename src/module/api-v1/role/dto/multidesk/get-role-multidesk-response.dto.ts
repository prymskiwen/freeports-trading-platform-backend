import { ApiProperty } from '@nestjs/swagger';
import { PermissionDesk } from 'src/schema/role/permission.helper';

export class GetRoleMultideskResponseDto {
  id: string;
  name: string;

  @ApiProperty({ type: [String], enum: PermissionDesk })
  permissions?: PermissionDesk[];
}
