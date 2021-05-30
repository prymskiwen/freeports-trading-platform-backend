import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty } from 'class-validator';
import { PermissionDesk } from 'src/schema/role/enum/permission.enum';

export class CreateRoleDeskRequestDto {
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(PermissionDesk, { each: true })
  permissions: PermissionDesk[];
}
