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
import { Permissions } from '../../auth/decorator/permissions.decorator';
import { PermissionsGuard } from '../../auth/guard/permissions.guard';
import JwtTwoFactorGuard from '../../auth/guard/jwt-two-factor.guard';
import { PermissionDesk } from 'src/schema/role/permission.helper';
import { RequestService } from '../request.service';
import { RequestFundMapper } from '../mapper/request-fund.mapper';
import { CurrentUser } from '../../auth/decorator/current-user.decorator';
import { UserDocument } from 'src/schema/user/user.schema';
import { ParseObjectIdPipe } from 'src/pipe/parse-objectid.pipe';
import { DeskService } from '../../desk/desk.service';
import { InvestorService } from '../../investor/investor.service';
import { OrganizationService } from '../../organization/organization.service';
import { ExceptionDto } from 'src/exeption/dto/exception.dto';
import { CreateRequestResponseDto } from '../dto/create-request-response.dto';
import { InvalidFormExceptionDto } from 'src/exeption/dto/invalid-form-exception.dto';
import { InvalidFormException } from 'src/exeption/invalid-form.exception';
import { GetRequestFundResponseDto } from '../dto/fund/get-request-fund-response.dto';
import { CreateRequestFundRequestDto } from '../dto/fund/create-request-fund-request.dto';
import { InvestorAccountDocument } from 'src/schema/investor/embedded/investor-account.embedded';

@UseGuards(JwtTwoFactorGuard, PermissionsGuard)
@Controller(
  'api/v1/organization/:organizationId/desk/:deskId/investor/:investorId/fund',
)
@ApiTags('investor', 'request', 'fund')
@ApiBearerAuth()
export class RequestFundController {
  constructor(
    private readonly deskService: DeskService,
    private readonly investorService: InvestorService,
    private readonly organizationService: OrganizationService,
    private readonly requestService: RequestService,
  ) {}

  @Get()
  @Permissions(PermissionDesk.requestFund)
  @ApiOperation({ summary: 'Get fund request list' })
  @ApiOkResponse({ type: [GetRequestFundResponseDto] })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Investor has not been found',
    type: ExceptionDto,
  })
  async getRequestFundList(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Param('investorId', ParseObjectIdPipe) investorId: string,
  ): Promise<GetRequestFundResponseDto[]> {
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

    const requests = await this.requestService.getRequestFundList(investor);

    return requests.map((request) => RequestFundMapper.toGetDto(request));
  }

  @Post()
  @Permissions(PermissionDesk.requestFund)
  @ApiOperation({ summary: 'Create fund request' })
  @ApiCreatedResponse({
    description: 'Successfully created fund request id',
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
  async createRequestFund(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Param('investorId', ParseObjectIdPipe) investorId: string,
    @Body() request: CreateRequestFundRequestDto,
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

    // check investor account from
    let accountFrom: InvestorAccountDocument;
    if (request.accountFrom) {
      accountFrom = investor.accounts.find(
        (account) => account.id.toString() === request.accountFrom,
      );
      if (!accountFrom) {
        throw new InvalidFormException([
          {
            path: 'accountFrom',
            constraints: {
              IsExist: `accountFrom not found as investor account`,
            },
          },
        ]);
      }
    }

    // check trde account to
    const accountTo = organization.clearing.find(
      (clearing) => clearing.account.toString() === request.accountTo,
    );

    if (!accountTo) {
      throw new InvalidFormException([
        {
          path: 'accountTo',
          constraints: {
            IsExist: `accountTo not found as organizaton account`,
          },
        },
      ]);
    }

    const requestFund = await this.requestService.createRequestFund(
      investor,
      accountFrom,
      accountTo,
      request,
      userCurrent,
    );
    await investor.updateOne({ $push: { requests: requestFund._id } });

    return RequestFundMapper.toCreateDto(requestFund);
  }
}
