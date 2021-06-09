import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty } from 'class-validator';
import { PermissionClearer } from 'src/schema/role/permission.helper';

export class CreateRoleClearerRequestDto {
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(PermissionClearer, { each: true })
  @ApiProperty({ type: [String], enum: PermissionClearer })
  permissions: PermissionClearer[];
}
