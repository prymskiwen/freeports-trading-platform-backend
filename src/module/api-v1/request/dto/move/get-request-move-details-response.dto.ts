import { ApiProperty } from '@nestjs/swagger';
import { GetDeskResponseDto } from 'src/module/api-v1/desk/dto/get-desk-response.dto';
import { GetInvestorResponseDto } from 'src/module/api-v1/investor/dto/get-investor-response.dto';
import { GetRequestMoveResponseDto } from './get-request-move-response.dto';

export class GetRequestMoveDetailsResponseDto extends GetRequestMoveResponseDto {
  desk: GetDeskResponseDto;

  @ApiProperty({ type: GetInvestorResponseDto })
  investor: GetInvestorResponseDto;
}
