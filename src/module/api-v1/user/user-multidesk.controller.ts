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
import { CreateUserResponseDto } from './dto/create-user-response.dto';
import { UserService } from './user.service';
import { OrganizationService } from '../organization/organization.service';
import { RoleService } from '../role/role.service';
import { UserMapper } from './mapper/user.mapper';
import { DeskService } from '../desk/desk.service';
import JwtTwoFactorGuard from '../auth/guard/jwt-two-factor.guard';
import { PermissionOrganization } from 'src/schema/role/permission.helper';
import { AssignRoleMultideskRequestDto } from './dto/assign-role-multidesk-request.dto';

@UseGuards(JwtTwoFactorGuard, PermissionsGuard)
@Controller('api/v1')
@ApiTags('user')
@ApiBearerAuth()
export class UserMultideskController {
  constructor(
    private readonly deskService: DeskService,
    private readonly organizationService: OrganizationService,
    private readonly roleService: RoleService,
    private readonly userService: UserService,
  ) {}

  @Post('organization/:organizationId/user/:userId/role-multi')
  @Permissions(PermissionOrganization.roleAssign)
  @ApiTags('organization', 'role')
  @ApiOperation({ summary: 'Assign multi-desk roles to user' })
  @ApiCreatedResponse({
    description: 'Successfully updated user id',
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
    description: 'User has not been found',
    type: ExceptionDto,
  })
  async assignOrganizationUserRoleMultidesk(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('userId', ParseObjectIdPipe) userId: string,
    @Body() request: AssignRoleMultideskRequestDto,
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<CreateUserResponseDto> {
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

    await Promise.all(
      request.roles.map(async (roleId) => {
        const effectiveDesks = [];
        const role = await this.roleService.getRoleMultideskById(
          roleId,
          organization,
        );

        if (!role) {
          return;
        }

        const hasRole = user.roles.some(
          (userRole) => userRole.role.toString() === role.id,
        );

        if (hasRole) {
          return;
        }

        await Promise.all(
          request.desks.map(async (deskId) => {
            const desk = await this.deskService.getById(deskId);

            if (!desk) {
              return;
            }

            if (desk.organization !== organization) {
              return;
            }

            effectiveDesks.push(desk);
          }),
        );

        user.roles.push({
          effectiveDesks: [...effectiveDesks],
          role: role,
          assignedAt: new Date(),
          assignedBy: userCurrent,
        });
      }),
    );

    await user.save();

    return UserMapper.toCreateDto(user);
  }
}
