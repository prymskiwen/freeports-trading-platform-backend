import { ApiProperty } from '@nestjs/swagger';
import { PermissionDesk } from 'src/schema/role/permission.helper';

export class GetRoleDeskMultiResponseDto {
  name: string;

  @ApiProperty({ type: [String], enum: PermissionDesk })
  permissions?: PermissionDesk[];
}
