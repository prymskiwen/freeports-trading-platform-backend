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

    return dto;
  }

  public static toGetDetailsDto(
    document: UserDocument,
  ): GetUserDetailsResponseDto {
    const dto = new GetUserDetailsResponseDto();

    Object.assign({}, dto, this.toGetDto(document));

    dto.avatar = document.personal.avatar;

    dto.roles = document.roles.map((userRole) => {
      return {
        id: userRole.role['id'],
        name: userRole.role.name,
        system: userRole.role.system,
        permissions: userRole.role.permissions,
      };
    });

    return dto;
  }
}
