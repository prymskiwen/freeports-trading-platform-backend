import { ApiProperty } from '@nestjs/swagger';
import { PermissionDesk } from 'src/schema/role/permission.helper';

class GetPermissionDeskGroupDto {
  name: string;

  @ApiProperty({ type: String, enum: PermissionDesk })
  code: PermissionDesk;
}

export class GetPermissionDeskResponseDto {
  name: string;

  @ApiProperty({ type: [GetPermissionDeskGroupDto] })
  permissions: GetPermissionDeskGroupDto[];
}
