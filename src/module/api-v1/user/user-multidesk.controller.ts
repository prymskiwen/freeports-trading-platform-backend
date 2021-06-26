import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ExceptionDto } from 'src/exeption/dto/exception.dto';
import { InvalidFormExceptionDto } from 'src/exeption/dto/invalid-form-exception.dto';
import { ParseObjectIdPipe } from 'src/pipe/parse-objectid.pipe';
import { UserDocument } from 'src/schema/user/user.schema';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { Permissions } from '../auth/decorator/permissions.decorator';
import { PermissionsGuard } from '../auth/guard/permissions.guard';
import { UserService } from './user.service';
import { OrganizationService } from '../organization/organization.service';
import { RoleService } from '../role/role.service';
import { UserMapper } from './mapper/user.mapper';
import JwtTwoFactorGuard from '../auth/guard/jwt-two-factor.guard';
import { PermissionOrganization } from 'src/schema/role/permission.helper';
import { AssignRoleMultideskRequestDto } from './dto/assign-role-multidesk-request.dto';
import { UpdateUserResponseDto } from './dto/update-user-response.dto';
import { UnassignRoleMultideskRequestDto } from './dto/unassign-role-multidesk-request.dto';

@UseGuards(JwtTwoFactorGuard, PermissionsGuard)
@Controller('api/v1/organization/:organizationId/user')
@ApiTags('user', 'organization', 'multidesk')
@ApiBearerAuth()
export class UserMultideskController {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly roleService: RoleService,
    private readonly userService: UserService,
  ) {}

  @Post(':userId/role-multidesk/assign')
  @Permissions(PermissionOrganization.roleAssign)
  @ApiTags('role')
  @ApiOperation({ summary: 'Assign multi-desk roles to user' })
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
  async assignRoleMultidesk(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('userId', ParseObjectIdPipe) userId: string,
    @Body() request: AssignRoleMultideskRequestDto,
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

    await this.roleService.assignRoleMultidesk(
      request.roles,
      request.desks,
      organization,
      user,
      userCurrent,
    );

    return UserMapper.toUpdateDto(user);
  }

  @Post(':userId/role-multidesk/unassign')
  @Permissions(PermissionOrganization.roleAssign)
  @ApiTags('role')
  @ApiOperation({ summary: 'Unassign multi-desk roles from user' })
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
  async unassignRoleMultidesk(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('userId', ParseObjectIdPipe) userId: string,
    @Body() request: UnassignRoleMultideskRequestDto,
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

    await this.roleService.unassignRoleMultidesk(
      request.roles,
      organization,
      user,
    );

    return UserMapper.toUpdateDto(user);
  }
}
