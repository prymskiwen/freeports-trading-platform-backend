import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class RegisterResponseDto {
  @IsBoolean()
  success: boolean;

  @IsOptional()
  @IsNotEmpty()
  id?: string;

  @IsOptional()
  @IsNotEmpty()
  message?: string;
}
