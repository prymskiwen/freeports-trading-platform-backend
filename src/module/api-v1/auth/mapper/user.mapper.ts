import { UserDocument } from 'src/schema/user/user.schema';
import { UserDto } from '../dto/user.dto';

export class UserMapper {
  public static toDto(document: UserDocument): UserDto {
    const dto = new UserDto();

    dto.id = document._id;
    dto.nickname = document.personal.nickname;
    dto.email = document.personal.email;

    dto.permissions = [];

    return dto;
  }
}
