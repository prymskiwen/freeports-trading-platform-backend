import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Get,
  UseGuards,
  NotFoundException,
  Put,
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
import { ParseObjectIdPipe } from 'src/pipe/parse-objectid.pipe';
import { ApiPaginationResponse } from 'src/pagination/api-pagination-response.decorador';
import { PaginationParams } from 'src/pagination/pagination-params.decorator';
import { PaginationRequest } from 'src/pagination/pagination-request.interface';
import { PaginationResponseDto } from 'src/pagination/pagination-response.dto';
import { UserDocument } from 'src/schema/user/user.schema';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { Permissions } from '../auth/decorator/permissions.decorator';
import { PermissionsGuard } from '../auth/guard/permissions.guard';
import { CreateUserResponseDto } from '../user/dto/create-user-response.dto';
import { CreateUserRequestDto } from '../user/dto/create-user-request.dto';
import { UpdateUserResponseDto } from '../user/dto/update-user-response.dto';
import { UpdateUserRequestDto } from '../user/dto/update-user-request.dto';
import { GetUserResponseDto } from '../user/dto/get-user-response.dto';
import { UserService } from './user.service';
import { RoleService } from '../role/role.service';
import { UserMapper } from './mapper/user.mapper';
import { PaginationHelper } from 'src/pagination/pagination.helper';
import JwtTwoFactorGuard from '../auth/guard/jwt-two-factor.guard';
import { PermissionClearer } from 'src/schema/role/permission.helper';
import { AssignRoleClearerDto } from './dto/assign-role-clearer.dto';
import { GetUserDetailsResponseDto } from './dto/get-user-details-response.dto';
import { OrganizationService } from '../organization/organization.service';

