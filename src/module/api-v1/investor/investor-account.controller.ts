import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  Get,
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
import { ExceptionDto } from 'src/exeption/dto/exception.dto';
import { InvalidFormExceptionDto } from 'src/exeption/dto/invalid-form-exception.dto';
import { InvestorService } from './investor.service';
import { ParseObjectIdPipe } from 'src/pipe/parse-objectid.pipe';
import JwtTwoFactorGuard from '../auth/guard/jwt-two-factor.guard';
import { Permissions } from '../auth/decorator/permissions.decorator';
import { PermissionsGuard } from '../auth/guard/permissions.guard';
import { OrganizationService } from '../organization/organization.service';
import { PermissionDesk } from 'src/schema/role/permission.helper';
import { DeskService } from '../desk/desk.service';
import { GetInvestorAccountResponseDto } from './dto/account/get-investor-account-response.dto';
import { InvestorAccountMapper } from './mapper/investor-account.mapper';
import { InvestorAccountDocument } from 'src/schema/investor/embedded/investor-account.embedded';
import { AssignInvestorAccountResponseDto } from './dto/account/assign-investor-account-response.dto';
import { CreateInvestorAccountRequestDto } from './dto/account/create-investor-account-request.dto';
import { UnassignInvestorAccountResponseDto } from './dto/account/unassign-investor-account-response.dto';
import { UniqueFieldException } from 'src/exeption/unique-field.exception';

@UseGuards(JwtTwoFactorGuard, PermissionsGuard)
@Controller(
  'api/v1/organization/:organizationId/desk/:deskId/investor/:investorId/account',
)
@ApiTags('investor')
@ApiBearerAuth()
export class InvestorAccountController {
  constructor(
    private readonly deskService: DeskService,
    private readonly investorService: InvestorService,
    private readonly organizationService: OrganizationService,
  ) {}

  @Get()
  @Permissions(PermissionDesk.accountRead)
  @ApiOperation({ summary: 'Get investor account list' })
  @ApiOkResponse({ type: [GetInvestorAccountResponseDto] })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Investor has not been found',
    type: ExceptionDto,
  })
  async getInvestorAccountList(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Param('investorId', ParseObjectIdPipe) investorId: string,
  ): Promise<GetInvestorAccountResponseDto[]> {
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

    return investor.accounts.map((account: InvestorAccountDocument) =>
      InvestorAccountMapper.toGetDto(account),
    );
  }

  @Post()
  @Permissions(PermissionDesk.accountCreate)
  @ApiOperation({ summary: 'Create account and assign it to investor' })
  @ApiCreatedResponse({
    description: 'Successfully assigned to investor account id',
    type: AssignInvestorAccountResponseDto,
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
  async assignAccountToInvestor(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Param('investorId', ParseObjectIdPipe) investorId: string,
    @Body() request: CreateInvestorAccountRequestDto,
  ): Promise<AssignInvestorAccountResponseDto> {
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

    const assignedCurrency = investor.accounts.some((account) => {
      return account.currency === request.currency;
    });

    if (assignedCurrency) {
      throw new UniqueFieldException('currency', request.currency);
    }

    const account = await this.investorService.createAccount(investor, request);

    return InvestorAccountMapper.toAssignDto(account);
  }

  @Delete(':accountId')
  @Permissions(PermissionDesk.accountDelete)
  @ApiOperation({ summary: 'Delete account and unassign it from investor' })
  @ApiOkResponse({
    description: 'Successfully unassigned account id',
    type: UnassignInvestorAccountResponseDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Account has not been found',
    type: ExceptionDto,
  })
  async unassignAccountFromInvestor(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Param('investorId', ParseObjectIdPipe) investorId: string,
    @Param('accountId', ParseObjectIdPipe) accountId: string,
  ): Promise<UnassignInvestorAccountResponseDto> {
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

    const account = investor.accounts.id(accountId);

    if (!account) {
      throw new NotFoundException();
    }

    await account.remove();
    await investor.save();

    return InvestorAccountMapper.toUnassignDto(account);
  }
}
