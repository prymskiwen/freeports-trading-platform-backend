import { UserDocument } from 'src/schema/user/user.schema';
import { CreateOrganizationManagerRequestDto } from '../dto/create-organization-manager-request.dto';
import { CreateOrganizationManagerResponseDto } from '../dto/create-organization-manager-response.dto';
import { GetOrganizationManagerResponseDto } from '../dto/get-organization-manager-response.dto';
import { UpdateOrganizationManagerRequestDto } from '../dto/update-organization-manager-request.dto';
import { UpdateOrganizationManagerResponseDto } from '../dto/update-organization-manager-response.dto';

export class ManagerMapper {
  public static toCreateDto(
    document: UserDocument,
  ): CreateOrganizationManagerResponseDto {
    const dto = new CreateOrganizationManagerResponseDto();

    dto.id = document._id;

    return dto;
  }

  public static toUpdateDto(
    document: UserDocument,
  ): UpdateOrganizationManagerResponseDto {
    const dto = new UpdateOrganizationManagerResponseDto();

    dto.id = document._id;

    return dto;
  }

  public static toGetDto(
    document: UserDocument,
  ): GetOrganizationManagerResponseDto {
    const dto = new GetOrganizationManagerResponseDto();

    dto.id = document._id;
    dto.nickname = document.personal.nickname;
    dto.email = document.personal.email;

    return dto;
  }

  public static toCreateDocument(
    document: UserDocument,
    dto: CreateOrganizationManagerRequestDto,
  ): UserDocument {
    document.personal = {
      nickname: dto.nickname,
      email: dto.email,
      password: dto.password,
    };

    return document;
  }

  public static toUpdateDocument(
    document: UserDocument,
    dto: UpdateOrganizationManagerRequestDto,
  ): UserDocument {
    document.personal.nickname = dto.nickname;
    document.personal.email = dto.email;

    return document;
  }
}
