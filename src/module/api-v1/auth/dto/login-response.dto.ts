import { GetUserResponseDto } from '../../user/dto/get-user-response.dto';
import { TokenDto } from './token.dto';

export class LoginResponseDto {
  user: GetUserResponseDto;
  token: TokenDto;
  isOTPDefined: boolean;
}
