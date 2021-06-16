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
import { OrganizationService } from '../organization/organization.service';
import { RoleService } from '../role/role.service';
import { UserMapper } from './mapper/user.mapper';
import { PaginationHelper } from 'src/pagination/pagination.helper';
import { DeskService } from '../desk/desk.service';
import JwtTwoFactorGuard from '../auth/guard/jwt-two-factor.guard';
import {
  PermissionClearer,
  PermissionDesk,
  PermissionOrganization,
} from 'src/schema/role/permission.helper';
import { AssignRoleClearerDto } from './dto/assign-role-clearer.dto';
import { AssignRoleOrganizationDto } from './dto/assign-role-organization.dto';
import { AssignRoleDeskMultiDto } from './dto/assign-role-desk-multi.dto';

@UseGuards(JwtTwoFactorGuard, PermissionsGuard)
@Controller('api/v1')
@ApiTags('user')
@ApiBearerAuth()
export class UserController {
  constructor(
    private readonly deskService: DeskService,
    private readonly organizationService: OrganizationService,
    private readonly roleService: RoleService,
    private readonly userService: UserService,
  ) {}

  @Post('user')
  @Permissions(PermissionClearer.coworkerCreate)
  @ApiTags('clearer')
  @ApiOperation({ summary: 'Create clearer user' })
  @ApiCreatedResponse({
    description: 'Successfully registered clearer user id',
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
  async createClearerUser(
    @Body() request: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    const user = await this.userService.create(request, false);

    await user.save();

    return UserMapper.toCreateDto(user);
  }

  @Patch('user/:userId')
  @Permissions(PermissionClearer.coworkerUpdate)
  @ApiTags('clearer')
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
  @ApiTags('clearer')
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
  @ApiTags('clearer')
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

  @Post('user/:userId/role')
  @Permissions(PermissionClearer.roleAssign)
  @ApiTags('clearer', 'role')
  @ApiOperation({ summary: 'Assign clearer role to user' })
  @ApiCreatedResponse({
    description: 'Successfully updated user id',
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
    description: 'User has not been found',
    type: ExceptionDto,
  })
  async assignRoleClearer(
    @Param('userId', ParseObjectIdPipe) userId: string,
    @Body() request: AssignRoleClearerDto,
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<CreateUserResponseDto> {
    const user = await this.userService.getClearerUserById(userId);

    if (!user) {
      throw new NotFoundException();
    }

    await Promise.all(
      request.roles.map(async (roleId) => {
        const role = await this.roleService.getRoleClearerById(roleId);

        if (!role) {
          return;
        }

        const hasRole = user.roles.some(
          (userRole) => userRole.role.toString() === role.id,
        );

        if (hasRole) {
          return;
        }

        user.roles.push({
          role: role,
          assignedAt: new Date(),
          assignedBy: userCurrent,
        });
      }),
    );

    await user.save();

    return UserMapper.toCreateDto(user);
  }

  @Get('user')
  @Permissions(PermissionClearer.coworkerRead)
  @ApiTags('clearer')
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

  @Post('organization/:organizationId/manager')
  @Permissions(PermissionClearer.organizationManagerCreate)
  @ApiTags('clearer')
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

    await user.save();

    return UserMapper.toCreateDto(user);
  }

  @Post('organization/:organizationId/user')
  @Permissions(PermissionOrganization.coworkerCreate)
  @ApiTags('organization')
  @ApiOperation({ summary: 'Create organization user' })
  @ApiCreatedResponse({
    description: 'Successfully registered organization user id',
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
  async createOrganizationUser(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Body() request: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    const organization = await this.organizationService.getById(organizationId);

    if (!organization) {
      throw new NotFoundException();
    }

    const user = await this.userService.create(request, false);

    user.organization = organization;

    await user.save();

    return UserMapper.toCreateDto(user);
  }

  @Patch('organization/:organizationId/user/:userId')
  @Permissions(PermissionOrganization.coworkerUpdate)
  @ApiTags('organization')
  @ApiOperation({ summary: 'Update organization user' })
  @ApiOkResponse({
    description: 'Successfully updated organization user id',
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
    description: 'Organization user has not been found',
    type: ExceptionDto,
  })
  async updateOrganizationUser(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('userId', ParseObjectIdPipe) userId: string,
    @Body() request: UpdateUserRequestDto,
  ): Promise<UpdateUserResponseDto> {
    const organization = await this.organizationService.getById(organizationId);

    if (!organization) {
      throw new NotFoundException();
    }

    const user = await this.userService.getOrganizationUserById(
      userId,
      organization,
    );

    if (!user) {
      throw new NotFoundException();
    }

    await this.userService.update(user, request);

    return UserMapper.toUpdateDto(user);
  }

  @Put('organization/:organizationId/user/:userId/suspend')
  @Permissions(PermissionOrganization.coworkerState)
  @ApiTags('organization')
  @ApiOperation({ summary: 'Suspend organization user' })
  @ApiOkResponse({
    description: 'Successfully suspended organization user id',
    type: UpdateUserResponseDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Organization user has not been found',
    type: ExceptionDto,
  })
  async suspendOrganizationUser(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('userId', ParseObjectIdPipe) userId: string,
  ): Promise<UpdateUserResponseDto> {
    const organization = await this.organizationService.getById(organizationId);

    if (!organization) {
      throw new NotFoundException();
    }

    const user = await this.userService.getOrganizationUserById(
      userId,
      organization,
    );

    if (!user) {
      throw new NotFoundException();
    }

    user.suspended = true;
    await user.save();

    return UserMapper.toUpdateDto(user);
  }

  @Put('organization/:organizationId/user/:userId/resume')
  @Permissions(PermissionOrganization.coworkerState)
  @ApiTags('organization')
  @ApiOperation({ summary: 'Resume organization user' })
  @ApiOkResponse({
    description: 'Successfully resumed organization user id',
    type: UpdateUserResponseDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Organization user has not been found',
    type: ExceptionDto,
  })
  async resumeOrganizationUser(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('userId', ParseObjectIdPipe) userId: string,
  ): Promise<UpdateUserResponseDto> {
    const organization = await this.organizationService.getById(organizationId);

    if (!organization) {
      throw new NotFoundException();
    }

    const user = await this.userService.getOrganizationUserById(
      userId,
      organization,
    );

    if (!user) {
      throw new NotFoundException();
    }

    user.suspended = false;
    await user.save();

    return UserMapper.toUpdateDto(user);
  }

  @Post('organization/:organizationId/user/:userId/role')
  @Permissions(PermissionOrganization.roleAssign)
  @ApiTags('organization', 'role')
  @ApiOperation({ summary: 'Assign organization role to user' })
  @ApiCreatedResponse({
    description: 'Successfully updated user id',
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
    description: 'User has not been found',
    type: ExceptionDto,
  })
  async assignOrganizationUserRoleOrganization(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('userId', ParseObjectIdPipe) userId: string,
    @Body() request: AssignRoleOrganizationDto,
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<CreateUserResponseDto> {
    const organization = await this.organizationService.getById(organizationId);

    if (!organization) {
      throw new NotFoundException();
    }

    const user = await this.userService.getOrganizationUserById(
      userId,
      organization,
    );

    if (!user) {
      throw new NotFoundException();
    }

    await Promise.all(
      request.roles.map(async (roleId) => {
        const role = await this.roleService.getRoleOrganizationById(
          roleId,
          organization,
        );

        if (!role) {
          return;
        }

        const hasRole = user.roles.some(
          (userRole) => userRole.role.toString() === role.id,
        );

        if (hasRole) {
          return;
        }

        user.roles.push({
          role: role,
          assignedAt: new Date(),
          assignedBy: userCurrent,
        });
      }),
    );

    await user.save();

    return UserMapper.toCreateDto(user);
  }

  @Post('organization/:organizationId/user/:userId/role-multi')
  @Permissions(PermissionOrganization.roleAssign)
  @ApiTags('organization', 'role')
  @ApiOperation({ summary: 'Assign multi-desk role to user' })
  @ApiCreatedResponse({
    description: 'Successfully updated user id',
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
    description: 'User has not been found',
    type: ExceptionDto,
  })
  async assignOrganizationUserRoleDeskMulti(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('userId', ParseObjectIdPipe) userId: string,
    @Body() request: AssignRoleDeskMultiDto,
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<CreateUserResponseDto> {
    const organization = await this.organizationService.getById(organizationId);

    if (!organization) {
      throw new NotFoundException();
    }

    const user = await this.userService.getOrganizationUserById(
      userId,
      organization,
    );

    if (!user) {
      throw new NotFoundException();
    }

    await Promise.all(
      request.roles.map(async (roleId) => {
        const effectiveDesks = [];
        const role = await this.roleService.getRoleDeskMultiById(
          roleId,
          organization,
        );

        if (!role) {
          return;
        }

        const hasRole = user.roles.some(
          (userRole) => userRole.role.toString() === role.id,
        );

        if (hasRole) {
          return;
        }

        await Promise.all(
          request.desks.map(async (deskId) => {
            const desk = await this.deskService.getById(deskId);

            if (!desk) {
              return;
            }

            if (desk.organization !== organization) {
              return;
            }

            effectiveDesks.push(desk);
          }),
        );

        user.roles.push({
          effectiveDesks: [...effectiveDesks],
          role: role,
          assignedAt: new Date(),
          assignedBy: userCurrent,
        });
      }),
    );

    await user.save();

    return UserMapper.toCreateDto(user);
  }

  @Get('organization/:organizationId/user')
  @Permissions(
    PermissionOrganization.coworkerRead,
    PermissionOrganization.organizationRead,
  )
  @ApiTags('organization')
  @ApiOperation({ summary: 'Get organization user list' })
  @ApiPaginationResponse(GetUserResponseDto)
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Organization has not been found',
    type: ExceptionDto,
  })
  async getOrganizationUserPaginated(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @PaginationParams() pagination: PaginationRequest,
  ): Promise<PaginationResponseDto<GetUserResponseDto>> {
    const organization = await this.organizationService.getById(organizationId);

    if (!organization) {
      throw new NotFoundException();
    }

    const [
      { paginatedResult, totalResult },
    ] = await this.userService.getOrganizationUserPaginated(
      organization,
      pagination,
    );

    const userDtos = paginatedResult.map((user: UserDocument) =>
      UserMapper.toGetDto(user),
    );

    return PaginationHelper.of(
      pagination,
      totalResult[0]?.total || 0,
      userDtos,
    );
  }

  @Get('organization/:organizationId/desk/:deskId/user')
  @Permissions(PermissionOrganization.deskUserRead, PermissionDesk.coworkerRead)
  @ApiTags('organization', 'desk')
  @ApiOperation({ summary: 'Get desk user list' })
  @ApiPaginationResponse(GetUserResponseDto)
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Desk has not been found',
    type: ExceptionDto,
  })
  async getDeskUserPaginated(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @PaginationParams() pagination: PaginationRequest,
  ): Promise<PaginationResponseDto<GetUserResponseDto>> {
    const organization = await this.organizationService.getById(organizationId);
    const desk = await this.deskService.getById(deskId);

    if (!organization || !desk || desk.organization !== organization) {
      throw new NotFoundException();
    }

    const [
      { paginatedResult, totalResult },
    ] = await this.userService.getDeskUserPaginated(desk, pagination);

    const userDtos = paginatedResult.map((user: UserDocument) =>
      UserMapper.toGetDto(user),
    );

    return PaginationHelper.of(
      pagination,
      totalResult[0]?.total || 0,
      userDtos,
    );
  }

  @Get('role/:roleId')
  @Permissions(PermissionClearer.roleRead)
  @ApiTags('clearer', 'role')
  @ApiOperation({ summary: 'Get clearer role user list' })
  @ApiPaginationResponse(GetUserResponseDto)
  @ApiNotFoundResponse({
    description: 'Clearer role has not been found',
    type: ExceptionDto,
  })
  async getRoleClearerUserList(
    @Param('roleId', ParseObjectIdPipe) roleId: string,
    @PaginationParams() pagination: PaginationRequest,
  ): Promise<PaginationResponseDto<GetUserResponseDto>> {
    const role = await this.roleService.getRoleClearerById(roleId);

    if (!role) {
      throw new NotFoundException();
    }

    const [
      { paginatedResult, totalResult },
    ] = await this.userService.getUserOfRolePaginated(role, pagination);

    const userDtos = paginatedResult.map((user: UserDocument) =>
      UserMapper.toGetDto(user),
    );

    return PaginationHelper.of(
      pagination,
      totalResult[0]?.total || 0,
      userDtos,
    );
  }

  @Get('organization/:organizationId/role/:roleId')
  @Permissions(PermissionOrganization.roleRead)
  @ApiTags('organization', 'role')
  @ApiOperation({ summary: 'Get organization role user list' })
  @ApiPaginationResponse(GetUserResponseDto)
  @ApiNotFoundResponse({
    description: 'Organization role has not been found',
    type: ExceptionDto,
  })
  async getRoleOrganizationUserList(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('roleId', ParseObjectIdPipe) roleId: string,
    @PaginationParams() pagination: PaginationRequest,
  ): Promise<PaginationResponseDto<GetUserResponseDto>> {
    const organization = await this.organizationService.getById(organizationId);

    if (!organization) {
      throw new NotFoundException();
    }

    const role = await this.roleService.getRoleOrganizationById(
      roleId,
      organization,
    );

    if (!role) {
      throw new NotFoundException();
    }

    const [
      { paginatedResult, totalResult },
    ] = await this.userService.getUserOfRolePaginated(role, pagination);

    const userDtos = paginatedResult.map((user: UserDocument) =>
      UserMapper.toGetDto(user),
    );

    return PaginationHelper.of(
      pagination,
      totalResult[0]?.total || 0,
      userDtos,
    );
  }

  @Get('organization/:organizationId/role-multi/:roleId')
  @Permissions(PermissionOrganization.roleRead)
  @ApiTags('organization', 'role')
  @ApiOperation({ summary: 'Get multi-desk role user list' })
  @ApiPaginationResponse(GetUserResponseDto)
  @ApiNotFoundResponse({
    description: 'Multi-desk role has not been found',
    type: ExceptionDto,
  })
  async getRoleDeskMultiUserList(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('roleId', ParseObjectIdPipe) roleId: string,
    @PaginationParams() pagination: PaginationRequest,
  ): Promise<PaginationResponseDto<GetUserResponseDto>> {
    const organization = await this.organizationService.getById(organizationId);

    if (!organization) {
      throw new NotFoundException();
    }

    const role = await this.roleService.getRoleDeskMultiById(
      roleId,
      organization,
    );

    if (!role) {
      throw new NotFoundException();
    }

    const [
      { paginatedResult, totalResult },
    ] = await this.userService.getUserOfRolePaginated(role, pagination);

    const userDtos = paginatedResult.map((user: UserDocument) =>
      UserMapper.toGetDto(user),
    );

    return PaginationHelper.of(
      pagination,
      totalResult[0]?.total || 0,
      userDtos,
    );
  }

  @Get('organization/:organizationId/desk/:deskId/role/:roleId')
  @Permissions(PermissionOrganization.roleRead, PermissionDesk.roleRead)
  @ApiTags('organization', 'desk', 'role')
  @ApiOperation({ summary: 'Get desk role user list' })
  @ApiPaginationResponse(GetUserResponseDto)
  @ApiNotFoundResponse({
    description: 'Desk role has not been found',
    type: ExceptionDto,
  })
  async getRoleDeskUserList(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Param('roleId', ParseObjectIdPipe) roleId: string,
    @PaginationParams() pagination: PaginationRequest,
  ): Promise<PaginationResponseDto<GetUserResponseDto>> {
    const organization = await this.organizationService.getById(organizationId);
    const desk = await this.deskService.getById(deskId);

    if (!organization || !desk || desk.organization !== organization) {
      throw new NotFoundException();
    }

    const role = await this.roleService.getRoleDeskById(roleId, desk);

    if (!role) {
      throw new NotFoundException();
    }

    const [
      { paginatedResult, totalResult },
    ] = await this.userService.getUserOfRolePaginated(role, pagination);

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
