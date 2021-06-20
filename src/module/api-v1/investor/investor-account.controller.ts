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
  ApiInternalServerErrorResponse,
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
import { UserDocument } from 'src/schema/user/user.schema';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { Permissions } from '../auth/decorator/permissions.decorator';
import { PermissionsGuard } from '../auth/guard/permissions.guard';
import { OrganizationService } from '../organization/organization.service';
import { PermissionOrganization } from 'src/schema/role/permission.helper';
import { CreateAccountRequestDto } from '../account/dto/create-account-request.dto';
import { AssignAccountResponseDto } from '../account/dto/assign-account-response.dto';
import { AccountService } from '../account/account.service';
import { AccountMapper } from '../account/mapper/account.mapper';
import { UnassignAccountResponseDto } from '../account/dto/unassign-account-response.dto';
import { GetAccountResponseDto } from '../account/dto/get-account-response.dto';

@UseGuards(JwtTwoFactorGuard, PermissionsGuard)
@Controller('api/v1/organization/:organizationId/investor/:investorId/account')
@ApiTags('investor')
@ApiBearerAuth()
export class InvestorAccountController {
  constructor(
    private readonly investorService: InvestorService,
    private readonly organizationService: OrganizationService,
    private readonly accountService: AccountService,
  ) {}

  @Get()
  @Permissions(PermissionOrganization.accountRead)
  @ApiOperation({ summary: 'Get investor account list' })
  @ApiOkResponse({ type: [GetAccountResponseDto] })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Investor has not been found',
    type: ExceptionDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ExceptionDto,
  })
  async getInvestorList(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('investorId', ParseObjectIdPipe) investorId: string,
  ): Promise<GetAccountResponseDto[]> {
    const organization = await this.organizationService.getById(organizationId);

    if (!organization) {
      throw new NotFoundException();
    }

    const investor = await this.investorService.getInvestorById(
      investorId,
      organization,
    );

    if (!investor) {
      throw new NotFoundException();
    }

    const accounts = await this.accountService.getAccountInvestorList(investor);

    return accounts.map((account) => AccountMapper.toGetDto(account));
  }

  @Post()
  @Permissions(PermissionOrganization.accountCreate)
  @ApiOperation({ summary: 'Create account and assign it to investor' })
  @ApiCreatedResponse({
    description: 'Successfully assigned to investor account id',
    type: AssignAccountResponseDto,
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
  async assignInvestorToOrganization(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('investorId', ParseObjectIdPipe) investorId: string,
    @Body() request: CreateAccountRequestDto,
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<AssignAccountResponseDto> {
    const organization = await this.organizationService.getById(organizationId);

    if (!organization) {
      throw new NotFoundException();
    }

    const investor = await this.investorService.getInvestorById(
      investorId,
      organization,
    );

    if (!investor) {
      throw new NotFoundException();
    }

    const account = await this.accountService.createAccountInvestor(
      investor,
      request,
      userCurrent,
    );

    investor.accounts.push(account);
    await investor.save();

    return AccountMapper.toAssignDto(account);
  }

  @Delete(':accountId')
  @Permissions(PermissionOrganization.accountDelete)
  @ApiOperation({ summary: 'Delete account and unassign it from investor' })
  @ApiOkResponse({
    description: 'Successfully unassigned account id',
    type: UnassignAccountResponseDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Account has not been found',
    type: ExceptionDto,
  })
  async unassignInvestorFromOrganization(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('investorId', ParseObjectIdPipe) investorId: string,
    @Param('accountId', ParseObjectIdPipe) accountId: string,
  ): Promise<UnassignAccountResponseDto> {
    const organization = await this.organizationService.getById(organizationId);

    if (!organization) {
      throw new NotFoundException();
    }

    const investor = await this.investorService.getInvestorById(
      investorId,
      organization,
    );

    if (!investor) {
      throw new NotFoundException();
    }

    const account = await this.accountService.getAccountInvestorById(
      accountId,
      investor,
    );

    if (!account) {
      throw new NotFoundException();
    }

    await this.investorService.unassignAccount(investor, account);
    await account.remove();

    return AccountMapper.toUnassignDto(account);
  }
}
