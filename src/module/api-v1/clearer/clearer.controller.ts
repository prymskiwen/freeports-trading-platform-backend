import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Get,
  Delete,
  UseGuards,
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
import { CreateOrganizationRequestDto } from './dto/create-organization-request.dto';
import { CreateOrganizationResponseDto } from './dto/create-organization-response.dto';
import { ClearerService } from './clearer.service';
import { ParseObjectIdPipe } from 'src/pipe/parse-objectid.pipe';
import { UpdateOrganizationRequestDto } from './dto/update-organization-request.dto';
import { GetOrganizationResponseDto } from './dto/get-organization-response.dto';
import { UpdateOrganizationResponseDto } from './dto/update-organization-response.dto';
import { ApiPaginationResponse } from 'src/pagination/api-pagination-response.decorador';
import { PaginationParams } from 'src/pagination/pagination-params.decorator';
import { PaginationRequest } from 'src/pagination/pagination-request.interface';
import { PaginationResponseDto } from 'src/pagination/pagination-response.dto';
import { CreateOrganizationAccountRequestDto } from './dto/create-organization-account-request.dto';
import { CreateOrganizationAccountResponseDto } from './dto/create-organization-account-response.dto';
import { DeleteOrganizationAccountResponseDto } from './dto/delete-organization-account-response.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UserDocument } from 'src/schema/user/user.schema';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { Permissions } from '../auth/decorator/permissions.decorator';
import { PermissionsGuard } from '../auth/guard/permissions.guard';
import { PermissionClearer } from 'src/schema/role/enum/permission.enum';
import { CreateUserResponseDto } from '../user/dto/create-user-response.dto';
import { CreateUserRequestDto } from '../user/dto/create-user-request.dto';
import { UpdateUserResponseDto } from '../user/dto/update-user-response.dto';
import { UpdateUserRequestDto } from '../user/dto/update-user-request.dto';
import { GetUserResponseDto } from '../user/dto/get-user-response.dto';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('api/v1/clearer')
@ApiTags('clearer')
@ApiBearerAuth()
export class ClearerController {
  constructor(private readonly clearerService: ClearerService) {}

  @Post('organization')
  @Permissions(PermissionClearer.OrganizationCreate)
  @ApiOperation({ summary: 'Create organization' })
  @ApiCreatedResponse({
    description: 'Successfully registered organization id',
    type: CreateOrganizationResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid form',
    type: InvalidFormExceptionDto,
  })
  createOrganization(
    @Body() createRequest: CreateOrganizationRequestDto,
    @CurrentUser() user: UserDocument,
  ): Promise<CreateOrganizationResponseDto> {
    return this.clearerService.createOrganization(createRequest, user);
  }

  @Patch('organization/:id')
  @Permissions(PermissionClearer.OrganizationUpdate)
  @ApiOperation({ summary: 'Update organization' })
  @ApiOkResponse({
    description: 'Successfully updated organization id',
    type: CreateOrganizationResponseDto,
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
  updateOrganization(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() request: UpdateOrganizationRequestDto,
  ): Promise<UpdateOrganizationResponseDto> {
    return this.clearerService.updateOrganization(id, request);
  }

  @Get('organization')
  @Permissions(PermissionClearer.OrganizationRead)
  @ApiOperation({ summary: 'Get organization list' })
  @ApiPaginationResponse(GetOrganizationResponseDto)
  getOrganizations(
    @PaginationParams() pagination: PaginationRequest,
  ): Promise<PaginationResponseDto<GetOrganizationResponseDto>> {
    return this.clearerService.getOrganizations(pagination);
  }

  @Post('organization/:id/manager')
  @Permissions(PermissionClearer.OrganizationManagerCreate)
  @ApiOperation({ summary: 'Create organization manager' })
  @ApiCreatedResponse({
    description: 'Successfully registered organization manager id',
    type: CreateUserResponseDto,
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
  createOrganizationManager(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() request: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    return this.clearerService.createOrganizationManager(id, request);
  }

  @Patch('organization/manager/:id')
  @Permissions(PermissionClearer.OrganizationManagerUpdate)
  @ApiOperation({ summary: 'Update organization manager' })
  @ApiOkResponse({
    description: 'Successfully updated organization manager id',
    type: UpdateUserResponseDto,
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
    description: 'Organization manager has not been found',
    type: ExceptionDto,
  })
  updateOrganizationManager(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() request: UpdateUserRequestDto,
  ): Promise<UpdateUserResponseDto> {
    return this.clearerService.updateOrganizationManager(id, request);
  }

  @Get('organization/:id/manager')
  @Permissions(PermissionClearer.OrganizationManagerRead)
  @ApiOperation({ summary: 'Get organization manager list' })
  @ApiPaginationResponse(GetUserResponseDto)
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Organization has not been found',
    type: ExceptionDto,
  })
  getOrganizationManagers(
    @Param('id', ParseObjectIdPipe) id: string,
    @PaginationParams() pagination: PaginationRequest,
  ): Promise<PaginationResponseDto<GetUserResponseDto>> {
    return this.clearerService.getOrganizationManagers(id, pagination);
  }

  @Post('organization/:id/account')
  @Permissions(PermissionClearer.OrganizationAccountCreate)
  @ApiOperation({ summary: 'Create organization account' })
  @ApiCreatedResponse({
    description: 'Successfully registered organization account id',
    type: CreateOrganizationAccountResponseDto,
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
  createAccount(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() request: CreateOrganizationAccountRequestDto,
    @CurrentUser() user: UserDocument,
  ): Promise<CreateOrganizationAccountResponseDto> {
    return this.clearerService.createAccount(id, request, user);
  }

  @Delete('organization/:organizationId/account/:accountId')
  @Permissions(PermissionClearer.OrganizationAccountDelete)
  @ApiOperation({ summary: 'Delete organization account' })
  @ApiOkResponse({
    description: 'Successfully deleted organization account id',
    type: DeleteOrganizationAccountResponseDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Organization or account has not been found',
    type: ExceptionDto,
  })
  deleteAccount(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('accountId', ParseObjectIdPipe) accountId: string,
  ): Promise<DeleteOrganizationAccountResponseDto> {
    return this.clearerService.deleteAccount(organizationId, accountId);
  }
}
