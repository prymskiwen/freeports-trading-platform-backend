import { ApiProperty } from '@nestjs/swagger';
import { GetRoleResponseDto } from '../../role/dto/get-role-response.dto';
import { GetUserResponseDto } from './get-user-response.dto';

export class GetUserDetailsResponseDto extends GetUserResponseDto {
  avatar: string;

  @ApiProperty({ type: [GetRoleResponseDto] })
  roles: GetRoleResponseDto[];
}
