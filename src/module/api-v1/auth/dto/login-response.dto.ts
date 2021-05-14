import { TokenDto } from './token.dto';
import { UserDto } from './user.dto';

export class LoginResponseDto {
  user: UserDto;
  token: TokenDto;
}
