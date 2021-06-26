import { RoleClearerDocument } from 'src/schema/role/role-clearer.schema';
import { RoleMultideskDocument } from 'src/schema/role/role-multidesk.schema';
import { RoleDeskDocument } from 'src/schema/role/role-desk.schema';
import { RoleOrganizationDocument } from 'src/schema/role/role-organization.schema';
import { RoleDocument } from 'src/schema/role/role.schema';
import { GetRoleClearerResponseDto } from '../dto/clearer/get-role-clearer-response.dto';
import { CreateRoleResponseDto } from '../dto/create-role-response.dto';
import { DeleteRoleResponseDto } from '../dto/delete-role-response.dto';
import { GetRoleDeskResponseDto } from '../dto/desk/get-role-desk-response.dto';
import { GetRoleMultideskResponseDto } from '../dto/multidesk/get-role-multidesk-response.dto';
import { GetRoleOrganizationResponseDto } from '../dto/organization/get-role-organization-response.dto';
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

  public static toGetRoleClearerDto(
    document: RoleClearerDocument,
  ): GetRoleClearerResponseDto {
    const dto = new GetRoleClearerResponseDto();

    dto.id = document._id;
    dto.name = document.name;
    dto.permissions = document.permissions;

    return dto;
  }

  public static toGetRoleOrganizationDto(
    document: RoleOrganizationDocument,
  ): GetRoleOrganizationResponseDto {
    const dto = new GetRoleOrganizationResponseDto();

    dto.id = document._id;
    dto.name = document.name;
    dto.permissions = document.permissions;

    return dto;
  }

  public static toGetRoleMultideskDto(
    document: RoleMultideskDocument,
  ): GetRoleMultideskResponseDto {
    const dto = new GetRoleMultideskResponseDto();

    dto.id = document._id;
    dto.name = document.name;
    dto.permissions = document.permissions;

    return dto;
  }

  public static toGetRoleDeskDto(
    document: RoleDeskDocument,
  ): GetRoleDeskResponseDto {
    const dto = new GetRoleDeskResponseDto();

    dto.id = document._id;
    dto.name = document.name;
    dto.permissions = document.permissions;

    return dto;
  }
}
