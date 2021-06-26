import {
  Controller,
  Param,
  Get,
  UseGuards,
  NotFoundException,
  Patch,
  Body,
  Put,
  Post,
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
import { ParseObjectIdPipe } from 'src/pipe/parse-objectid.pipe';
import { ApiPaginationResponse } from 'src/pagination/api-pagination-response.decorador';
import { PaginationParams } from 'src/pagination/pagination-params.decorator';
import { PaginationRequest } from 'src/pagination/pagination-request.interface';
import { PaginationResponseDto } from 'src/pagination/pagination-response.dto';
import { UserDocument } from 'src/schema/user/user.schema';
import { Permissions } from '../auth/decorator/permissions.decorator';
import { PermissionsGuard } from '../auth/guard/permissions.guard';
import { GetUserResponseDto } from '../user/dto/get-user-response.dto';
import { UserService } from './user.service';
import { OrganizationService } from '../organization/organization.service';
import { RoleService } from '../role/role.service';
import { UserMapper } from './mapper/user.mapper';
import { PaginationHelper } from 'src/pagination/pagination.helper';
import { DeskService } from '../desk/desk.service';
import JwtTwoFactorGuard from '../auth/guard/jwt-two-factor.guard';
import {
  PermissionDesk,
  PermissionOrganization,
} from 'src/schema/role/permission.helper';
import { GetUserDetailsResponseDto } from './dto/get-user-details-response.dto';
import { UpdateUserResponseDto } from './dto/update-user-response.dto';
import { InvalidFormExceptionDto } from 'src/exeption/dto/invalid-form-exception.dto';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { UniqueFieldException } from 'src/exeption/unique-field.exception';
import { AssignRoleDeskRequestDto } from './dto/assign-role-desk-request.dto';
import { CurrentUser } from '../auth/decorator/current-user.decorator';

@UseGuards(JwtTwoFactorGuard, PermissionsGuard)
@Controller('api/v1/organization/:organizationId/desk/:deskId/user')
@ApiTags('user', 'organization', 'desk')
@ApiBearerAuth()
export class UserDeskController {
  constructor(
    private readonly deskService: DeskService,
    private readonly organizationService: OrganizationService,
    private readonly roleService: RoleService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @Permissions(PermissionOrganization.deskUserRead, PermissionDesk.coworkerRead)
  @ApiOperation({ summary: 'Get desk user list' })
  @ApiPaginationResponse(GetUserResponseDto)
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Desk has not been found',
    type: ExceptionDto,
  })
  async getDeskUserPaginated(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @PaginationParams() pagination: PaginationRequest,
  ): Promise<PaginationResponseDto<GetUserResponseDto>> {
    const organization = await this.organizationService.getById(organizationId);
    const desk = await this.deskService.getById(deskId);

    if (!organization || !desk || desk.organization !== organization) {
      throw new NotFoundException();
    }

    const [
      { paginatedResult, totalResult },
    ] = await this.userService.getDeskUserPaginated(desk, pagination);

    const userDtos = paginatedResult.map((user: UserDocument) =>
      UserMapper.toGetDto(user),
    );

    return PaginationHelper.of(
      pagination,
      totalResult[0]?.total || 0,
      userDtos,
    );
  }

  @Get(':userId')
  @Permissions(PermissionOrganization.deskUserRead, PermissionDesk.coworkerRead)
  @ApiOperation({ summary: 'Get desk user' })
  @ApiOkResponse({ type: GetUserDetailsResponseDto })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Desk user has not been found',
    type: ExceptionDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ExceptionDto,
  })
  async getOrganizationUser(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Param('userId', ParseObjectIdPipe) userId: string,
  ): Promise<GetUserDetailsResponseDto> {
    const organization = await this.organizationService.getById(organizationId);
    const desk = await this.deskService.getById(deskId);

    if (!organization || !desk || desk.organization !== organization) {
      throw new NotFoundException();
    }

    const user = await this.userService.getDeskUserById(userId, desk);

    return UserMapper.toGetDetailsDto(user);
  }

  @Patch(':userId')
  @Permissions(
    PermissionOrganization.deskUserUpdate,
    PermissionDesk.coworkerUpdate,
  )
  @ApiOperation({ summary: 'Update desk user' })
  @ApiOkResponse({
    description: 'Successfully updated desk user id',
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
    description: 'Desk user has not been found',
    type: ExceptionDto,
  })
  async updateDeskUser(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Param('userId', ParseObjectIdPipe) userId: string,
    @Body() request: UpdateUserRequestDto,
  ): Promise<UpdateUserResponseDto> {
    try {
      const organization = await this.organizationService.getById(
        organizationId,
      );
      const desk = await this.deskService.getById(deskId);

      if (!organization || !desk || desk.organization !== organization) {
        throw new NotFoundException();
      }

      const user = await this.userService.getDeskUserById(userId, desk);

      if (!user) {
        throw new NotFoundException();
      }

      await this.userService.update(user, request);

      return UserMapper.toUpdateDto(user);
    } catch (ex) {
      if (ex.name === 'MongoError' && ex.code === 11000) {
        throw new UniqueFieldException(
          'email',
          ex['keyValue']['personal.email'],
        );
      }

      throw ex;
    }
  }

  @Put(':userId/suspend')
  @Permissions(
    PermissionOrganization.deskUserState,
    PermissionDesk.coworkerState,
  )
  @ApiOperation({ summary: 'Suspend desk user' })
  @ApiOkResponse({
    description: 'Successfully suspended desk user id',
    type: UpdateUserResponseDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Desk user has not been found',
    type: ExceptionDto,
  })
  async suspendDeskUser(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Param('userId', ParseObjectIdPipe) userId: string,
  ): Promise<UpdateUserResponseDto> {
    const organization = await this.organizationService.getById(organizationId);
    const desk = await this.deskService.getById(deskId);

    if (!organization || !desk || desk.organization !== organization) {
      throw new NotFoundException();
    }

    const user = await this.userService.getDeskUserById(userId, desk);

    if (!user) {
      throw new NotFoundException();
    }

    user.suspended = true;
    await user.save();

    return UserMapper.toUpdateDto(user);
  }

  @Put(':userId/resume')
  @Permissions(
    PermissionOrganization.deskUserState,
    PermissionDesk.coworkerState,
  )
  @ApiOperation({ summary: 'Resume desk user' })
  @ApiOkResponse({
    description: 'Successfully resumed desk user id',
    type: UpdateUserResponseDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Desk user has not been found',
    type: ExceptionDto,
  })
  async resumeDeskUser(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Param('userId', ParseObjectIdPipe) userId: string,
  ): Promise<UpdateUserResponseDto> {
    const organization = await this.organizationService.getById(organizationId);
    const desk = await this.deskService.getById(deskId);

    if (!organization || !desk || desk.organization !== organization) {
      throw new NotFoundException();
    }

    const user = await this.userService.getDeskUserById(userId, desk);

    if (!user) {
      throw new NotFoundException();
    }

    user.suspended = false;
    await user.save();

    return UserMapper.toUpdateDto(user);
  }

  @Post(':userId/role/assign')
  @Permissions(PermissionOrganization.roleAssign, PermissionDesk.roleAssign)
  @ApiTags('role')
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
  async assignRoleDesk(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Param('userId', ParseObjectIdPipe) userId: string,
    @Body() request: AssignRoleDeskRequestDto,
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<UpdateUserResponseDto> {
    const organization = await this.organizationService.getById(organizationId);
    const desk = await this.deskService.getById(deskId);

    if (!organization || !desk || desk.organization !== organization) {
      throw new NotFoundException();
    }

    const user = await this.userService.getDeskUserById(userId, desk);

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

  @Post(':userId/role/unassign')
  @Permissions(PermissionOrganization.roleAssign, PermissionDesk.roleAssign)
  @ApiTags('role')
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
  async unassignRoleDesk(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Param('userId', ParseObjectIdPipe) userId: string,
    @Body() request: AssignRoleDeskRequestDto,
  ): Promise<UpdateUserResponseDto> {
    const organization = await this.organizationService.getById(organizationId);
    const desk = await this.deskService.getById(deskId);

    if (!organization || !desk || desk.organization !== organization) {
      throw new NotFoundException();
    }

    const user = await this.userService.getDeskUserById(userId, desk);

    if (!user) {
      throw new NotFoundException();
    }

    await this.roleService.unassignRoleDesk(request.roles, desk, user);

    return UserMapper.toUpdateDto(user);
  }

  @Patch(':userId/role')
  @Permissions(PermissionOrganization.roleAssign, PermissionDesk.roleAssign)
  @ApiTags('role')
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
  async updateRoleDesk(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Param('userId', ParseObjectIdPipe) userId: string,
    @Body() request: AssignRoleDeskRequestDto,
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<UpdateUserResponseDto> {
    const organization = await this.organizationService.getById(organizationId);
    const desk = await this.deskService.getById(deskId);

    if (!organization || !desk || desk.organization !== organization) {
      throw new NotFoundException();
    }

    const user = await this.userService.getDeskUserById(userId, desk);

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
