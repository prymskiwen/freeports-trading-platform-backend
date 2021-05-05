import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class LoginResponseDto {
  @IsBoolean()
  success: boolean;

  @IsOptional()
  @IsNotEmpty()
  key?: string;

  @IsOptional()
  @IsNotEmpty()
  message?: string;
}
