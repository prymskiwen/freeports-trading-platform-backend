import { IsBoolean, IsNotEmpty } from 'class-validator';

export class AddUserPublicKeyDto {
  @IsNotEmpty()
  key: string;

  @IsNotEmpty()
  @IsBoolean()
  current: boolean;
}
