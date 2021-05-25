import { UserDocument } from 'src/schema/user/user.schema';
import { CreateUserRequestDto } from '../dto/create-user-request.dto';
import { CreateUserResponseDto } from '../dto/create-user-response.dto';
import { GetUserResponseDto } from '../dto/get-user-response.dto';
import { UpdateUserRequestDto } from '../dto/update-user-request.dto';
import { UpdateUserResponseDto } from '../dto/update-user-response.dto';

export class UserMapper {
  public static toCreateDto(document: UserDocument): CreateUserResponseDto {
    const dto = new CreateUserResponseDto();

    dto.id = document._id;

    return dto;
  }

  public static toUpdateDto(document: UserDocument): UpdateUserResponseDto {
    const dto = new UpdateUserResponseDto();

    dto.id = document._id;

    return dto;
  }

  public static toGetDto(document: UserDocument): GetUserResponseDto {
    const dto = new GetUserResponseDto();

    dto.id = document._id;
    dto.nickname = document.personal.nickname;
    dto.email = document.personal.email;

    return dto;
  }

  public static toCreateDocument(
    document: UserDocument,
    dto: CreateUserRequestDto,
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
    dto: UpdateUserRequestDto,
  ): UserDocument {
    document.personal.nickname = dto.nickname;
    document.personal.email = dto.email;

    return document;
  }
}
