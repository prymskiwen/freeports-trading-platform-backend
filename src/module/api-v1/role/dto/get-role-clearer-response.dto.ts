import { ApiProperty } from '@nestjs/swagger';
import { PermissionClearer } from 'src/schema/role/permission.helper';

export class GetRoleClearerResponseDto {
  name: string;

  @ApiProperty({ type: [String], enum: PermissionClearer })
  permissions?: PermissionClearer[];
}
