import { GetUserDetailsResponseDto } from '../../user/dto/get-user-details-response.dto';
import { TokenDto } from './token.dto';

export class LoginResponseDto {
  user: GetUserDetailsResponseDto;
  token: TokenDto;
  isOTPDefined: boolean;
}
