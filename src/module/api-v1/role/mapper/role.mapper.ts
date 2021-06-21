import { RoleClearerDocument } from 'src/schema/role/role-clearer.schema';
import { RoleDocument } from 'src/schema/role/role.schema';
import { AssignUserResponseDto } from '../dto/assign-user-response.dto';
import { GetRoleClearerResponseDto } from '../dto/clearer/get-role-clearer-response.dto';
import { CreateRoleResponseDto } from '../dto/create-role-response.dto';
import { DeleteRoleResponseDto } from '../dto/delete-role-response.dto';
import { UnassignUserResponseDto } from '../dto/unassign-user-response.dto';
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

  public static toAssignDto(document: RoleDocument): AssignUserResponseDto {
    const dto = new AssignUserResponseDto();

    dto.id = document.id;

    return dto;
  }

  public static toUnassignDto(document: RoleDocument): UnassignUserResponseDto {
    const dto = new UnassignUserResponseDto();

    dto.id = document.id;

    return dto;
  }

  public static toGetRoleClearerDto(
    document: RoleClearerDocument,
  ): GetRoleClearerResponseDto {
    const dto = new GetRoleClearerResponseDto();

    dto.id = document._id;
    dto.name = document.name;
    dto.permissions = document.permissions;

    return dto;
  }
}
