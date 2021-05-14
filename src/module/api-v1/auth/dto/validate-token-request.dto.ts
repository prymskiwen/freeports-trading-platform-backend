import { IsJWT, IsNotEmpty } from 'class-validator';

export class ValidateTokenRequestDto {
  @IsNotEmpty()
  @IsJWT()
  token: string;
}
