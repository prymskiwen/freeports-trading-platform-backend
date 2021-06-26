import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  NotFoundException,
  Patch,
  Get,
  Delete,
  BadRequestException,
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
import { Permissions } from '../auth/decorator/permissions.decorator';
import { CreateRoleOrganizationRequestDto } from './dto/organization/create-role-organization-request.dto';
import { CreateRoleResponseDto } from './dto/create-role-response.dto';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { UserDocument } from 'src/schema/user/user.schema';
import { PermissionsGuard } from '../auth/guard/permissions.guard';
import { RoleService } from './role.service';
import { RoleMapper } from './mapper/role.mapper';
import { OrganizationService } from '../organization/organization.service';
import JwtTwoFactorGuard from '../auth/guard/jwt-two-factor.guard';
import { UpdateRoleResponseDto } from './dto/update-role-response.dto';
import { PermissionOrganization } from 'src/schema/role/permission.helper';
import { DeleteRoleResponseDto } from './dto/delete-role-response.dto';
import { UserService } from '../user/user.service';
import { GetRoleOrganizationResponseDto } from './dto/organization/get-role-organization-response.dto';
import { ApiPaginationResponse } from 'src/pagination/api-pagination-response.decorador';
import { GetUserResponseDto } from '../user/dto/get-user-response.dto';
import { PaginationParams } from 'src/pagination/pagination-params.decorator';
import { PaginationRequest } from 'src/pagination/pagination-request.interface';
import { PaginationResponseDto } from 'src/pagination/pagination-response.dto';
import { UserMapper } from '../user/mapper/user.mapper';
import { PaginationHelper } from 'src/pagination/pagination.helper';
import { UpdateRoleOrganizationRequestDto } from './dto/organization/update-role-organization-request.dto';
import { AssignUserResponseDto } from './dto/assign-user-response.dto';
import { UnassignUserResponseDto } from './dto/unassign-user-response.dto';

@UseGuards(JwtTwoFactorGuard, PermissionsGuard)
@Controller('api/v1/organization/:organizationId/role')
@ApiTags('role', 'organization')
@ApiBearerAuth()
export class RoleOrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly roleService: RoleService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @Permissions(PermissionOrganization.roleRead)
  @ApiOperation({ summary: 'Get organization role list' })
  @ApiOkResponse({ type: [GetRoleOrganizationResponseDto] })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Organization has not been found',
    type: ExceptionDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ExceptionDto,
  })
  async getRoleOrganizationList(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
  ): Promise<GetRoleOrganizationResponseDto[]> {
    const organization = await this.organizationService.getById(organizationId);

    if (!organization) {
      throw new NotFoundException();
    }

    const roles = await this.roleService.getRoleOrganizationList(organization);

    return roles.map((role) => RoleMapper.toGetRoleOrganizationDto(role));
  }

  @Get(':roleId')
  @Permissions(PermissionOrganization.roleRead)
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
    ] = await this.userService.getByRolePaginated(role, pagination);

    const userDtos = paginatedResult.map((user: UserDocument) =>
      UserMapper.toGetDto(user),
    );

    return PaginationHelper.of(
      pagination,
      totalResult[0]?.total || 0,
      userDtos,
    );
  }

  @Post()
  @Permissions(PermissionOrganization.roleCreate)
  @ApiOperation({ summary: 'Create organization role' })
  @ApiCreatedResponse({
    description: 'Successfully created organization role id',
    type: CreateRoleResponseDto,
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
  async createRoleOrganization(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Body() request: CreateRoleOrganizationRequestDto,
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<CreateRoleResponseDto> {
    const organization = await this.organizationService.getById(organizationId);

    if (!organization) {
      throw new NotFoundException();
    }

    const role = await this.roleService.createRoleOrganization(
      organization,
      request,
      userCurrent,
    );

    return RoleMapper.toCreateDto(role);
  }

  @Patch(':roleId')
  @Permissions(PermissionOrganization.roleUpdate)
  @ApiOperation({ summary: 'Update organization role' })
  @ApiOkResponse({
    description: 'Successfully updated organization role id',
    type: UpdateRoleResponseDto,
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
    description: 'Organization role has not been found',
    type: ExceptionDto,
  })
  async updateRoleOrganization(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('roleId', ParseObjectIdPipe) roleId: string,
    @Body() request: UpdateRoleOrganizationRequestDto,
  ): Promise<UpdateRoleResponseDto> {
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

    await this.roleService.updateRoleOrganization(role, request);

    return RoleMapper.toUpdateDto(role);
  }

  @Delete(':roleId')
  @Permissions(PermissionOrganization.roleDelete)
  @ApiOperation({ summary: 'Delete organization role' })
  @ApiOkResponse({
    description: 'Successfully deleted organization role id',
    type: DeleteRoleResponseDto,
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
    description: 'Organization role has not been found',
    type: ExceptionDto,
  })
  async deleteRoleOrganization(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('roleId', ParseObjectIdPipe) roleId: string,
  ): Promise<DeleteRoleResponseDto> {
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

    if (role.users?.length) {
      throw new BadRequestException(
        'Impossible delete organization role with assigned users',
      );
    }

    await role.remove();
    await this.userService.deleteRole(role);

    return RoleMapper.toUpdateDto(role);
  }

  @Put(':roleId/:userId')
  @Permissions(PermissionOrganization.roleAssign)
  @ApiOperation({ summary: 'Assign organization role to user' })
  @ApiCreatedResponse({
    description: 'Successfully assigned to user organization role id',
    type: AssignUserResponseDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'User or organization role has not been found',
    type: ExceptionDto,
  })
  async assignRoleOrganizationToUser(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('roleId', ParseObjectIdPipe) roleId: string,
    @Param('userId', ParseObjectIdPipe) userId: string,
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<AssignUserResponseDto> {
    const organization = await this.organizationService.getById(organizationId);

    if (!organization) {
      throw new NotFoundException();
    }

    const role = await this.roleService.getRoleOrganizationById(
      roleId,
      organization,
    );
    const user = await this.userService.getOrganizationUserById(
      userId,
      organization,
    );

    if (!role || !user) {
      throw new NotFoundException();
    }

    await this.roleService.assignRoleOrganization(
      [role.id],
      organization,
      user,
      userCurrent,
    );

    return RoleMapper.toAssignDto(role);
  }

  @Delete(':roleId/:userId')
  @Permissions(PermissionOrganization.roleAssign)
  @ApiOperation({ summary: 'Unassign organization role from user' })
  @ApiOkResponse({
    description: 'Successfully unassigned organization role id',
    type: UnassignUserResponseDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'User or organization role has not been found',
    type: ExceptionDto,
  })
  async unassignRoleOrganizationFromUser(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('roleId', ParseObjectIdPipe) roleId: string,
    @Param('userId', ParseObjectIdPipe) userId: string,
  ): Promise<UnassignUserResponseDto> {
    const organization = await this.organizationService.getById(organizationId);

    if (!organization) {
      throw new NotFoundException();
    }

    const role = await this.roleService.getRoleOrganizationById(
      roleId,
      organization,
    );
    const user = await this.userService.getOrganizationUserById(
      userId,
      organization,
    );

    if (!role || !user) {
      throw new NotFoundException();
    }

    await this.roleService.unassignRoleOrganization(
      [role.id],
      organization,
      user,
    );

    return RoleMapper.toUnassignDto(role);
  }
}
