import { TokenDto } from '../../auth/dto/token.dto';
import { CreateOrganizationResponseDto } from '../../organization/dto/create-organization-response.dto';
import { CreateUserResponseDto } from '../../user/dto/create-user-response.dto';

export class InitResponseDto {
  organization: CreateOrganizationResponseDto;
  user: CreateUserResponseDto;
  token: TokenDto;
}
