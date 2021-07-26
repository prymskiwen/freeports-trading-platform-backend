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
  @ApiOkResponse({ type: [GetRequestMoveResponseDto] })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Investor has not been found',
    type: ExceptionDto,
  })
  async getRequestMoveList(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Param('investorId', ParseObjectIdPipe) investorId: string,
  ): Promise<GetRequestMoveResponseDto[]> {
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

    const requests = await this.requestService.getRequestMoveList(investor);

    return requests.map((request) => RequestMoveMapper.toGetDto(request));
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
