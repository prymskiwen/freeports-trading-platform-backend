import { RoleDocument } from 'src/schema/role/role.schema';
import { CreateRoleResponseDto } from '../dto/create-role-response.dto';
import { DeleteRoleResponseDto } from '../dto/delete-role-response.dto';
import { UpdateRoleResponseDto } from '../dto/update-role-response.dto';

export class RoleMapper {
  public static toCreateDto(document: RoleDocument): CreateRoleResponseDto {
    const dto = new CreateRoleResponseDto();

    dto.id = document.id;

    return dto;
  }

  public static toUpdateDto(document: RoleDocument): UpdateRoleResponseDto {
    const dto = new UpdateRoleResponseDto();

    dto.id = document.id;

    return dto;
  }

  public static toDeleteDto(document: RoleDocument): DeleteRoleResponseDto {
    const dto = new DeleteRoleResponseDto();

    dto.id = document.id;

    return dto;
  }
}
