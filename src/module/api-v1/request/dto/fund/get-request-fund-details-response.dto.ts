import { ApiProperty } from '@nestjs/swagger';
import { GetDeskResponseDto } from 'src/module/api-v1/desk/dto/get-desk-response.dto';
import { GetInvestorResponseDto } from 'src/module/api-v1/investor/dto/get-investor-response.dto';
import { GetRequestFundResponseDto } from './get-request-fund-response.dto';

export class GetRequestFundDetailsResponseDto extends GetRequestFundResponseDto {
  desk: GetDeskResponseDto;

  @ApiProperty({ type: GetInvestorResponseDto })
  investor: GetInvestorResponseDto;
}
