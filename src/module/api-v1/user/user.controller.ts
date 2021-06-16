import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Get,
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
import { AssignRoleDeskDto } from './dto/assign-role-desk.dto';
import { AssignRoleDeskMultiDto } from './dto/assign-role-desk-multi.dto';

@UseGuards(JwtTwoFactorGuard, PermissionsGuard)
@Controller('api/v1/organization')
@ApiTags('user')
@ApiBearerAuth()
export class UserController {
  constructor(
    private readonly deskService: DeskService,
    private readonly organizationService: OrganizationService,
    private readonly roleService: RoleService,
    private readonly userService: UserService,
  ) {}

  @Post('clearer/user')
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
  async createUserOfClearer(
    @Body() request: CreateUserRequestDto,
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<CreateUserResponseDto> {
    const roleDefault = await this.roleService.getRoleClearerDefault();
    const user = await this.userService.create(request, false);

    user.roles.push({
      role: roleDefault,
      assignedAt: new Date(),
      assignedBy: userCurrent,
    });

    await user.save();

    return UserMapper.toCreateDto(user);
  }

  @Patch('clearer/user/:userId')
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
  async updateUserOfClearer(
    @Param('userId', ParseObjectIdPipe) userId: string,
    @Body() request: UpdateUserRequestDto,
  ): Promise<UpdateUserResponseDto> {
    const user = await this.userService.getUserOfClearerById(userId);

    if (!user) {
      throw new NotFoundException();
    }

    await this.userService.update(user, request);

    return UserMapper.toUpdateDto(user);
  }

  @Post('clearer/user/:userId/role')
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
    const user = await this.userService.getUserOfClearerById(userId);

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

  @Get('clearer/user')
  @Permissions(PermissionClearer.coworkerRead)
  @ApiTags('clearer')
  @ApiOperation({ summary: 'Get clearer user list' })
  @ApiPaginationResponse(GetUserResponseDto)
  async getUserOfClearerPaginated(
    @PaginationParams() pagination: PaginationRequest,
  ): Promise<PaginationResponseDto<GetUserResponseDto>> {
    const [
      { paginatedResult, totalResult },
    ] = await this.userService.getUserOfClearerPaginated(pagination);

    const userDtos = paginatedResult.map((user: UserDocument) =>
      UserMapper.toGetDto(user),
    );

    return PaginationHelper.of(
      pagination,
      totalResult[0]?.total || 0,
      userDtos,
    );
  }

  @Post(':organizationId/manager')
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
  async createManagerOfOrganization(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Body() request: CreateUserRequestDto,
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<CreateUserResponseDto> {
    const organization = await this.organizationService.getById(organizationId);

    if (!organization) {
      throw new NotFoundException();
    }

    const roleDefault = await this.roleService.getRoleOrganizationDefault(
      organization,
    );
    const roleAdmin = await this.roleService.getRoleOrganizationAdmin(
      organization,
    );
    const user = await this.userService.create(request, false);

    user.roles.push(
      {
        role: roleDefault,
        assignedAt: new Date(),
        assignedBy: userCurrent,
      },
      {
        role: roleAdmin,
        assignedAt: new Date(),
        assignedBy: userCurrent,
      },
    );

    await user.save();

    return UserMapper.toCreateDto(user);
  }

  @Patch(':organizationId/manager/:managerId')
  @Permissions(PermissionClearer.organizationManagerUpdate)
  @ApiTags('clearer')
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
  async updateManagerOfOrganization(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('managerId', ParseObjectIdPipe) managerId: string,
    @Body() request: UpdateUserRequestDto,
  ): Promise<UpdateUserResponseDto> {
    const organization = await this.organizationService.getById(organizationId);

    if (!organization) {
      throw new NotFoundException();
    }

    const manager = await this.userService.getManagerOfOrganizationById(
      managerId,
      organization,
    );

    if (!manager) {
      throw new NotFoundException();
    }

    await this.userService.update(manager, request);

    return UserMapper.toUpdateDto(manager);
  }

  @Get(':organizationId/manager/:managerId')
  @Permissions(PermissionClearer.organizationManagerUpdate)
  @ApiTags('clearer')
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
  async getManagerOfOrganization(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('managerId', ParseObjectIdPipe) managerId: string,
    @Body() request: UpdateUserRequestDto,
  ): Promise<UpdateUserResponseDto> {
    const organization = await this.organizationService.getById(organizationId);

    if (!organization) {
      throw new NotFoundException();
    }

    const manager = await this.userService.getManagerOfOrganizationById(
      managerId,
      organization,
    );

    if (!manager) {
      throw new NotFoundException();
    }

    // await this.userService.update(manager, request);

    return UserMapper.toGetDto(manager);
  }

  @Get(':organizationId/manager')
  @Permissions(PermissionClearer.organizationManagerRead)
  @ApiTags('clearer')
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
  async getManagerOfOrganizationPaginated(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @PaginationParams() pagination: PaginationRequest,
  ): Promise<PaginationResponseDto<GetUserResponseDto>> {
    const organization = await this.organizationService.getById(organizationId);

    if (!organization) {
      throw new NotFoundException();
    }

    const [
      { paginatedResult, totalResult },
    ] = await this.userService.getManagerOfOrganizationPaginated(
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

  @Post(':organizationId/user')
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
  async createUserOfOrganization(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Body() request: CreateUserRequestDto,
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<CreateUserResponseDto> {
    const organization = await this.organizationService.getById(organizationId);

    if (!organization) {
      throw new NotFoundException();
    }

    const roleDefault = await this.roleService.getRoleOrganizationDefault(
      organization,
    );
    const user = await this.userService.create(request, false);

    user.roles.push({
      role: roleDefault,
      assignedAt: new Date(),
      assignedBy: userCurrent,
    });

    await user.save();

    return UserMapper.toCreateDto(user);
  }

  @Patch(':organizationId/user/:userId')
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
  async updateUserOfOrganization(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('userId', ParseObjectIdPipe) userId: string,
    @Body() request: UpdateUserRequestDto,
  ): Promise<UpdateUserResponseDto> {
    const organization = await this.organizationService.getById(organizationId);

    if (!organization) {
      throw new NotFoundException();
    }

    const user = await this.userService.getUserOfOrganizationById(
      userId,
      organization,
    );

    if (!user) {
      throw new NotFoundException();
    }

    await this.userService.update(user, request);

    return UserMapper.toUpdateDto(user);
  }

  @Post(':organizationId/user/:userId/role')
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
  async assignRoleOrganizationClearer(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('userId', ParseObjectIdPipe) userId: string,
    @Body() request: AssignRoleOrganizationDto,
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<CreateUserResponseDto> {
    const organization = await this.organizationService.getById(organizationId);

    if (!organization) {
      throw new NotFoundException();
    }

    const user = await this.userService.getUserOfOrganizationById(
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

  @Post(':organizationId/user/:userId/role-multi')
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
  async assignRoleDeskMultiClearer(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('userId', ParseObjectIdPipe) userId: string,
    @Body() request: AssignRoleDeskMultiDto,
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<CreateUserResponseDto> {
    const organization = await this.organizationService.getById(organizationId);

    if (!organization) {
      throw new NotFoundException();
    }

    const user = await this.userService.getUserOfOrganizationById(
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

  @Get(':organizationId/user')
  @Permissions(PermissionOrganization.coworkerRead)
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
  async getUserOfOrganizationPaginated(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @PaginationParams() pagination: PaginationRequest,
  ): Promise<PaginationResponseDto<GetUserResponseDto>> {
    const organization = await this.organizationService.getById(organizationId);

    if (!organization) {
      throw new NotFoundException();
    }

    const [
      { paginatedResult, totalResult },
    ] = await this.userService.getUserOfOrganizationPaginated(
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

  @Post(':organizationId/desk/:deskId/user')
  @Permissions(
    PermissionOrganization.deskUserCreate,
    PermissionDesk.coworkerCreate,
  )
  @ApiTags('organization', 'desk')
  @ApiOperation({ summary: 'Create desk user' })
  @ApiCreatedResponse({
    description: 'Successfully registered desk user id',
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
    description: 'Desk has not been found',
    type: ExceptionDto,
  })
  async createUserOfDesk(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Body() request: CreateUserRequestDto,
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<CreateUserResponseDto> {
    const organization = await this.organizationService.getById(organizationId);
    const desk = await this.deskService.getById(deskId);

    if (!organization || !desk || desk.organization !== organization) {
      throw new NotFoundException();
    }

    const roleDefault = await this.roleService.getRoleDeskDefault(desk);
    const user = await this.userService.create(request, false);

    user.roles.push({
      role: roleDefault,
      assignedAt: new Date(),
      assignedBy: userCurrent,
    });

    await user.save();

    return UserMapper.toCreateDto(user);
  }

  @Patch(':organizationId/desk/:deskId/user/:userId')
  @Permissions(
    PermissionOrganization.deskUserUpdate,
    PermissionDesk.coworkerUpdate,
  )
  @ApiTags('organization', 'desk')
  @ApiOperation({ summary: 'Update desk user' })
  @ApiOkResponse({
    description: 'Successfully updated desk user id',
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
    description: 'Desk user has not been found',
    type: ExceptionDto,
  })
  async updateUserOfDesk(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Param('userId', ParseObjectIdPipe) userId: string,
    @Body() request: UpdateUserRequestDto,
  ): Promise<UpdateUserResponseDto> {
    const organization = await this.organizationService.getById(organizationId);
    const desk = await this.deskService.getById(deskId);

    if (!organization || !desk || desk.organization !== organization) {
      throw new NotFoundException();
    }

    const user = await this.userService.getUserOfDeskById(userId, desk);

    if (!user) {
      throw new NotFoundException();
    }

    await this.userService.update(user, request);

    return UserMapper.toUpdateDto(user);
  }

  @Post(':organizationId/desk/:deskId/user/:userId/role')
  @Permissions(PermissionOrganization.roleAssign, PermissionDesk.roleAssign)
  @ApiTags('organization', 'desk', 'role')
  @ApiOperation({ summary: 'Assign desk role to user' })
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
  async assignRoleDesk(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Param('userId', ParseObjectIdPipe) userId: string,
    @Body() request: AssignRoleDeskDto,
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<CreateUserResponseDto> {
    const organization = await this.organizationService.getById(organizationId);
    const desk = await this.deskService.getById(deskId);

    if (!organization || !desk || desk.organization !== organization) {
      throw new NotFoundException();
    }

    const user = await this.userService.getUserOfDeskById(userId, desk);

    if (!user) {
      throw new NotFoundException();
    }

    await Promise.all(
      request.roles.map(async (roleId) => {
        const role = await this.roleService.getRoleDeskById(roleId, desk);

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

  @Get(':organizationId/desk/:deskId/user')
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
  async getUserOfDeskPaginated(
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
    ] = await this.userService.getUserOfDeskPaginated(desk, pagination);

    const userDtos = paginatedResult.map((user: UserDocument) =>
      UserMapper.toGetDto(user),
    );

    return PaginationHelper.of(
      pagination,
      totalResult[0]?.total || 0,
      userDtos,
    );
  }

  @Get('clearer/role/:roleId')
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

  @Get(':organizationId/role/:roleId')
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

  @Get(':organizationId/role-multi/:roleId')
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

  @Get(':organizationId/desk/:deskId/role/:roleId')
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
