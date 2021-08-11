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
import JwtTwoFactorGuard from '../auth/guard/jwt-two-factor.guard';
import { UpdateRoleResponseDto } from './dto/update-role-response.dto';
import { PermissionClearer } from 'src/schema/role/permission.helper';
import { UserService } from '../user/user.service';
import { UserMapper } from '../user/mapper/user.mapper';
import { UpdateUserResponseDto } from '../user/dto/update-user-response.dto';
import { AssignRoleClearerRequestDto } from './dto/clearer/assign-role-clearer-request.dto';
import { UnassignRoleClearerRequestDto } from './dto/clearer/unassign-role-clearer-request.dto';

@UseGuards(JwtTwoFactorGuard, PermissionsGuard)
@Controller('api/v1')
@ApiTags('role', 'clearer', 'user')
@ApiBearerAuth()
export class RoleClearerAssignController {
  constructor(
    private readonly roleService: RoleService,
    private readonly userService: UserService,
  ) {}

  @Put('role/:roleId/:userId')
  @Permissions(PermissionClearer.roleAssign)
  @ApiOperation({ summary: 'Assign user to clearer role' })
  @ApiCreatedResponse({
    description: 'Successfully updated clearer role id',
    type: UpdateRoleResponseDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'User or clearer role has not been found',
    type: ExceptionDto,
  })
  async assignUserToRoleClearer(
    @Param('roleId', ParseObjectIdPipe) roleId: string,
    @Param('userId', ParseObjectIdPipe) userId: string,
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<UpdateRoleResponseDto> {
    const role = await this.roleService.getRoleClearerById(roleId);
    const user = await this.userService.getClearerUserById(userId);

    if (!role || !user) {
      throw new NotFoundException();
    }

    await this.roleService.assignRoleClearer([role.id], user, userCurrent);

    return RoleMapper.toUpdateDto(role);
  }

  @Delete('role/:roleId/:userId')
  @Permissions(PermissionClearer.roleAssign)
  @ApiOperation({ summary: 'Unassign user from clearer role' })
  @ApiOkResponse({
    description: 'Successfully updated clearer role id',
    type: UpdateRoleResponseDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'User or clearer role has not been found',
    type: ExceptionDto,
  })
  async unassignUserFromRoleClearer(
    @Param('roleId', ParseObjectIdPipe) roleId: string,
    @Param('userId', ParseObjectIdPipe) userId: string,
  ): Promise<UpdateRoleResponseDto> {
    const role = await this.roleService.getRoleClearerById(roleId);
    const user = await this.userService.getClearerUserById(userId);

    if (!role || !user) {
      throw new NotFoundException();
    }

    await this.roleService.unassignRoleClearer([role.id], user);

    return RoleMapper.toUpdateDto(role);
  }

  @Post('user/:userId/role/assign')
  @Permissions(PermissionClearer.roleAssign)
  @ApiOperation({ summary: 'Assign clearer roles to user' })
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
  async assignRoleClearerListToUser(
    @Param('userId', ParseObjectIdPipe) userId: string,
    @Body() request: AssignRoleClearerRequestDto,
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
  @ApiOperation({ summary: 'Unassign clearer roles from user' })
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
  async unassignRoleClearerListFromUser(
    @Param('userId', ParseObjectIdPipe) userId: string,
    @Body() request: UnassignRoleClearerRequestDto,
  ): Promise<UpdateUserResponseDto> {
    const user = await this.userService.getClearerUserById(userId);

    if (!user) {
      throw new NotFoundException();
    }

    await this.roleService.unassignRoleClearer(request.roles, user);

    return UserMapper.toUpdateDto(user);
  }

  @Post('user/:userId/role')
  @Permissions(PermissionClearer.roleAssign)
  @ApiOperation({ summary: 'Update clearer roles of user' })
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
  async updateRoleClearerListOfUser(
    @Param('userId', ParseObjectIdPipe) userId: string,
    @Body() request: AssignRoleClearerRequestDto,
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<UpdateUserResponseDto> {
    const user = await this.userService.getClearerUserById(userId);

    if (!user) {
      throw new NotFoundException();
    }

    await this.roleService.updateRoleClearerOfUser(
      request.roles,
      user,
      userCurrent,
    );

    return UserMapper.toUpdateDto(user);
  }
}
