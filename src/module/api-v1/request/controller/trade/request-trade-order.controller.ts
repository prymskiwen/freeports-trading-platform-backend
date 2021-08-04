import {
  Controller,
  UseGuards,
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
import { GetRequestTradeRfqResponseDto } from '../../dto/trade/get-request-trade-rfq-response.dto';
import { InvalidFormException } from 'src/exeption/invalid-form.exception';
import BigNumber from 'bignumber.js';
import { CreateRequestTradeOrderRequestDto } from '../../dto/trade/create-request-trade-order-request.dto';
import { GetRequestTradeOrderResponseDto } from '../../dto/trade/get-request-trade-order-response.dto';
import { RequestTradeOrderMapper } from '../../mapper/request-trade-order.mapper';

@UseGuards(JwtTwoFactorGuard, PermissionsGuard)
@Controller(
  'api/v1/organization/:organizationId/desk/:deskId/investor/:investorId/trade/:tradeId/order',
)
@ApiTags('investor', 'request', 'trade')
@ApiBearerAuth()
export class RequestTradeOrderController {
  constructor(
    private readonly deskService: DeskService,
    private readonly investorService: InvestorService,
    private readonly organizationService: OrganizationService,
    private readonly requestService: RequestService,
  ) {}

  @Post()
  @Permissions(PermissionDesk.requestTrade)
  @ApiOperation({ summary: 'Make an order to broker' })
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
    @Body() request: CreateRequestTradeOrderRequestDto,
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<GetRequestTradeOrderResponseDto> {
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

    if (request.quantity) {
      //TODO validate order price
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
              IsMatch: `order quantity should be positive and less or equal trade request quantity (${quantityRequestTrade}) - order quantity (${quantityOrder})`,
            },
          },
        ]);
      }
    }

    try {
      const order = await this.requestService.createOrder(
        requestTrade,
        request,
        userCurrent,
      );
      return RequestTradeOrderMapper.toGetDto(order);
    } catch (error) {
      console.log('error ', error);
      throw error;
    }
  }
}
