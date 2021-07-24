import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsNumberString } from 'class-validator';

export class CreateRequestMoveRequestDto {
  @IsNotEmpty()
  @IsNumberString()
  quantity: string;

  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({ type: String, description: 'Investor account from Id' })
  accountFrom: string;

  @IsNotEmpty()
  @IsNumberString()
  publicAddressTo: string;
}