@UseGuards(JwtTwoFactorGuard, PermissionsGuard)
@Controller('api/v1')
@ApiTags('user', 'clearer')
@ApiBearerAuth()
export class UserClearerController {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly roleService: RoleService,
    private readonly userService: UserService,
  ) {}

  @Get('user')
  @Permissions(PermissionClearer.coworkerRead)
  @ApiOperation({ summary: 'Get clearer user list' })
  @ApiPaginationResponse(GetUserResponseDto)
  async getClearerUserPaginated(
    @PaginationParams() pagination: PaginationRequest,
  ): Promise<PaginationResponseDto<GetUserResponseDto>> {
    const [
      { paginatedResult, totalResult },
    ] = await this.userService.getClearerUserPaginated(pagination);

    const userDtos = paginatedResult.map((user: UserDocument) =>
      UserMapper.toGetDto(user),
    );

    return PaginationHelper.of(
      pagination,
      totalResult[0]?.total || 0,
      userDtos,
    );
  }

  @Get('user/:userId')
  @Permissions(PermissionClearer.coworkerRead)
  @ApiOperation({ summary: 'Get clearer user' })
  @ApiOkResponse({ type: GetUserDetailsResponseDto })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Clearer user has not been found',
    type: ExceptionDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ExceptionDto,
  })
  async getClearerUser(
    @Param('userId', ParseObjectIdPipe) userId: string,
  ): Promise<GetUserDetailsResponseDto> {
    const user = await this.userService.getClearerUserById(userId);

    await user.populate('roles.role').execPopulate();

    return UserMapper.toGetDetailsDto(user);
  }

  @Post('user')
  @Permissions(PermissionClearer.coworkerCreate)
  @ApiOperation({ summary: 'Create clearer user' })
  @ApiCreatedResponse({
    description: 'Successfully registered clearer user id',
    type: CreateUserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid form',
    type: InvalidFormExceptionDto,
  })
  async createClearerUser(
    @Body() request: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    const user = await this.userService.create(request);

    return UserMapper.toCreateDto(user);
  }

  @Patch('user/:userId')
  @Permissions(PermissionClearer.coworkerUpdate)
  @ApiOperation({ summary: 'Update clearer user' })
  @ApiOkResponse({
    description: 'Successfully updated clearer user id',
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
    description: 'Clearer user has not been found',
    type: ExceptionDto,
  })
  async updateClearerUser(
    @Param('userId', ParseObjectIdPipe) userId: string,
    @Body() request: UpdateUserRequestDto,
  ): Promise<UpdateUserResponseDto> {
    const user = await this.userService.getClearerUserById(userId);

    if (!user) {
      throw new NotFoundException();
    }

    await this.userService.update(user, request);

    return UserMapper.toUpdateDto(user);
  }

  @Put('user/:userId/suspend')
  @Permissions(PermissionClearer.coworkerState)
  @ApiOperation({ summary: 'Suspend clearer user' })
  @ApiOkResponse({
    description: 'Successfully suspended clearer user id',
    type: UpdateUserResponseDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Clearer user has not been found',
    type: ExceptionDto,
  })
  async suspendClearerUser(
    @Param('userId', ParseObjectIdPipe) userId: string,
  ): Promise<UpdateUserResponseDto> {
    const user = await this.userService.getClearerUserById(userId);

    if (!user) {
      throw new NotFoundException();
    }

    user.suspended = true;
    await user.save();

    return UserMapper.toUpdateDto(user);
  }

  @Put('user/:userId/resume')
  @Permissions(PermissionClearer.coworkerState)
  @ApiOperation({ summary: 'Resume clearer user' })
  @ApiOkResponse({
    description: 'Successfully resumed clearer user id',
    type: UpdateUserResponseDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Clearer user has not been found',
    type: ExceptionDto,
  })
  async resumeClearerUser(
    @Param('userId', ParseObjectIdPipe) userId: string,
  ): Promise<UpdateUserResponseDto> {
    const user = await this.userService.getClearerUserById(userId);

    if (!user) {
      throw new NotFoundException();
    }

    user.suspended = false;
    await user.save();

    return UserMapper.toUpdateDto(user);
  }

  @Post('user/:userId/role/assign')
  @Permissions(PermissionClearer.roleAssign)
  @ApiTags('role')
  @ApiOperation({ summary: 'Assign clearer role to user' })
  @ApiCreatedResponse({
    description: 'Successfully updated user id',
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
    description: 'User has not been found',
    type: ExceptionDto,
  })
  async assignRoleClearer(
    @Param('userId', ParseObjectIdPipe) userId: string,
    @Body() request: AssignRoleClearerDto,
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<UpdateUserResponseDto> {
    const user = await this.userService.getClearerUserById(userId);

    if (!user) {
      throw new NotFoundException();
    }

    await this.roleService.assignRoleClearer(request.roles, user, userCurrent);

    return UserMapper.toUpdateDto(user);
  }

  @Post('user/:userId/role/unassign')
  @Permissions(PermissionClearer.roleAssign)
  @ApiTags('role')
  @ApiOperation({ summary: 'Unassign clearer role from user' })
  @ApiCreatedResponse({
    description: 'Successfully updated user id',
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
    description: 'User has not been found',
    type: ExceptionDto,
  })
  async unassignRoleClearer(
    @Param('userId', ParseObjectIdPipe) userId: string,
    @Body() request: AssignRoleClearerDto,
  ): Promise<UpdateUserResponseDto> {
    const user = await this.userService.getClearerUserById(userId);

    if (!user) {
      throw new NotFoundException();
    }

    await this.roleService.unassignRoleClearer(request.roles, user);

    return UserMapper.toUpdateDto(user);
  }

  @Post('organization/:organizationId/manager')
  @Permissions(PermissionClearer.organizationManagerCreate)
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
  async createOrganizationManager(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Body() request: CreateUserRequestDto,
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<CreateUserResponseDto> {
    const organization = await this.organizationService.getById(organizationId);

    if (!organization) {
      throw new NotFoundException();
    }

    const roleManager = await this.roleService.getRoleOrganizationManager(
      organization,
    );
    const user = await this.userService.create(request, false);

    user.organization = organization;
    user.roles.push({
      role: roleManager,
      assignedAt: new Date(),
      assignedBy: userCurrent,
    });
    roleManager.users.push(user);

    await user.save();
    await roleManager.save();

    return UserMapper.toCreateDto(user);
  }

  @Get('organization/:organizationId/manager')
  @Permissions(PermissionClearer.organizationManagerRead)
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
  async getOrganizationManagerPaginated(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @PaginationParams() pagination: PaginationRequest,
  ): Promise<PaginationResponseDto<GetUserResponseDto>> {
    const organization = await this.organizationService.getById(organizationId);

    if (!organization) {
      throw new NotFoundException();
    }

    const roleManager = await this.roleService.getRoleOrganizationManager(
      organization,
    );

    if (!roleManager) {
      throw new NotFoundException();
    }

    const [
      { paginatedResult, totalResult },
    ] = await this.userService.getUserOfRolePaginated(roleManager, pagination);

    const userDtos = paginatedResult.map((user: UserDocument) =>
      UserMapper.toGetDto(user),
    );

    return PaginationHelper.of(
      pagination,
      totalResult[0]?.total || 0,
      userDtos,
    );
  }
}
