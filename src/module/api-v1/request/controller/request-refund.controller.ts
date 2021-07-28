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
import { RequestRefundMapper } from '../mapper/request-refund.mapper';
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
import { GetRequestRefundResponseDto } from '../dto/refund/get-request-refund-response.dto';
import { CreateRequestRefundRequestDto } from '../dto/refund/create-request-refund-request.dto';
import { InvestorAccountDocument } from 'src/schema/investor/embedded/investor-account.embedded';
import { ApiPaginationResponse } from 'src/pagination/api-pagination-response.decorador';
import { PaginationParams } from 'src/pagination/pagination-params.decorator';
import { PaginationRequest } from 'src/pagination/pagination-request.interface';
import { PaginationResponseDto } from 'src/pagination/pagination-response.dto';
import { RequestRefundDocument } from 'src/schema/request/request-refund.schema';
import { PaginationHelper } from 'src/pagination/pagination.helper';
import { GetRequestRefundDetailsResponseDto } from '../dto/refund/get-request-trade-details-response.dto';

@UseGuards(JwtTwoFactorGuard, PermissionsGuard)
@Controller(
  'api/v1/organization/:organizationId/desk/:deskId/investor/:investorId/refund',
)
@ApiTags('investor', 'request', 'refund')
@ApiBearerAuth()
export class RequestRefundController {
  constructor(
    private readonly deskService: DeskService,
    private readonly investorService: InvestorService,
    private readonly organizationService: OrganizationService,
    private readonly requestService: RequestService,
  ) {}

  @Get()
  @Permissions(PermissionDesk.requestRefund)
  @ApiOperation({ summary: 'Get refund request list' })
  @ApiPaginationResponse(GetRequestRefundResponseDto)
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Investor has not been found',
    type: ExceptionDto,
  })
  async getRequestRefunds(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Param('investorId', ParseObjectIdPipe) investorId: string,
    @PaginationParams() pagination: PaginationRequest,
  ): Promise<PaginationResponseDto<GetRequestRefundResponseDto>> {
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

    const [
      { paginatedResult, totalResult },
    ] = await this.requestService.getRequestRefundsPaginated(
      investor,
      pagination,
    );
    const requestDtos: GetRequestRefundResponseDto[] = await Promise.all(
      paginatedResult.map(
        async (
          request: RequestRefundDocument,
        ): Promise<GetRequestRefundResponseDto> => {
          const requestHydrated = this.requestService.hydrateRequestRefund(
            request,
          );
          const requestDto = RequestRefundMapper.toGetDto(requestHydrated);

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

  @Get(':refundId')
  @Permissions(PermissionDesk.requestRefund)
  @ApiOperation({ summary: 'Get refund request' })
  @ApiOkResponse({ type: GetRequestRefundDetailsResponseDto })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Refund request has not been found',
    type: ExceptionDto,
  })
  async getRequestRefund(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Param('investorId', ParseObjectIdPipe) investorId: string,
    @Param('refundId', ParseObjectIdPipe) refundId: string,
  ): Promise<GetRequestRefundDetailsResponseDto> {
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

    const requestRefund = await this.requestService.getRequestRefundById(
      refundId,
      investor,
    );

    if (!requestRefund) {
      throw new NotFoundException();
    }

    return RequestRefundMapper.toGetDetailsDto(requestRefund);
  }

  @Post()
  @Permissions(PermissionDesk.requestRefund)
  @ApiOperation({ summary: 'Create refund request' })
  @ApiCreatedResponse({
    description: 'Successfully created refund request id',
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
  async createRequestRefund(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Param('investorId', ParseObjectIdPipe) investorId: string,
    @Body() request: CreateRequestRefundRequestDto,
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

    // check trde account from
    const accountFrom = organization.clearing.find(
      (clearing) => clearing.account.toString() === request.accountFrom,
    );

    if (!accountFrom) {
      throw new InvalidFormException([
        {
          path: 'accountFrom',
          constraints: {
            IsExist: `accountFrom not found as organizaton account`,
          },
        },
      ]);
    }

    // check investor account to
    let accountTo: InvestorAccountDocument;
    if (request.accountTo) {
      accountTo = investor.accounts.find(
        (account) => account.id.toString() === request.accountTo,
      );
      if (!accountTo) {
        throw new InvalidFormException([
          {
            path: 'accountTo',
            constraints: {
              IsExist: `accountTo not found as investor account`,
            },
          },
        ]);
      }
    }

    const requestRefund = await this.requestService.createRequestRefund(
      investor,
      accountFrom,
      accountTo,
      request,
      userCurrent,
    );
    await investor.updateOne({ $push: { requests: requestRefund._id } });

    return RequestRefundMapper.toCreateDto(requestRefund);
  }
}
