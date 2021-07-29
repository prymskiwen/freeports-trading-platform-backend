import { GetDeskResponseDto } from 'src/module/api-v1/desk/dto/get-desk-response.dto';
import { GetRoleDeskResponseDto } from './get-role-desk-response.dto';

export class GetRoleDeskDetailsResponseDto extends GetRoleDeskResponseDto {
  desk: GetDeskResponseDto;
}
