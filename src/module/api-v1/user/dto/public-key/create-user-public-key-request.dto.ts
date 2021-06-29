import { IsNotEmpty } from 'class-validator';

export class CreateUserPublicKeyRequestDto {
  @IsNotEmpty()
  key: string;
}
