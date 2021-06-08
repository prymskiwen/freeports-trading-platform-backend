import { ApiProperty } from '@nestjs/swagger';
import { PermissionDesk } from 'src/schema/role/enum/permission.enum';

export class GetRoleDeskResponseDto {
  name: string;

  @ApiProperty({ type: [String], enum: PermissionDesk })
  permissions?: PermissionDesk[];
}
