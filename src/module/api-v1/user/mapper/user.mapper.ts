import { UserDocument } from 'src/schema/user/user.schema';
import { CreateUserResponseDto } from '../dto/create-user-response.dto';
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

    dto.id = document.id;
    dto.nickname = document.personal.nickname;
    dto.email = document.personal.email;

    return dto;
  }
}
