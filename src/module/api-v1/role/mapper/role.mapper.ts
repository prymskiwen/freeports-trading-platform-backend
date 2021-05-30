import { RoleDocument } from 'src/schema/role/role.schema';
import { CreateRoleResponseDto } from '../dto/create-role-response.dto';

export class RoleMapper {
  public static toCreateDto(document: RoleDocument): CreateRoleResponseDto {
    const dto = new CreateRoleResponseDto();

    dto.id = document.id;

    return dto;
  }
}
