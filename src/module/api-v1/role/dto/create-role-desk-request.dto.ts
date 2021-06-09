import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty } from 'class-validator';
import { PermissionDesk } from 'src/schema/role/permission.helper';

export class CreateRoleDeskRequestDto {
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(PermissionDesk, { each: true })
  @ApiProperty({ type: [String], enum: PermissionDesk })
  permissions: PermissionDesk[];
}
