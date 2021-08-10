import { RoleDesk } from 'src/schema/role/role-desk.schema';
import { RoleMultidesk } from 'src/schema/role/role-multidesk.schema';
import { RoleOrganization } from 'src/schema/role/role-organization.schema';
import { UserDocument } from 'src/schema/user/user.schema';
import { CreateUserResponseDto } from '../dto/create-user-response.dto';
import { GetUserDetailsResponseDto } from '../dto/get-user-details-response.dto';
import { GetUserResponseDto } from '../dto/get-user-response.dto';
import { UpdateUserResponseDto } from '../dto/update-user-response.dto';

export class UserMapper {
  public static toCreateDto(document: UserDocument): CreateUserResponseDto {
    const dto = new CreateUserResponseDto();

    dto.id = document.id;

    return dto;
  }

  public static toUpdateDto(document: UserDocument): UpdateUserResponseDto {
    const dto = new UpdateUserResponseDto();

    dto.id = document.id;

    return dto;
  }

  public static toGetDto(document: UserDocument): GetUserResponseDto {
    const dto = new GetUserResponseDto();

    dto.id = document._id;
    dto.organization = document.organization;
    dto.nickname = document.personal.nickname;
    dto.email = document.personal.email;
    dto.phone = document.personal.phone;
    dto.jobTitle = document.personal.jobTitle;
    dto.suspended = document.suspended;
    dto.vaultUserId = document.vaultUserId;
    dto.publicKeys = document.publicKeys;

    return dto;
  }

  public static async toGetDetailsDto(
    document: UserDocument,
  ): Promise<GetUserDetailsResponseDto> {
    const dto = Object.assign(
      new GetUserDetailsResponseDto(),
      this.toGetDto(document),
    );

    await document.populate('roles.role').execPopulate();

    dto.avatar = document.personal.avatar;

    dto.roles = document.roles.map((userRole) => {
      return {
        id: userRole.role['id'],
        name: userRole.role.name,
        system: userRole.role.system,
        kind: userRole.role.kind,
        organization:
          userRole.role.kind === RoleOrganization.name || RoleMultidesk.name
            ? userRole.role['organization']
            : undefined,
        desk:
          userRole.role.kind === RoleDesk.name
            ? userRole.role['desk']
            : undefined,
        effectiveDesks: userRole.effectiveDesks,
        permissions: userRole.role.permissions,
      };
    });

    return dto;
  }
}
