import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  NotFoundException,
  Patch,
  ParseArrayPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
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
import { OrganizationService } from '../organization/organization.service';
import JwtTwoFactorGuard from '../auth/guard/jwt-two-factor.guard';
import { PermissionOrganization } from 'src/schema/role/permission.helper';
import { UserService } from '../user/user.service';
import { UserMapper } from '../user/mapper/user.mapper';
import { UpdateUserResponseDto } from '../user/dto/update-user-response.dto';
import { AssignRoleMultideskRequestDto } from './dto/multidesk/assign-role-multidesk-request.dto';
import { UnassignRoleMultideskRequestDto } from './dto/multidesk/unassign-role-multidesk-request.dto';

@UseGuards(JwtTwoFactorGuard, PermissionsGuard)
@Controller('api/v1/organization/:organizationId/multidesk')
@ApiTags('role', 'organization', 'multidesk', 'user')
@ApiBearerAuth()
export class RoleMultideskAssignController {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly roleService: RoleService,
    private readonly userService: UserService,
  ) {}

  // (Un)Assign multi-desk role directly to a user
  // makes no sense as is should contains desk list
  // @Put('role/:roleId/:userId')
  // @Delete('role/:roleId/:userId')

  @Post('user/:userId/role/assign')
  @Permissions(PermissionOrganization.roleAssign)
  @ApiOperation({ summary: 'Assign multi-desk roles to user' })
  @ApiBody({ type: [AssignRoleMultideskRequestDto] })
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
  async assignRoleMultideskListToUser(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('userId', ParseObjectIdPipe) userId: string,
    @Body(new ParseArrayPipe({ items: AssignRoleMultideskRequestDto })) // Validate array as type
    request: AssignRoleMultideskRequestDto[],
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
      request,
      organization,
      user,
      userCurrent,
    );

    return UserMapper.toUpdateDto(user);
  }

  @Post('user/:userId/role/unassign')
  @Permissions(PermissionOrganization.roleAssign)
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
  async unassignRoleMultideskListFromUser(
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

  @Patch('user/:userId/role')
  @Permissions(PermissionOrganization.roleAssign)
  @ApiOperation({ summary: 'Update multi-desk roles of user' })
  @ApiBody({ type: [AssignRoleMultideskRequestDto] })
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
    @Body(new ParseArrayPipe({ items: AssignRoleMultideskRequestDto })) // Validate array as type
    request: AssignRoleMultideskRequestDto[],
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

    await this.roleService.updateRoleMultideskOfUser(
      request,
      organization,
      user,
      userCurrent,
    );

    return UserMapper.toUpdateDto(user);
  }
}
