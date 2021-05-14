import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  id: string;
  nickname: string;
  email: string;
  @ApiProperty({ type: [String] })
  permissions?: string[];
}
