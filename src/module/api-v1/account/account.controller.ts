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
  ApiInternalServerErrorResponse,
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
import { GetAccountClearerDetailsResponseDto } from './dto/get-account-clearer-details-response.dto';
import { UnassignAccountResponseDto } from './dto/unassign-account-response.dto';

@UseGuards(JwtTwoFactorGuard, PermissionsGuard)
@Controller('api/v1/clearer')
@ApiTags('account')
@ApiBearerAuth()
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly organizationService: OrganizationService,
  ) {}

  @Get('account')
  @Permissions(PermissionClearer.accountRead)
  @ApiTags('clearer')
  @ApiOperation({ summary: 'Get clearer account list' })
  @ApiOkResponse({ type: [GetAccountResponseDto] })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ExceptionDto,
  })
  async getAccountClearerList(): Promise<GetAccountResponseDto[]> {
    const accounts = await this.accountService.getAccountClearerList();

    return accounts.map((account) => AccountMapper.toGetDto(account));
  }

  @Get('/account/:accountId')
  @Permissions(PermissionClearer.accountRead)
  @ApiTags('clearer')
  @ApiOperation({ summary: 'Get clearer account' })
  @ApiOkResponse({ type: GetAccountClearerDetailsResponseDto })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ExceptionDto,
  })
  async getAccountClearer(
    @Param('accountId', ParseObjectIdPipe) accountId: string,
  ): Promise<GetAccountClearerDetailsResponseDto> {
    const account = await this.accountService.getAccountClearerById(accountId);

    return AccountMapper.toGetClearerDetailsDto(account);
  }

  @Post('account')
  @Permissions(PermissionClearer.accountCreate)
  @ApiTags('clearer')
  @ApiOperation({ summary: 'Create clearer account' })
  @ApiCreatedResponse({
    description: 'Successfully created clearer account id',
    type: CreateAccountResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid form',
    type: InvalidFormExceptionDto,
  })
  async createAccountClearer(
    @Body() request: CreateAccountRequestDto,
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<CreateAccountResponseDto> {
    const account = await this.accountService.createAccountClearer(
      request,
      userCurrent,
    );

    return AccountMapper.toCreateDto(account);
  }

  @Patch('account/:accountId')
  @Permissions(PermissionClearer.roleUpdate)
  @ApiTags('clearer')
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
  async updateAccountClearer(
    @Param('accountId', ParseObjectIdPipe) accountId: string,
    @Body() request: UpdateAccountRequestDto,
  ): Promise<UpdateAccountResponseDto> {
    const account = await this.accountService.getAccountClearerById(accountId);

    if (!account) {
      throw new NotFoundException();
    }

    await this.accountService.updateAccountClearer(account, request);

    return AccountMapper.toUpdateDto(account);
  }

  @Delete('account/:accountId')
  @Permissions(PermissionClearer.accountDelete)
  @ApiTags('clearer')
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
  async deleteAccountClearer(
    @Param('accountId', ParseObjectIdPipe) accountId: string,
  ): Promise<DeleteAccountResponseDto> {
    const account = await this.accountService.getAccountClearerById(accountId);

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

  @Put('account/:accountId/:organizationId')
  @Permissions(PermissionClearer.accountAssign)
  @ApiTags('clearer')
  @ApiOperation({ summary: 'Assign clearer account to organization' })
  @ApiCreatedResponse({
    description: 'Successfully assigned to organization clearer account id',
    type: AssignAccountResponseDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Organization or clearer account has not been found',
    type: ExceptionDto,
  })
  async assignAccountClearerToOrganization(
    @Param('accountId', ParseObjectIdPipe) accountId: string,
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
  ): Promise<AssignAccountResponseDto> {
    const account = await this.accountService.getAccountClearerById(accountId);
    const organization = await this.organizationService.getById(organizationId);

    if (!account || !organization) {
      throw new NotFoundException();
    }

    const assigned = account.organizations.some((org) => {
      return org.toString() === organization.id;
    });

    if (!assigned) {
      organization.clearing.push({
        currency: account.details.currency,
        iban: account.fiatDetails?.iban,
        account: account,
      });
      account.organizations.push(organization);

      await organization.save();
      await account.save();
    }

    return AccountMapper.toAssignDto(account);
  }

  @Delete('account/:accountId/:organizationId')
  @Permissions(PermissionClearer.accountAssign)
  @ApiTags('clearer')
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
  async unassignAccountClearerFromOrganization(
    @Param('accountId', ParseObjectIdPipe) accountId: string,
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
  ): Promise<UnassignAccountResponseDto> {
    const organization = await this.organizationService.getById(organizationId);
    const account = await this.accountService.getAccountClearerById(accountId);

    if (!account || !organization) {
      throw new NotFoundException();
    }

    await this.organizationService.unassignAccount(organization, account);
    await this.accountService.unassignAccountClearerOrganization(
      account,
      organization,
    );

    return AccountMapper.toUnassignDto(account);
  }
}
