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
import { RequestMoveMapper } from '../mapper/request-move.mapper';
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
import { GetRequestMoveResponseDto } from '../dto/move/get-request-move-response.dto';
import { CreateRequestMoveRequestDto } from '../dto/move/create-request-move-request.dto';
import { InvestorAccountDocument } from 'src/schema/investor/embedded/investor-account.embedded';
import { ApiPaginationResponse } from 'src/pagination/api-pagination-response.decorador';
import { PaginationParams } from 'src/pagination/pagination-params.decorator';
import { PaginationRequest } from 'src/pagination/pagination-request.interface';
import { PaginationResponseDto } from 'src/pagination/pagination-response.dto';
import { RequestMoveDocument } from 'src/schema/request/request-move.schema';
import { PaginationHelper } from 'src/pagination/pagination.helper';
import { GetRequestMoveDetailsResponseDto } from '../dto/move/get-request-move-details-response.dto';

@UseGuards(JwtTwoFactorGuard, PermissionsGuard)
@Controller(
  'api/v1/organization/:organizationId/desk/:deskId/investor/:investorId/move',
)
@ApiTags('investor', 'request', 'move')
@ApiBearerAuth()
export class RequestMoveController {
  constructor(
    private readonly deskService: DeskService,
    private readonly investorService: InvestorService,
    private readonly organizationService: OrganizationService,
    private readonly requestService: RequestService,
  ) {}

  @Get()
  @Permissions(PermissionDesk.requestMove)
  @ApiOperation({ summary: 'Get move request list' })
  @ApiPaginationResponse(GetRequestMoveResponseDto)
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Investor has not been found',
    type: ExceptionDto,
  })
  async getRequestMoves(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Param('investorId', ParseObjectIdPipe) investorId: string,
    @PaginationParams() pagination: PaginationRequest,
  ): Promise<PaginationResponseDto<GetRequestMoveResponseDto>> {
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
    ] = await this.requestService.getRequestMovesPaginated(
      investor,
      pagination,
    );
    const requestDtos: GetRequestMoveResponseDto[] = await Promise.all(
      paginatedResult.map(
        async (
          request: RequestMoveDocument,
        ): Promise<GetRequestMoveResponseDto> => {
          const requestHydrated = this.requestService.hydrateRequestMove(
            request,
          );
          const requestDto = RequestMoveMapper.toGetDto(requestHydrated);

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

  @Get(':moveId')
  @Permissions(PermissionDesk.requestMove)
  @ApiOperation({ summary: 'Get move request' })
  @ApiOkResponse({ type: GetRequestMoveDetailsResponseDto })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Move request has not been found',
    type: ExceptionDto,
  })
  async getRequestMove(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Param('investorId', ParseObjectIdPipe) investorId: string,
    @Param('moveId', ParseObjectIdPipe) moveId: string,
  ): Promise<GetRequestMoveDetailsResponseDto> {
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

    const requestMove = await this.requestService.getRequestMoveById(
      moveId,
      investor,
    );

    if (!requestMove) {
      throw new NotFoundException();
    }

    return RequestMoveMapper.toGetDetailsDto(requestMove);
  }

  @Post()
  @Permissions(PermissionDesk.requestMove)
  @ApiOperation({ summary: 'Create move request' })
  @ApiCreatedResponse({
    description: 'Successfully created move request id',
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
  async createRequestMove(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Param('investorId', ParseObjectIdPipe) investorId: string,
    @Body() request: CreateRequestMoveRequestDto,
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

    const requestMove = await this.requestService.createRequestMove(
      investor,
      accountFrom,
      request,
      userCurrent,
    );
    await investor.updateOne({ $push: { requests: requestMove._id } });

    return RequestMoveMapper.toCreateDto(requestMove);
  }
}
