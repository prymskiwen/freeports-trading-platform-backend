import {
  Controller,
  Param,
  UseGuards,
  NotFoundException,
  Post,
  Body,
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
import { ParseObjectIdPipe } from 'src/pipe/parse-objectid.pipe';
import { Permissions } from '../auth/decorator/permissions.decorator';
import { PermissionsGuard } from '../auth/guard/permissions.guard';
import { RoleService } from './role.service';
import { OrganizationService } from '../organization/organization.service';
import JwtTwoFactorGuard from '../auth/guard/jwt-two-factor.guard';
import { PermissionOrganization } from 'src/schema/role/permission.helper';
import { UpdateUserResponseDto } from '../user/dto/update-user-response.dto';
import { InvalidFormExceptionDto } from 'src/exeption/dto/invalid-form-exception.dto';
import { AssignRoleDeskRequestDto } from './dto/desk/assign-role-desk-request.dto';
import { UserDocument } from 'src/schema/user/user.schema';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { UserService } from '../user/user.service';
import { UserMapper } from '../user/mapper/user.mapper';

@UseGuards(JwtTwoFactorGuard, PermissionsGuard)
@Controller('api/v1/organization/:organizationId/')
@ApiTags('role', 'organization', 'desk')
@ApiBearerAuth()
export class RoleDeskFromOrganizationAssignController {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly roleService: RoleService,
    private readonly userService: UserService,
  ) {}

  @Post('user/:userId/deskrole')
  @Permissions(PermissionOrganization.roleAssign)
  @ApiOperation({
    summary: 'Update desk roles of user',
    description:
      'Reset all assigned desk roles within organization. Assign desk roles from request then.',
  })
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
    @Param('userId', ParseObjectIdPipe) userId: string,
    @Body() request: AssignRoleDeskRequestDto,
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

    await this.roleService.updateFromOrganizationRoleDeskOfUser(
      request.roles,
      organization,
      user,
      userCurrent,
    );

    return UserMapper.toUpdateDto(user);
  }
}
