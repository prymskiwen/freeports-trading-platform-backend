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
import { RoleService } from '../role/role.service';
import { UserMapper } from './mapper/user.mapper';
import { PaginationHelper } from 'src/pagination/pagination.helper';
import JwtTwoFactorGuard from '../auth/guard/jwt-two-factor.guard';
import { PermissionClearer } from 'src/schema/role/permission.helper';
import { GetUserDetailsResponseDto } from './dto/get-user-details-response.dto';
import { OrganizationService } from '../organization/organization.service';
import { UniqueFieldException } from 'src/exeption/unique-field.exception';

@UseGuards(JwtTwoFactorGuard, PermissionsGuard)
@Controller('api/v1/organization/:organizationId/manager')
@ApiTags('user', 'clearer')
@ApiBearerAuth()
export class UserClearerOrganizationManagerController {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly roleService: RoleService,
    private readonly userService: UserService,
  ) {}

  @Get()
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

    const [{ paginatedResult, totalResult }] =
      await this.userService.getByRolePaginated(roleManager, pagination);

    const userDtos = paginatedResult.map((user: UserDocument) =>
      UserMapper.toGetDto(user),
    );

    return PaginationHelper.of(
      pagination,
      totalResult[0]?.total || 0,
      userDtos,
    );
  }

  @Get(':managerId')
  @Permissions(PermissionClearer.organizationManagerRead)
  @ApiOperation({ summary: 'Get organization manager' })
  @ApiOkResponse({ type: GetUserDetailsResponseDto })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Organization manager has not been found',
    type: ExceptionDto,
  })
  async getOrganizationManager(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('managerId', ParseObjectIdPipe) managerId: string,
  ): Promise<GetUserDetailsResponseDto> {
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

    const manager = await this.userService.getOrganizationUserById(
      managerId,
      organization,
    );

    if (!manager) {
      throw new NotFoundException();
    }

    // ensure user is manager
    const assigned = roleManager.users.some((userId) => {
      return userId.toString() === manager.id;
    });
    if (!assigned) {
      throw new NotFoundException();
    }

    return UserMapper.toGetDetailsDto(manager);
  }

  @Post()
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
    try {
      const organization = await this.organizationService.getById(
        organizationId,
      );

      if (!organization) {
        throw new NotFoundException();
      }

      const roleManager = await this.roleService.getRoleOrganizationManager(
        organization,
      );
      const user = await this.userService.create(request, false, false);

      user.organization = organization;
      organization.users.push(user.id);

      await organization.save();

      await this.roleService.assignRoleOrganization(
        [roleManager.id],
        organization,
        user,
        userCurrent,
      );
      return UserMapper.toCreateDto(user);
    } catch (ex) {
      if (ex.name === 'MongoError' && ex.code === 11000) {
        throw new UniqueFieldException(
          'email',
          ex['keyValue']['personal.email'],
        );
      }

      throw ex;
    }
  }

  @Patch(':managerId')
  @Permissions(PermissionClearer.organizationManagerUpdate)
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
    try {
      const organization = await this.organizationService.getById(
        organizationId,
      );

      if (!organization) {
        throw new NotFoundException();
      }

      const roleManager = await this.roleService.getRoleOrganizationManager(
        organization,
      );

      if (!roleManager) {
        throw new NotFoundException();
      }

      const manager = await this.userService.getOrganizationUserById(
        managerId,
        organization,
      );

      if (!manager) {
        throw new NotFoundException();
      }

      // ensure user is manager
      const assigned = roleManager.users.some((userId) => {
        return userId.toString() === manager.id;
      });
      if (!assigned) {
        throw new NotFoundException();
      }

      await this.userService.update(manager, request);

      return UserMapper.toUpdateDto(manager);
    } catch (ex) {
      if (ex.name === 'MongoError' && ex.code === 11000) {
        throw new UniqueFieldException(
          'email',
          ex['keyValue']['personal.email'],
        );
      }

      throw ex;
    }
  }

  @Put(':managerId/suspend')
  @Permissions(PermissionClearer.organizationManagerState)
  @ApiOperation({ summary: 'Suspend organization manager' })
  @ApiOkResponse({
    description: 'Successfully suspended organization manager id',
    type: UpdateUserResponseDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Organization manager has not been found',
    type: ExceptionDto,
  })
  async suspendOrganizationManager(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('managerId', ParseObjectIdPipe) managerId: string,
  ): Promise<UpdateUserResponseDto> {
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

    const manager = await this.userService.getOrganizationUserById(
      managerId,
      organization,
    );

    if (!manager) {
      throw new NotFoundException();
    }

    // ensure user is manager
    const assigned = roleManager.users.some((userId) => {
      return userId.toString() === manager.id;
    });
    if (!assigned) {
      throw new NotFoundException();
    }

    manager.suspended = true;
    await manager.save();

    return UserMapper.toUpdateDto(manager);
  }

  @Put(':managerId/resume')
  @Permissions(PermissionClearer.organizationManagerState)
  @ApiOperation({ summary: 'Resume organization manager' })
  @ApiOkResponse({
    description: 'Successfully resumed organization manager id',
    type: UpdateUserResponseDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Organization manager has not been found',
    type: ExceptionDto,
  })
  async resumeOrganizationManager(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('managerId', ParseObjectIdPipe) managerId: string,
  ): Promise<UpdateUserResponseDto> {
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

    const manager = await this.userService.getOrganizationUserById(
      managerId,
      organization,
    );

    if (!manager) {
      throw new NotFoundException();
    }

    // ensure user is manager
    const assigned = roleManager.users.some((userId) => {
      return userId.toString() === manager.id;
    });
    if (!assigned) {
      throw new NotFoundException();
    }

    manager.suspended = false;
    await manager.save();

    return UserMapper.toUpdateDto(manager);
  }
}
