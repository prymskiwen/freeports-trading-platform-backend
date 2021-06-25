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
import { CreateRoleDeskRequestDto } from './dto/create-role-desk-request.dto';
import { DeskService } from '../desk/desk.service';
import JwtTwoFactorGuard from '../auth/guard/jwt-two-factor.guard';
import { UpdateRoleResponseDto } from './dto/update-role-response.dto';
import { GetRoleDeskResponseDto } from './dto/get-role-desk-response.dto';
import { UpdateRoleDeskRequestDto } from './dto/update-role-desk.dto';
import {
  PermissionDesk,
  PermissionOrganization,
} from 'src/schema/role/permission.helper';
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
@Controller('api/v1/organization/:organizationId/desk/:deskId/role')
@ApiTags('role', 'organization', 'desk')
@ApiBearerAuth()
export class RoleDeskController {
  constructor(
    private readonly deskService: DeskService,
    private readonly organizationService: OrganizationService,
    private readonly roleService: RoleService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @Permissions(PermissionOrganization.roleRead, PermissionDesk.roleRead)
  @ApiOperation({ summary: 'Get desk role list' })
  @ApiOkResponse({ type: [GetRoleDeskResponseDto] })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Desk has not been found',
    type: ExceptionDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ExceptionDto,
  })
  async getRoleDeskList(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
  ): Promise<GetRoleDeskResponseDto[]> {
    const organization = await this.organizationService.getById(organizationId);
    const desk = await this.deskService.getById(deskId);

    if (!organization || !desk || desk.organization !== organization) {
      throw new NotFoundException();
    }

    const roles = await this.roleService.getRoleDeskList(desk);

    return roles.map((role) => {
      return {
        id: role.id,
        name: role.name,
        permissions: role.permissions,
      };
    });
  }

  @Get(':roleId')
  @Permissions(PermissionOrganization.roleRead, PermissionDesk.roleRead)
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

  @Post()
  @Permissions(PermissionOrganization.roleCreate, PermissionDesk.roleCreate)
  @ApiOperation({ summary: 'Create desk role' })
  @ApiCreatedResponse({
    description: 'Successfully created desk role id',
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
    description: 'Desk has not been found',
    type: ExceptionDto,
  })
  async createRoleDesk(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Body() request: CreateRoleDeskRequestDto,
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<CreateRoleResponseDto> {
    const organization = await this.organizationService.getById(organizationId);
    const desk = await this.deskService.getById(deskId);

    if (!organization || !desk || desk.organization !== organization) {
      throw new NotFoundException();
    }

    const role = await this.roleService.createRoleDesk(
      desk,
      request,
      userCurrent,
    );

    return RoleMapper.toCreateDto(role);
  }

  @Patch(':roleId')
  @Permissions(PermissionOrganization.roleUpdate, PermissionDesk.roleUpdate)
  @ApiOperation({ summary: 'Update desk role' })
  @ApiOkResponse({
    description: 'Successfully updated desk role id',
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
    description: 'Desk role has not been found',
    type: ExceptionDto,
  })
  async updateRoleDesk(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Param('roleId', ParseObjectIdPipe) roleId: string,
    @Body() request: UpdateRoleDeskRequestDto,
  ): Promise<UpdateRoleResponseDto> {
    const organization = await this.organizationService.getById(organizationId);
    const desk = await this.deskService.getById(deskId);

    if (!organization || !desk || desk.organization !== organization) {
      throw new NotFoundException();
    }

    const role = await this.roleService.getRoleDeskById(roleId, desk);

    if (!role) {
      throw new NotFoundException();
    }

    await this.roleService.updateRoleDesk(role, request);

    return RoleMapper.toUpdateDto(role);
  }

  @Delete(':roleId')
  @Permissions(PermissionOrganization.roleDelete)
  @ApiOperation({ summary: 'Delete desk role' })
  @ApiOkResponse({
    description: 'Successfully deleted desk role id',
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
    description: 'Desk role has not been found',
    type: ExceptionDto,
  })
  async deleteRoleDesk(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Param('roleId', ParseObjectIdPipe) roleId: string,
  ): Promise<DeleteRoleResponseDto> {
    const organization = await this.organizationService.getById(organizationId);
    const desk = await this.deskService.getById(deskId);

    if (!organization || !desk || desk.organization !== organization) {
      throw new NotFoundException();
    }

    const role = await this.roleService.getRoleDeskById(roleId, desk);

    if (!role) {
      throw new NotFoundException();
    }

    await role.remove();
    await this.userService.deleteRole(role);

    return RoleMapper.toUpdateDto(role);
  }
}
