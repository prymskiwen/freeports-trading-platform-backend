import {
  Controller,
  UseGuards,
  Get,
  Param,
  NotFoundException,
  Post,
  Body,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Permissions } from '../../../auth/decorator/permissions.decorator';
import { PermissionsGuard } from '../../../auth/guard/permissions.guard';
import JwtTwoFactorGuard from '../../../auth/guard/jwt-two-factor.guard';
import { PermissionDesk } from 'src/schema/role/permission.helper';
import { RequestService } from '../../request.service';
import { CurrentUser } from '../../../auth/decorator/current-user.decorator';
import { UserDocument } from 'src/schema/user/user.schema';
import { ParseObjectIdPipe } from 'src/pipe/parse-objectid.pipe';
import { DeskService } from '../../../desk/desk.service';
import { InvestorService } from '../../../investor/investor.service';
import { OrganizationService } from '../../../organization/organization.service';
import { ExceptionDto } from 'src/exeption/dto/exception.dto';
import { RequestTradeRfqMapper } from '../../mapper/request-trade-rfq.mapper';
import { GetRequestTradeRfqResponseDto } from '../../dto/trade/get-request-trade-rfq-response.dto';
import { CreateRequestTradeRfqRequestDto } from '../../dto/trade/create-request-trade-rfq-request.dto';
import { InvalidFormException } from 'src/exeption/invalid-form.exception';
import BigNumber from 'bignumber.js';

@UseGuards(JwtTwoFactorGuard, PermissionsGuard)
@Controller(
  'api/v1/organization/:organizationId/desk/:deskId/investor/:investorId/trade/:tradeId/rfq',
)
@ApiTags('investor', 'request', 'trade')
@ApiBearerAuth()
export class RequestTradeRfqController {
  constructor(
    private readonly deskService: DeskService,
    private readonly investorService: InvestorService,
    private readonly organizationService: OrganizationService,
    private readonly requestService: RequestService,
  ) {}

  @Get()
  @Permissions(PermissionDesk.requestTrade)
  @ApiOperation({ summary: 'Get trade request RFQ list' })
  @ApiOkResponse({ type: [GetRequestTradeRfqResponseDto] })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Trade request has not been found',
    type: ExceptionDto,
  })
  async getRequestTradeRfqList(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Param('investorId', ParseObjectIdPipe) investorId: string,
    @Param('tradeId', ParseObjectIdPipe) tradeId: string,
  ): Promise<GetRequestTradeRfqResponseDto[]> {
    const organization = await this.organizationService.getById(organizationId);
    const desk = await this.deskService.getById(deskId);

    if (
      !organization ||
      !desk ||
      desk.organization.toString() !== organization.id
    ) {
      throw new NotFoundException();
    }

    const investor = await this.investorService.getInvestorById(
      investorId,
      desk,
    );

    if (!investor) {
      throw new NotFoundException();
    }

    const requestTrade = await this.requestService.getRequestTradeById(
      tradeId,
      investor,
    );

    if (!requestTrade) {
      throw new NotFoundException();
    }

    return requestTrade.rfqs.map((rfq) => RequestTradeRfqMapper.toGetDto(rfq));
  }

  @Post()
  @Permissions(PermissionDesk.requestTrade)
  @ApiOperation({ summary: 'Get and persist recent RFQ for trade request' })
  @ApiOkResponse({ type: [GetRequestTradeRfqResponseDto] })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Trade request has not been found',
    type: ExceptionDto,
  })
  async getRequestTradeRfqRecent(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Param('investorId', ParseObjectIdPipe) investorId: string,
    @Param('tradeId', ParseObjectIdPipe) tradeId: string,
    @Body() request: CreateRequestTradeRfqRequestDto,
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<GetRequestTradeRfqResponseDto[]> {
    const organization = await this.organizationService.getById(organizationId);
    const desk = await this.deskService.getById(deskId);

    if (
      !organization ||
      !desk ||
      desk.organization.toString() !== organization.id
    ) {
      throw new NotFoundException();
    }

    const investor = await this.investorService.getInvestorById(
      investorId,
      desk,
    );

    if (!investor) {
      throw new NotFoundException();
    }

    const requestTrade = await this.requestService.getRequestTradeById(
      tradeId,
      investor,
    );

    if (!requestTrade) {
      throw new NotFoundException();
    }

    // TODO: get total quantity from orders (broker orders / validated rfq)
    const quantityOrder = new BigNumber(0);
    const quantityRequest = new BigNumber(request.quantity);
    const quantityRequestTrade = new BigNumber(requestTrade.quantity);
    if (
      !quantityRequest.gt(0) ||
      quantityRequest.gt(quantityRequestTrade.minus(quantityOrder))
    ) {
      throw new InvalidFormException([
        {
          path: 'quantity',
          constraints: {
            IsMatch: `rfq quantity should be positive and less or equal trade request quantity (${quantityRequestTrade}) - order quantity (${quantityOrder})`,
          },
        },
      ]);
    }

    const rfqs = await this.requestService.createRfq(
      requestTrade,
      request,
      userCurrent,
    );

    return rfqs.map((rfq) => RequestTradeRfqMapper.toGetDto(rfq));
  }
}
