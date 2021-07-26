import { Controller, UseGuards, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ExceptionDto } from 'src/exeption/dto/exception.dto';
import JwtTwoFactorGuard from '../../../auth/guard/jwt-two-factor.guard';
import { UserDocument } from 'src/schema/user/user.schema';
import { CurrentUser } from '../../../auth/decorator/current-user.decorator';
import { RequestService } from '../../request.service';
import { GetRequestTradeMyResponseDto } from '../../dto/trade/get-request-trade-my-response.dto';
import { RequestTradeMapper } from '../../mapper/request-trade.mapper';

@UseGuards(JwtTwoFactorGuard)
@Controller('api/v1/my/request/trade')
@ApiTags('investor', 'request', 'trade', 'my')
@ApiBearerAuth()
export class RequestTradeMyController {
  constructor(private readonly requestService: RequestService) {}

  @Get()
  @ApiOperation({ summary: 'Get trade request list a user has access to' })
  @ApiOkResponse({ type: [GetRequestTradeMyResponseDto] })
  @ApiUnauthorizedResponse({
    description: 'Not authenticated',
    type: ExceptionDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ExceptionDto,
  })
  async getRequestTradeMyList(
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<GetRequestTradeMyResponseDto[]> {
    const requests = await this.requestService.getRequestTradeMyList(
      userCurrent,
    );

    return await Promise.all(
      requests.map(async (req) => await RequestTradeMapper.toGetMyDto(req)),
    );
  }
}
