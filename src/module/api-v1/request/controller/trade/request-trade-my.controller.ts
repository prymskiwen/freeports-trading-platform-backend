import { Controller, UseGuards, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import JwtTwoFactorGuard from '../../../auth/guard/jwt-two-factor.guard';
import { UserDocument } from 'src/schema/user/user.schema';
import { CurrentUser } from '../../../auth/decorator/current-user.decorator';
import { RequestService } from '../../request.service';
import { GetRequestTradeDetailsResponseDto } from '../../dto/trade/get-request-trade-details-response.dto';
import { RequestTradeMapper } from '../../mapper/request-trade.mapper';
import { ApiPaginationResponse } from 'src/pagination/api-pagination-response.decorador';
import { PaginationParams } from 'src/pagination/pagination-params.decorator';
import { PaginationRequest } from 'src/pagination/pagination-request.interface';
import { PaginationResponseDto } from 'src/pagination/pagination-response.dto';
import { PaginationHelper } from 'src/pagination/pagination.helper';
import { RequestTradeDocument } from 'src/schema/request/request-trade.schema';

@UseGuards(JwtTwoFactorGuard)
@Controller('api/v1/my/request/trade')
@ApiTags('investor', 'request', 'trade', 'my')
@ApiBearerAuth()
export class RequestTradeMyController {
  constructor(private readonly requestService: RequestService) {}

  @Get()
  @ApiOperation({ summary: 'Get trade request list a user has access to' })
  @ApiPaginationResponse(GetRequestTradeDetailsResponseDto)
  async getRequestTradeMyList(
    @PaginationParams() pagination: PaginationRequest,
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<PaginationResponseDto<GetRequestTradeDetailsResponseDto>> {
    const [
      { paginatedResult, totalResult },
    ] = await this.requestService.getMyRequestTradesPaginated(
      pagination,
      userCurrent,
    );
    const requestDtos: GetRequestTradeDetailsResponseDto[] = await Promise.all(
      paginatedResult.map(
        async (
          request: RequestTradeDocument,
        ): Promise<GetRequestTradeDetailsResponseDto> => {
          const requestHydrated = this.requestService.hydrateRequestTrade(
            request,
          );
          const requestDto = RequestTradeMapper.toGetDetailsDto(
            requestHydrated,
          );

          return requestDto;
        },
      ),
    );

    return PaginationHelper.of(
      pagination,
      totalResult[0]?.total || 0,
      requestDtos,
    );
  }
}
