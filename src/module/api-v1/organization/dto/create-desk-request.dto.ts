import { IsNotEmpty } from 'class-validator';

export class CreateDeskRequestDto {
  @IsNotEmpty()
  name: string;
}
