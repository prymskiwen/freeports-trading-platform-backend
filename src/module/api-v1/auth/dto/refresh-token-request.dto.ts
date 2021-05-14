import { IsJWT, IsNotEmpty } from 'class-validator';

export class RefreshTokenRequestDto {
  @IsNotEmpty()
  @IsJWT()
  refreshToken: string;
}
