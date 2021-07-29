import { ApiProperty } from '@nestjs/swagger';
import { GetDeskResponseDto } from 'src/module/api-v1/desk/dto/get-desk-response.dto';
import { GetInvestorResponseDto } from 'src/module/api-v1/investor/dto/get-investor-response.dto';
import { GetRequestRefundResponseDto } from './get-request-refund-response.dto';

export class GetRequestRefundDetailsResponseDto extends GetRequestRefundResponseDto {
  desk: GetDeskResponseDto;

  @ApiProperty({ type: GetInvestorResponseDto })
  investor: GetInvestorResponseDto;
}
