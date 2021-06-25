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
import { CreateRoleResponseDto } from './dto/create-role-response.dto';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { UserDocument } from 'src/schema/user/user.schema';
import { PermissionsGuard } from '../auth/guard/permissions.guard';
import { RoleService } from './role.service';
import { RoleMapper } from './mapper/role.mapper';
import { OrganizationService } from '../organization/organization.service';
import { CreateRoleDeskMultiRequestDto } from './dto/create-role-desk-multi-request.dto';
import JwtTwoFactorGuard from '../auth/guard/jwt-two-factor.guard';
import { UpdateRoleResponseDto } from './dto/update-role-response.dto';
import { UpdateRoleDeskMultiRequestDto } from './dto/update-role-desk-multi.dto';
import { GetRoleDeskMultiResponseDto } from './dto/get-role-desk-multi-response.dto';
import { PermissionOrganization } from 'src/schema/role/permission.helper';
import { DeleteRoleResponseDto } from './dto/delete-role-response.dto';
import { UserService } from '../user/user.service';
import { ApiPaginationResponse } from 'src/pagination/api-pagination-response.decorador';
import { GetUserResponseDto } from '../user/dto/get-user-response.dto';
import { PaginationParams } from 'src/pagination/pagination-params.decorator';
import { PaginationRequest } from 'src/pagination/pagination-request.interface';
import { PaginationResponseDto } from 'src/pagination/pagination-response.dto';
import { UserMapper } from '../user/mapper/user.mapper';
import { PaginationHelper } from 'src/pagination/pagination.helper';

@UseGuards(JwtTwoFactorGuard, PermissionsGuard)
@Controller('api/v1/organization/:organizationId/role-multi')
@ApiTags('role', 'organization')
@ApiBearerAuth()
export class RoleDeskMultiController {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly roleService: RoleService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @Permissions(PermissionOrganization.roleRead)
  @ApiOperation({ summary: 'Get multi-desk role list' })
  @ApiOkResponse({ type: [GetRoleDeskMultiResponseDto] })
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
  async getRoleDeskMultiList(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
  ): Promise<GetRoleDeskMultiResponseDto[]> {
    const organization = await this.organizationService.getById(organizationId);

    if (!organization) {
      throw new NotFoundException();
    }

    const roles = await this.roleService.getRoleDeskMultiList(organization);

    return roles.map((role) => {
      return {
        id: role.id,
        name: role.name,
        permissions: role.permissions,
      };
    });
  }

  @Get(':roleId')
  @Permissions(PermissionOrganization.roleRead)
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

  @Post()
  @Permissions(PermissionOrganization.roleCreate)
  @ApiOperation({ summary: 'Create multi-desk role' })
  @ApiCreatedResponse({
    description: 'Successfully created multi-desk role id',
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
  async createRoleDeskMulti(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Body() request: CreateRoleDeskMultiRequestDto,
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<CreateRoleResponseDto> {
    const organization = await this.organizationService.getById(organizationId);

    if (!organization) {
      throw new NotFoundException();
    }

    const role = await this.roleService.createRoleDeskMulti(
      organization,
      request,
      userCurrent,
    );

    return RoleMapper.toCreateDto(role);
  }

  @Patch(':roleId')
  @Permissions(PermissionOrganization.roleUpdate)
  @ApiOperation({ summary: 'Update multi-desk role' })
  @ApiOkResponse({
    description: 'Successfully updated multi-desk role id',
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
    description: 'Multi-desk role has not been found',
    type: ExceptionDto,
  })
  async updateRoleDeskMulti(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('roleId', ParseObjectIdPipe) roleId: string,
    @Body() request: UpdateRoleDeskMultiRequestDto,
  ): Promise<UpdateRoleResponseDto> {
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

    await this.roleService.updateRoleDeskMulti(role, request);

    return RoleMapper.toUpdateDto(role);
  }

  @Delete(':roleId')
  @Permissions(PermissionOrganization.roleDelete)
  @ApiOperation({ summary: 'Delete multi-desk role' })
  @ApiOkResponse({
    description: 'Successfully deleted multi-desk role id',
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
    description: 'Multi-desk role has not been found',
    type: ExceptionDto,
  })
  async deleteRoleDeskMulti(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('roleId', ParseObjectIdPipe) roleId: string,
  ): Promise<DeleteRoleResponseDto> {
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

    await role.remove();
    await this.userService.deleteRole(role);

    return RoleMapper.toUpdateDto(role);
  }
}
