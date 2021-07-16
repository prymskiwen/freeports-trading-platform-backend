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
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Permissions } from '../auth/decorator/permissions.decorator';
import { PermissionsGuard } from '../auth/guard/permissions.guard';
import JwtTwoFactorGuard from '../auth/guard/jwt-two-factor.guard';
import { PermissionDesk } from 'src/schema/role/permission.helper';
import { RequestService } from './request.service';
import { GetRequestTradeResponseDto } from './dto/trade/get-request-trade-response.dto';
import { RequestMapper } from './mapper/request.mapper';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { UserDocument } from 'src/schema/user/user.schema';
import { ParseObjectIdPipe } from 'src/pipe/parse-objectid.pipe';
import { DeskService } from '../desk/desk.service';
import { InvestorService } from '../investor/investor.service';
import { OrganizationService } from '../organization/organization.service';
import { ExceptionDto } from 'src/exeption/dto/exception.dto';
import { CreateRequestResponseDto } from './dto/create-request-response.dto';
import { CreateRequestTradeRequestDto } from './dto/trade/create-request-trade-request.dto';
import { InvalidFormExceptionDto } from 'src/exeption/dto/invalid-form-exception.dto';
import { InvalidFormException } from 'src/exeption/invalid-form.exception';

@UseGuards(JwtTwoFactorGuard, PermissionsGuard)
@Controller(
  'api/v1/organization/:organizationId/desk/:deskId/investor/:investorId/trade',
)
@ApiTags('investor', 'request', 'trade')
@ApiBearerAuth()
export class RequestTradeController {
  constructor(
    private readonly deskService: DeskService,
    private readonly investorService: InvestorService,
    private readonly organizationService: OrganizationService,
    private readonly requestService: RequestService,
  ) {}

  @Get()
  @Permissions(PermissionDesk.requestTrade)
  @ApiOperation({ summary: 'Get trade request list' })
  @ApiOkResponse({ type: [GetRequestTradeResponseDto] })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Investor has not been found',
    type: ExceptionDto,
  })
  async getRequestTradeList(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Param('investorId', ParseObjectIdPipe) investorId: string,
  ): Promise<GetRequestTradeResponseDto[]> {
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

    const requests = await this.requestService.getRequestTradeList(investor);

    return requests.map((request) =>
      RequestMapper.toGetRequestTradeDto(request),
    );
  }

  @Post()
  @Permissions(PermissionDesk.requestTrade)
  @ApiOperation({ summary: 'Create trade request' })
  @ApiCreatedResponse({
    description: 'Successfully created trade request id',
    type: CreateRequestResponseDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid form',
    type: InvalidFormExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Investor has not been found',
    type: ExceptionDto,
  })
  async createRequestTrade(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Param('investorId', ParseObjectIdPipe) investorId: string,
    @Body() request: CreateRequestTradeRequestDto,
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<CreateRequestResponseDto> {
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

    // check trde accounts from request
    const accountFrom = organization.clearing.find(
      (clearing) => clearing.account.toString() === request.accountFrom,
    );
    if (!accountFrom) {
      throw new InvalidFormException([
        {
          path: 'accountFrom',
          constraints: {
            IsUnique: `accountFrom not found as organizaton account`,
          },
        },
      ]);
    }

    const accountTo = organization.clearing.find(
      (clearing) => clearing.account.toString() === request.accountTo,
    );

    if (!accountTo) {
      throw new InvalidFormException([
        {
          path: 'accountTo',
          constraints: {
            IsUnique: `accountTo not found as organizaton account`,
          },
        },
      ]);
    }

    const requestTrade = await this.requestService.createRequestTrade(
      investor,
      accountFrom,
      accountTo,
      request,
      userCurrent,
    );
    await investor.updateOne({ $push: { requests: requestTrade._id } });

    return RequestMapper.toCreateDto(requestTrade);
  }
}
