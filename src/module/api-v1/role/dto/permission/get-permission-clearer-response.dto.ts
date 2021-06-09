import { ApiProperty } from '@nestjs/swagger';
import { PermissionClearer } from 'src/schema/role/permission.helper';

class GetPermissionClearerGroupDto {
  name: string;

  @ApiProperty({ type: String, enum: PermissionClearer })
  code: PermissionClearer;
}

export class GetPermissionClearerResponseDto {
  name: string;

  @ApiProperty({ type: [GetPermissionClearerGroupDto] })
  permissions: GetPermissionClearerGroupDto[];
}
