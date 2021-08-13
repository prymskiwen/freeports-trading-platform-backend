import {
  Controller,
  Param,
  UseGuards,
  NotFoundException,
  Get,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ExceptionDto } from 'src/exeption/dto/exception.dto';
import { AccountService } from './account.service';
import { ParseObjectIdPipe } from 'src/pipe/parse-objectid.pipe';
import JwtTwoFactorGuard from '../auth/guard/jwt-two-factor.guard';
import { Permissions } from '../auth/decorator/permissions.decorator';
import { PermissionsGuard } from '../auth/guard/permissions.guard';
import { PermissionClearer } from 'src/schema/role/permission.helper';
import { ApiPaginationResponse } from 'src/pagination/api-pagination-response.decorador';
import { RequestService } from '../request/request.service';
import { PaginationParams } from 'src/pagination/pagination-params.decorator';
import { PaginationRequest } from 'src/pagination/pagination-request.interface';
import { PaginationResponseDto } from 'src/pagination/pagination-response.dto';
import { GetRequestOfAccountResponseDto } from '../request/dto/get-request-of-account-response.dto';
import { RequestDocument } from 'src/schema/request/request.schema';
import { RequestMapper } from '../request/mapper/request.mapper';
import { PaginationHelper } from 'src/pagination/pagination.helper';
import { GetRequestFundDetailsResponseDto } from '../request/dto/fund/get-request-fund-details-response.dto';
import { GetRequestRefundDetailsResponseDto } from '../request/dto/refund/get-request-trade-details-response.dto';
import { GetRequestTradeDetailsResponseDto } from '../request/dto/trade/get-request-trade-details-response.dto';

@UseGuards(JwtTwoFactorGuard, PermissionsGuard)
@Controller('api/v1/account/:accountId')
@ApiTags('account', 'clearer', 'request')
@ApiBearerAuth()
export class AccountRequestController {
  constructor(
    private readonly accountService: AccountService,
    private readonly requestService: RequestService,
  ) {}

  @Get('request')
  @Permissions(PermissionClearer.accountRead)
  @ApiOperation({ summary: 'Get account request list' })
  @ApiPaginationResponse(GetRequestOfAccountResponseDto)
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Account has not been found',
    type: ExceptionDto,
  })
  async getRequests(
    @Param('accountId', ParseObjectIdPipe) accountId: string,
    @PaginationParams() pagination: PaginationRequest,
  ): Promise<PaginationResponseDto<GetRequestOfAccountResponseDto>> {
    const account = await this.accountService.getAccountById(accountId);

    if (!account) {
      throw new NotFoundException();
    }

    const [
      { paginatedResult, totalResult },
    ] = await this.requestService.getRequestOfAccountPaginated(
      account,
      pagination,
    );
    const requestDtos: GetRequestOfAccountResponseDto[] = await Promise.all(
      paginatedResult.map(
        async (
          request: RequestDocument,
        ): Promise<GetRequestOfAccountResponseDto> => {
          const requestHydrated = this.requestService.hydrateRequest(request);
          const requestDto = RequestMapper.toGetForAccountDto(requestHydrated);

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

  @Get('request/:requestId')
  @Permissions(PermissionClearer.accountRead)
  @ApiOperation({ summary: 'Get acount request details' })
  @ApiOkResponse({
    schema: {
      anyOf: [
        { $ref: getSchemaPath(GetRequestFundDetailsResponseDto) },
        { $ref: getSchemaPath(GetRequestRefundDetailsResponseDto) },
        { $ref: getSchemaPath(GetRequestTradeDetailsResponseDto) },
      ],
    },
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Request has not been found',
    type: ExceptionDto,
  })
  async getRequestFund(
    @Param('accountId', ParseObjectIdPipe) accountId: string,
    @Param('requestId', ParseObjectIdPipe) requestId: string,
  ): Promise<
    | GetRequestFundDetailsResponseDto
    | GetRequestRefundDetailsResponseDto
    | GetRequestTradeDetailsResponseDto
  > {
    const account = await this.accountService.getAccountById(accountId);

    if (!account) {
      throw new NotFoundException();
    }

    const request = await this.requestService.getRequestOfAccountById(
      requestId,
      account,
    );

    if (!request) {
      throw new NotFoundException();
    }

    return RequestMapper.toGetDetailsForAccountDto(request);
  }
}
