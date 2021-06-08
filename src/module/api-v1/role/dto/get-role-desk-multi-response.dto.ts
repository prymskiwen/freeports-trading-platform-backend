import { ApiProperty } from '@nestjs/swagger';
import { PermissionDesk } from 'src/schema/role/enum/permission.enum';

export class GetRoleDeskMultiResponseDto {
  name: string;

  @ApiProperty({ type: [String], enum: PermissionDesk })
  permissions?: PermissionDesk[];
}
