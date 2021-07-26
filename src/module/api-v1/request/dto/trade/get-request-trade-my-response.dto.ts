import { ApiProperty } from '@nestjs/swagger';
import { GetDeskResponseDto } from 'src/module/api-v1/desk/dto/get-desk-response.dto';
import { GetInvestorResponseDto } from 'src/module/api-v1/investor/dto/get-investor-response.dto';
import { GetRequestTradeResponseDto } from './get-request-trade-response.dto';

export class GetRequestTradeMyResponseDto extends GetRequestTradeResponseDto {
  desk: GetDeskResponseDto;

  @ApiProperty({ type: GetInvestorResponseDto })
  investor: GetInvestorResponseDto;
}
