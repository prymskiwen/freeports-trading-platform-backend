import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
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
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UserDocument } from 'src/schema/user/user.schema';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { Permissions } from '../auth/decorator/permissions.decorator';
import { PermissionsGuard } from '../auth/guard/permissions.guard';
import { OrganizationService } from '../organization/organization.service';
import { AccountMapper } from './mapper/account.mapper';
import { PermissionClearer } from 'src/schema/role/permission.helper';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('api/v1/organization')
@ApiBearerAuth()
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly organizationService: OrganizationService,
  ) {}

  @Post(':organizationId/account')
  @Permissions(PermissionClearer.organizationAccountCreate)
  @ApiTags('clearer')
  @ApiOperation({ summary: 'Create organization account' })
  @ApiCreatedResponse({
    description: 'Successfully registered organization account id',
    type: CreateAccountResponseDto,
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
    description: 'Organization has not been found',
    type: ExceptionDto,
  })
  async createAccount(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Body() request: CreateAccountRequestDto,
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<CreateAccountResponseDto> {
    const organization = await this.organizationService.getById(organizationId);

    if (!organization) {
      throw new NotFoundException();
    }

    const account = await this.accountService.create(request, userCurrent);

    organization.clearing.push({
      currency: request.currency,
      iban: request.iban,
      account: account,
    });
    await organization.save();

    return AccountMapper.toCreateDto(account);
  }



  @Delete(':organizationId/account/:accountId')
  @Permissions(PermissionClearer.organizationAccountDelete)
  @ApiTags('clearer')
  @ApiOperation({ summary: 'Delete organization account' })
  @ApiOkResponse({
    description: 'Successfully deleted organization account id',
    type: DeleteAccountResponseDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Organization or account has not been found',
    type: ExceptionDto,
  })
  async deleteAccount(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('accountId', ParseObjectIdPipe) accountId: string,
  ): Promise<DeleteAccountResponseDto> {
    const organization = await this.organizationService.getById(organizationId);
    const account = await this.accountService.getById(accountId);

    if (!account || !organization) {
      throw new NotFoundException();
    }

    await account.remove();
    await this.organizationService.deleteAccount(organization, account);

    return AccountMapper.toDeleteDto(account);
  }
}
