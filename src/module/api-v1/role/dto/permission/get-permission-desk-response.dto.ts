import { ApiProperty } from '@nestjs/swagger';
import { PermissionDesk } from 'src/schema/role/enum/permission.enum';

export class GetPermissionDeskResponseDto {
  @ApiProperty({ type: [String], enum: PermissionDesk })
  permissions?: PermissionDesk[];
}
