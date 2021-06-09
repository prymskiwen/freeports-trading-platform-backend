import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Get,
  UseGuards,
  NotFoundException,
  ForbiddenException,
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

  @Post('clearer/manager')
  @Permissions(PermissionClearer.coworkerCreate)
  @ApiTags('clearer')
  @ApiOperation({ summary: 'Create clearer manager' })
  @ApiCreatedResponse({
    description: 'Successfully registered clearer manager id',
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
  async createClearerManager(
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

  @Patch('clearer/manager/:managerId')
  @Permissions(PermissionClearer.coworkerUpdate)
  @ApiTags('clearer')
  @ApiOperation({ summary: 'Update clearer manager' })
  @ApiOkResponse({
    description: 'Successfully updated clearer manager id',
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
    description: 'Clearer manager has not been found',
    type: ExceptionDto,
  })
  async updateClearerManager(
    @Param('managerId', ParseObjectIdPipe) managerId: string,
    @Body() request: UpdateUserRequestDto,
  ): Promise<UpdateUserResponseDto> {
    const manager = await this.userService.getById(managerId);

    if (!manager) {
      throw new NotFoundException();
    }

    // TODO: if possible combine with retrieve step to get managers of clearer only
    if (!(await this.userService.ensureClearer(manager))) {
      throw new ForbiddenException();
    }

    await this.userService.update(manager, request);

    return UserMapper.toUpdateDto(manager);
  }

  @Get('clearer/manager')
  @Permissions(PermissionClearer.coworkerRead)
  @ApiTags('clearer')
  @ApiOperation({ summary: 'Get clearer manager list' })
  @ApiPaginationResponse(GetUserResponseDto)
  async getClearerManagers(
    @PaginationParams() pagination: PaginationRequest,
  ): Promise<PaginationResponseDto<GetUserResponseDto>> {
    const [
      { paginatedResult, totalResult },
    ] = await this.userService.getClearerManagersPaginated(pagination);

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
  @Permissions(
    PermissionClearer.organizationManagerCreate,
    PermissionOrganization.coworkerCreate,
  )
  @ApiTags('clearer', 'organization')
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

    const roleDefault = await this.roleService.getRoleOrganizationDefault(
      organization,
    );
    const user = await this.userService.create(request, false);

    user.roles.push({
      role: roleDefault,
      assignedAt: new Date(),
      assignedBy: userCurrent,
    });

    const [
      { totalResult },
    ] = await this.userService.getOrganizationManagersPaginated(organization, {
      skip: 0,
      limit: 1,
      order: {},
      params: {},
    });

    // set as admin if first manager of the organization
    if (!(totalResult[0]?.total || 0)) {
      const roleAdmin = await this.roleService.getRoleOrganizationAdmin(
        organization,
      );

      user.roles.push({
        role: roleAdmin,
        assignedAt: new Date(),
        assignedBy: userCurrent,
      });
    }

    await user.save();

    return UserMapper.toCreateDto(user);
  }

  @Patch(':organizationId/manager/:managerId')
  @Permissions(
    PermissionClearer.organizationManagerUpdate,
    PermissionOrganization.coworkerUpdate,
  )
  @ApiTags('clearer', 'organization')
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
  async updateOrganizationManager(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('managerId', ParseObjectIdPipe) managerId: string,
    @Body() request: UpdateUserRequestDto,
  ): Promise<UpdateUserResponseDto> {
    const organization = await this.organizationService.getById(organizationId);

    if (!organization) {
      throw new NotFoundException();
    }

    const manager = await this.userService.getById(managerId);

    if (!manager) {
      throw new NotFoundException();
    }

    // TODO: if possible combine with retrieve step to get managers of organizationId only
    if (!(await this.userService.ensureOrganization(manager, organization))) {
      throw new ForbiddenException();
    }

    await this.userService.update(manager, request);

    return UserMapper.toUpdateDto(manager);
  }

  @Get(':organizationId/manager')
  @Permissions(
    PermissionClearer.organizationManagerRead,
    PermissionOrganization.coworkerRead,
  )
  @ApiTags('clearer', 'organization')
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
  async getOrganizationManagers(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @PaginationParams() pagination: PaginationRequest,
  ): Promise<PaginationResponseDto<GetUserResponseDto>> {
    const organization = await this.organizationService.getById(organizationId);

    if (!organization) {
      throw new NotFoundException();
    }

    const [
      { paginatedResult, totalResult },
    ] = await this.userService.getOrganizationManagersPaginated(
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

  @Post(':organizationId/desk/:deskId/manager')
  @Permissions(
    PermissionOrganization.deskManagerCreate,
    PermissionDesk.coworkerCreate,
  )
  @ApiTags('organization', 'desk')
  @ApiOperation({ summary: 'Create desk manager' })
  @ApiCreatedResponse({
    description: 'Successfully registered desk manager id',
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
  async createDeskManager(
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

    const [{ totalResult }] = await this.userService.getDeskManagersPaginated(
      desk,
      {
        skip: 0,
        limit: 1,
        order: {},
        params: {},
      },
    );

    // set as admin if first manager of the desk
    if (!(totalResult[0]?.total || 0)) {
      const roleAdmin = await this.roleService.getRoleDeskAdmin(desk);

      user.roles.push({
        role: roleAdmin,
        assignedAt: new Date(),
        assignedBy: userCurrent,
      });
    }

    await user.save();

    return UserMapper.toCreateDto(user);
  }

  @Patch(':organizationId/desk/:deskId/manager/:managerId')
  @Permissions(
    PermissionOrganization.deskManagerUpdate,
    PermissionDesk.coworkerUpdate,
  )
  @ApiTags('organization', 'desk')
  @ApiOperation({ summary: 'Update desk manager' })
  @ApiOkResponse({
    description: 'Successfully updated desk manager id',
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
    description: 'Desk manager has not been found',
    type: ExceptionDto,
  })
  async updateDeskManager(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Param('managerId', ParseObjectIdPipe) managerId: string,
    @Body() request: UpdateUserRequestDto,
  ): Promise<UpdateUserResponseDto> {
    const organization = await this.organizationService.getById(organizationId);
    const desk = await this.deskService.getById(deskId);

    if (!organization || !desk || desk.organization !== organization) {
      throw new NotFoundException();
    }

    const manager = await this.userService.getById(managerId);

    if (!manager) {
      throw new NotFoundException();
    }

    // TODO: if possible combine with retrieve step to get managers of deskId only
    if (!(await this.userService.ensureDesk(manager, desk))) {
      throw new ForbiddenException();
    }

    await this.userService.update(manager, request);

    return UserMapper.toUpdateDto(manager);
  }

  @Get(':organizationId/desk/:deskId/manager')
  @Permissions(
    PermissionOrganization.deskManagerRead,
    PermissionDesk.coworkerRead,
  )
  @ApiTags('organization', 'desk')
  @ApiOperation({ summary: 'Get desk manager list' })
  @ApiPaginationResponse(GetUserResponseDto)
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Desk has not been found',
    type: ExceptionDto,
  })
  async getDeskManagers(
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
    ] = await this.userService.getDeskManagersPaginated(desk, pagination);

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
