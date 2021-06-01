import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty } from 'class-validator';
import { PermissionClearer } from 'src/schema/role/enum/permission.enum';

export class CreateRoleClearerRequestDto {
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(PermissionClearer, { each: true })
  permissions: PermissionClearer[];
}
