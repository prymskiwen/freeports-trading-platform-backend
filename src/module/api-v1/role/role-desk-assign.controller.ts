import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  NotFoundException,
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
import { DeskService } from '../desk/desk.service';
import JwtTwoFactorGuard from '../auth/guard/jwt-two-factor.guard';
import {
  PermissionDesk,
  PermissionOrganization,
} from 'src/schema/role/permission.helper';
import { UserService } from '../user/user.service';
import { UserMapper } from '../user/mapper/user.mapper';
import { UpdateRoleResponseDto } from './dto/update-role-response.dto';
import { UpdateUserResponseDto } from '../user/dto/update-user-response.dto';
import { AssignRoleDeskRequestDto } from './dto/desk/assign-role-desk-request.dto';
import { UnassignRoleDeskRequestDto } from './dto/desk/unassign-role-desk-request.dto';

@UseGuards(JwtTwoFactorGuard, PermissionsGuard)
@Controller('api/v1/organization/:organizationId/desk/:deskId')
@ApiTags('role', 'organization', 'desk', 'user')
@ApiBearerAuth()
export class RoleDeskAssignController {
  constructor(
    private readonly deskService: DeskService,
    private readonly organizationService: OrganizationService,
    private readonly roleService: RoleService,
    private readonly userService: UserService,
  ) {}

  @Put('role/:roleId/:userId')
  @Permissions(PermissionOrganization.roleAssign, PermissionDesk.roleAssign)
  @ApiOperation({ summary: 'Assign user to desk role' })
  @ApiCreatedResponse({
    description: 'Successfully updated desk role id',
    type: UpdateRoleResponseDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'User or desk role has not been found',
    type: ExceptionDto,
  })
  async assignUserToRoleDesk(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Param('roleId', ParseObjectIdPipe) roleId: string,
    @Param('userId', ParseObjectIdPipe) userId: string,
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<UpdateRoleResponseDto> {
    const organization = await this.organizationService.getById(organizationId);
    const desk = await this.deskService.getById(deskId);

    if (
      !organization ||
      !desk ||
      desk.organization.toString() !== organization.id
    ) {
      throw new NotFoundException();
    }

    const role = await this.roleService.getRoleDeskById(roleId, desk);
    const user = await this.userService.getOrganizationUserById(
      userId,
      organization,
    );

    if (!role || !user) {
      throw new NotFoundException();
    }

    await this.roleService.assignRoleDesk([role.id], desk, user, userCurrent);

    return RoleMapper.toUpdateDto(role);
  }

  @Delete('role/:roleId/:userId')
  @Permissions(PermissionOrganization.roleAssign, PermissionDesk.roleAssign)
  @ApiOperation({ summary: 'Unassign user from desk role' })
  @ApiOkResponse({
    description: 'Successfully updated desk role id',
    type: UpdateRoleResponseDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'User or desk role has not been found',
    type: ExceptionDto,
  })
  async unassignUserFromRoleDesk(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Param('roleId', ParseObjectIdPipe) roleId: string,
    @Param('userId', ParseObjectIdPipe) userId: string,
  ): Promise<UpdateRoleResponseDto> {
    const organization = await this.organizationService.getById(organizationId);
    const desk = await this.deskService.getById(deskId);

    if (
      !organization ||
      !desk ||
      desk.organization.toString() !== organization.id
    ) {
      throw new NotFoundException();
    }

    const role = await this.roleService.getRoleDeskById(roleId, desk);
    const user = await this.userService.getDeskUserById(userId, desk);

    if (!role || !user) {
      throw new NotFoundException();
    }

    await this.roleService.unassignRoleDesk([role.id], desk, user);

    return RoleMapper.toUpdateDto(role);
  }

  @Post('user/:userId/role/assign')
  @Permissions(PermissionOrganization.roleAssign, PermissionDesk.roleAssign)
  @ApiOperation({ summary: 'Assign desk roles to user' })
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
  async assignRoleDeskListToUser(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Param('userId', ParseObjectIdPipe) userId: string,
    @Body() request: AssignRoleDeskRequestDto,
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<UpdateUserResponseDto> {
    const organization = await this.organizationService.getById(organizationId);
    const desk = await this.deskService.getById(deskId);

    if (
      !organization ||
      !desk ||
      desk.organization.toString() !== organization.id
    ) {
      throw new NotFoundException();
    }

    const user = await this.userService.getOrganizationUserById(
      userId,
      organization,
    );

    if (!user) {
      throw new NotFoundException();
    }

    await this.roleService.assignRoleDesk(
      request.roles,
      desk,
      user,
      userCurrent,
    );

    return UserMapper.toUpdateDto(user);
  }

  @Post('user/:userId/role/unassign')
  @Permissions(PermissionOrganization.roleAssign, PermissionDesk.roleAssign)
  @ApiOperation({ summary: 'Unassign desk roles from user' })
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
  async unassignRoleDeskListFromUser(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Param('userId', ParseObjectIdPipe) userId: string,
    @Body() request: UnassignRoleDeskRequestDto,
  ): Promise<UpdateUserResponseDto> {
    const organization = await this.organizationService.getById(organizationId);
    const desk = await this.deskService.getById(deskId);

    if (
      !organization ||
      !desk ||
      desk.organization.toString() !== organization.id
    ) {
      throw new NotFoundException();
    }

    const user = await this.userService.getDeskUserById(userId, desk);

    if (!user) {
      throw new NotFoundException();
    }

    await this.roleService.unassignRoleDesk(request.roles, desk, user);

    return UserMapper.toUpdateDto(user);
  }

  @Post('user/:userId/role')
  @Permissions(PermissionOrganization.roleAssign, PermissionDesk.roleAssign)
  @ApiOperation({ summary: 'Update desk roles of user' })
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
  async updateRoleDeskListOfUser(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Param('userId', ParseObjectIdPipe) userId: string,
    @Body() request: AssignRoleDeskRequestDto,
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<UpdateUserResponseDto> {
    const organization = await this.organizationService.getById(organizationId);
    const desk = await this.deskService.getById(deskId);

    if (
      !organization ||
      !desk ||
      desk.organization.toString() !== organization.id
    ) {
      throw new NotFoundException();
    }

    const user = await this.userService.getOrganizationUserById(
      userId,
      organization,
    );

    if (!user) {
      throw new NotFoundException();
    }

    await this.roleService.updateRoleDeskOfUser(
      request.roles,
      desk,
      user,
      userCurrent,
    );

    return UserMapper.toUpdateDto(user);
  }
}
