import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  Get,
  Patch,
  Put,
  BadRequestException,
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
import { AccountService } from './account.service';
import { ParseObjectIdPipe } from 'src/pipe/parse-objectid.pipe';
import { CreateAccountRequestDto } from './dto/create-account-request.dto';
import { CreateAccountResponseDto } from './dto/create-account-response.dto';
import { DeleteAccountResponseDto } from './dto/delete-account-response.dto';
import JwtTwoFactorGuard from '../auth/guard/jwt-two-factor.guard';
import { UserDocument } from 'src/schema/user/user.schema';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { Permissions } from '../auth/decorator/permissions.decorator';
import { PermissionsGuard } from '../auth/guard/permissions.guard';
import { OrganizationService } from '../organization/organization.service';
import { AccountMapper } from './mapper/account.mapper';
import { PermissionClearer } from 'src/schema/role/permission.helper';
import { GetAccountResponseDto } from './dto/get-account-response.dto';
import { UpdateAccountResponseDto } from './dto/update-account-response.dto';
import { UpdateAccountRequestDto } from './dto/update-account-request.dto';
import { AssignAccountResponseDto } from './dto/assign-account-response.dto';
import { GetAccountDetailsResponseDto } from './dto/get-account-details-response.dto';
import { UnassignAccountResponseDto } from './dto/unassign-account-response.dto';

@UseGuards(JwtTwoFactorGuard, PermissionsGuard)
@Controller('api/v1/account')
@ApiTags('account', 'clearer')
@ApiBearerAuth()
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly organizationService: OrganizationService,
  ) {}

  @Get()
  @Permissions(PermissionClearer.accountRead)
  @ApiOperation({ summary: 'Get clearer account list' })
  @ApiOkResponse({ type: [GetAccountResponseDto] })
  async getAccountList(): Promise<GetAccountResponseDto[]> {
    const accounts = await this.accountService.getAccountList();

    return accounts.map((account) => AccountMapper.toGetDto(account));
  }

  @Get(':accountId')
  @Permissions(PermissionClearer.accountRead)
  @ApiOperation({ summary: 'Get clearer account' })
  @ApiOkResponse({ type: GetAccountDetailsResponseDto })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Account has not been found',
    type: ExceptionDto,
  })
  async getAccount(
    @Param('accountId', ParseObjectIdPipe) accountId: string,
  ): Promise<GetAccountDetailsResponseDto> {
    const account = await this.accountService.getAccountById(accountId);

    return AccountMapper.toGetDetailsDto(account);
  }

  @Post()
  @Permissions(PermissionClearer.accountCreate)
  @ApiOperation({ summary: 'Create clearer account' })
  @ApiCreatedResponse({
    description: 'Successfully created clearer account id',
    type: CreateAccountResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid form',
    type: InvalidFormExceptionDto,
  })
  async createAccount(
    @Body() request: CreateAccountRequestDto,
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<CreateAccountResponseDto> {
    const account = await this.accountService.createAccount(
      request,
      userCurrent,
    );

    return AccountMapper.toCreateDto(account);
  }

  @Patch(':accountId')
  @Permissions(PermissionClearer.roleUpdate)
  @ApiOperation({ summary: 'Update clearer account' })
  @ApiOkResponse({
    description: 'Successfully updated clearer account id',
    type: UpdateAccountResponseDto,
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
    description: 'Clearer account has not been found',
    type: ExceptionDto,
  })
  async updateAccount(
    @Param('accountId', ParseObjectIdPipe) accountId: string,
    @Body() request: UpdateAccountRequestDto,
  ): Promise<UpdateAccountResponseDto> {
    const account = await this.accountService.getAccountById(accountId);

    if (!account) {
      throw new NotFoundException();
    }

    await this.accountService.updateAccount(account, request);

    return AccountMapper.toUpdateDto(account);
  }

  @Delete(':accountId')
  @Permissions(PermissionClearer.accountDelete)
  @ApiOperation({ summary: 'Delete clearer account' })
  @ApiOkResponse({
    description: 'Successfully deleted clearer account id',
    type: DeleteAccountResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Impossible delete assigned clearer account',
    type: InvalidFormExceptionDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Clearer account has not been found',
    type: ExceptionDto,
  })
  async deleteAccount(
    @Param('accountId', ParseObjectIdPipe) accountId: string,
  ): Promise<DeleteAccountResponseDto> {
    const account = await this.accountService.getAccountById(accountId);

    if (!account) {
      throw new NotFoundException();
    }

    if (account.organizations?.length) {
      throw new BadRequestException(
        'Impossible delete assigned clearer account',
      );
    }

    await account.remove();

    return AccountMapper.toDeleteDto(account);
  }

  @Put(':accountId/:organizationId')
  @Permissions(PermissionClearer.accountAssign)
  @ApiOperation({ summary: 'Assign clearer account to organization' })
  @ApiCreatedResponse({
    description: 'Successfully assigned to organization clearer account id',
    type: AssignAccountResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'The same currency or account already assigned',
    type: InvalidFormExceptionDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Organization or clearer account has not been found',
    type: ExceptionDto,
  })
  async assignAccountToOrganization(
    @Param('accountId', ParseObjectIdPipe) accountId: string,
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
  ): Promise<AssignAccountResponseDto> {
    const account = await this.accountService.getAccountById(accountId);
    const organization = await this.organizationService.getById(organizationId);

    if (!account || !organization) {
      throw new NotFoundException();
    }

    const assignedAccount = account.organizations.some((org) => {
      return org.toString() === organization.id;
    });

    if (assignedAccount) {
      throw new BadRequestException('The same account already assigned');
    }

    const assignedCurrency = organization.clearing.some((clearing) => {
      return clearing.currency === account.currency;
    });

    if (assignedCurrency) {
      throw new BadRequestException('The same currency already assigned');
    }

    organization.clearing.push({
      currency: account.currency,
      iban: account.iban,
      account: account,
    });
    account.organizations.push(organization);

    await organization.save();
    await account.save();

    return AccountMapper.toAssignDto(account);
  }

  @Delete(':accountId/:organizationId')
  @Permissions(PermissionClearer.accountAssign)
  @ApiOperation({ summary: 'Unassign clearer account from organization' })
  @ApiOkResponse({
    description: 'Successfully unassigned clearer account id',
    type: UnassignAccountResponseDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Organization or clearer account has not been found',
    type: ExceptionDto,
  })
  async unassignAccountFromOrganization(
    @Param('accountId', ParseObjectIdPipe) accountId: string,
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
  ): Promise<UnassignAccountResponseDto> {
    const organization = await this.organizationService.getById(organizationId);
    const account = await this.accountService.getAccountById(accountId);

    if (!account || !organization) {
      throw new NotFoundException();
    }

    await organization.updateOne({
      $pull: { clearing: { account: account._id } },
    });
    await account.updateOne({ $pull: { organizations: organization._id } });

    return AccountMapper.toUnassignDto(account);
  }
}
