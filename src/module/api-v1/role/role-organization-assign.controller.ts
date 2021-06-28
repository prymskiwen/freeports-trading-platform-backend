import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  NotFoundException,
  Patch,
  Delete,
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
import { Permissions } from '../auth/decorator/permissions.decorator';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { UserDocument } from 'src/schema/user/user.schema';
import { PermissionsGuard } from '../auth/guard/permissions.guard';
import { RoleService } from './role.service';
import { RoleMapper } from './mapper/role.mapper';
import { OrganizationService } from '../organization/organization.service';
import JwtTwoFactorGuard from '../auth/guard/jwt-two-factor.guard';
import { PermissionOrganization } from 'src/schema/role/permission.helper';
import { UserService } from '../user/user.service';
import { UserMapper } from '../user/mapper/user.mapper';
import { UpdateRoleResponseDto } from './dto/update-role-response.dto';
import { UpdateUserResponseDto } from '../user/dto/update-user-response.dto';
import { AssignRoleOrganizationRequestDto } from './dto/organization/assign-role-organization-request.dto';
import { UnassignRoleOrganizationRequestDto } from './dto/organization/unassign-role-organization-request.dto';

@UseGuards(JwtTwoFactorGuard, PermissionsGuard)
@Controller('api/v1/organization/:organizationId')
@ApiTags('role', 'organization', 'user')
@ApiBearerAuth()
export class RoleOrganizationAssignController {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly roleService: RoleService,
    private readonly userService: UserService,
  ) {}

  @Put('role/:roleId/:userId')
  @Permissions(PermissionOrganization.roleAssign)
  @ApiOperation({ summary: 'Assign user to organization role' })
  @ApiCreatedResponse({
    description: 'Successfully updated organization role id',
    type: UpdateRoleResponseDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'User or organization role has not been found',
    type: ExceptionDto,
  })
  async assignUserToRoleOrganization(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('roleId', ParseObjectIdPipe) roleId: string,
    @Param('userId', ParseObjectIdPipe) userId: string,
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<UpdateRoleResponseDto> {
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

    return RoleMapper.toUpdateDto(role);
  }

  @Delete('role/:roleId/:userId')
  @Permissions(PermissionOrganization.roleAssign)
  @ApiOperation({ summary: 'Unassign user from organization role' })
  @ApiOkResponse({
    description: 'Successfully updated organization role id',
    type: UpdateRoleResponseDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'User or organization role has not been found',
    type: ExceptionDto,
  })
  async unassignUserFromRoleOrganization(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('roleId', ParseObjectIdPipe) roleId: string,
    @Param('userId', ParseObjectIdPipe) userId: string,
  ): Promise<UpdateRoleResponseDto> {
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

    return RoleMapper.toUpdateDto(role);
  }

  @Post('user/:userId/role/assign')
  @Permissions(PermissionOrganization.roleAssign)
  @ApiOperation({ summary: 'Assign organization roles to user' })
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
  async assignRoleOrganizationListToUser(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('userId', ParseObjectIdPipe) userId: string,
    @Body() request: AssignRoleOrganizationRequestDto,
    @CurrentUser() userCurrent: UserDocument,
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

    await this.roleService.assignRoleOrganization(
      request.roles,
      organization,
      user,
      userCurrent,
    );

    return UserMapper.toUpdateDto(user);
  }

  @Post('user/:userId/role/unassign')
  @Permissions(PermissionOrganization.roleAssign)
  @ApiOperation({ summary: 'Unassign organization roles from user' })
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
  async unassignRoleOrganizationListFromUser(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('userId', ParseObjectIdPipe) userId: string,
    @Body() request: UnassignRoleOrganizationRequestDto,
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

    await this.roleService.unassignRoleOrganization(
      request.roles,
      organization,
      user,
    );

    return UserMapper.toUpdateDto(user);
  }

  @Patch('user/:userId/role')
  @Permissions(PermissionOrganization.roleAssign)
  @ApiOperation({ summary: 'Update organization roles of user' })
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
  async updateRoleOrganizationListOfUser(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('userId', ParseObjectIdPipe) userId: string,
    @Body() request: AssignRoleOrganizationRequestDto,
    @CurrentUser() userCurrent: UserDocument,
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

    await this.roleService.updateRoleOrganizationOfUser(
      request.roles,
      organization,
      user,
      userCurrent,
    );

    return UserMapper.toUpdateDto(user);
  }
}
