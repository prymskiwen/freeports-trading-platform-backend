import { IsNotEmpty } from 'class-validator';

export class TwoFactorAuthenticationCodeDto {
  @IsNotEmpty()
  code: string;
}
