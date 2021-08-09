import { ApiProperty } from '@nestjs/swagger';
import { Desk } from 'src/schema/desk/desk.schema';
import { PermissionAny } from 'src/schema/role/permission.helper';
import { RoleKind } from 'src/schema/role/role.schema';

export class GetRoleResponseDto {
  id: string;
  name: string;
  system: boolean;

  @ApiProperty({ type: String, enum: RoleKind })
  kind: string;

  @ApiProperty({
    type: String,
    description: 'Organization Id if kind is RoleOrganization or RoleMultidesk',
  })
  organization?: string;

  @ApiProperty({ type: String, description: 'Desk Id if kind is RoleDesk' })
  desk?: string;

  @ApiProperty({ type: [Desk] })
  effectiveDesks: Desk[];

  @ApiProperty({ type: [String], enum: PermissionAny })
  permissions?: PermissionAny[];
}
