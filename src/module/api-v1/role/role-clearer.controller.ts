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
  BadRequestException,
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
import { CreateRoleResponseDto } from './dto/create-role-response.dto';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { UserDocument } from 'src/schema/user/user.schema';
import { PermissionsGuard } from '../auth/guard/permissions.guard';
import { RoleService } from './role.service';
import { RoleMapper } from './mapper/role.mapper';
import { CreateRoleClearerRequestDto } from './dto/clearer/create-role-clearer-request.dto';
import JwtTwoFactorGuard from '../auth/guard/jwt-two-factor.guard';
import { UpdateRoleClearerRequestDto } from './dto/clearer/update-role-clearer-request.dto';
import { UpdateRoleResponseDto } from './dto/update-role-response.dto';
import { GetRoleClearerResponseDto } from './dto/clearer/get-role-clearer-response.dto';
import { PermissionClearer } from 'src/schema/role/permission.helper';
import { DeleteRoleResponseDto } from './dto/delete-role-response.dto';
import { UserService } from '../user/user.service';
import { ApiPaginationResponse } from 'src/pagination/api-pagination-response.decorador';
import { GetUserResponseDto } from '../user/dto/get-user-response.dto';
import { PaginationRequest } from 'src/pagination/pagination-request.interface';
import { PaginationParams } from 'src/pagination/pagination-params.decorator';
import { PaginationResponseDto } from 'src/pagination/pagination-response.dto';
import { UserMapper } from '../user/mapper/user.mapper';
import { PaginationHelper } from 'src/pagination/pagination.helper';

@UseGuards(JwtTwoFactorGuard, PermissionsGuard)
@Controller('api/v1/role')
@ApiTags('role', 'clearer')
@ApiBearerAuth()
export class RoleClearerController {
  constructor(
    private readonly roleService: RoleService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @Permissions(PermissionClearer.roleRead)
  @ApiOperation({ summary: 'Get clearer role list' })
  @ApiOkResponse({ type: [GetRoleClearerResponseDto] })
  async getRoleClearerList(): Promise<GetRoleClearerResponseDto[]> {
    const roles = await this.roleService.getRoleClearerList();

    return roles.map((role) => RoleMapper.toGetRoleClearerDto(role));
  }

  @Get(':roleId')
  @Permissions(PermissionClearer.roleRead)
  @ApiOperation({ summary: 'Get clearer role user list' })
  @ApiPaginationResponse(GetUserResponseDto)
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Clearer role has not been found',
    type: ExceptionDto,
  })
  async getRoleClearerUserList(
    @Param('roleId', ParseObjectIdPipe) roleId: string,
    @PaginationParams() pagination: PaginationRequest,
  ): Promise<PaginationResponseDto<GetUserResponseDto>> {
    const role = await this.roleService.getRoleClearerById(roleId);

    if (!role) {
      throw new NotFoundException();
    }

    const [
      { paginatedResult, totalResult },
    ] = await this.userService.getByRolePaginated(role, pagination);

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
  @Permissions(PermissionClearer.roleCreate)
  @ApiOperation({ summary: 'Create clearer role' })
  @ApiCreatedResponse({
    description: 'Successfully created clearer role id',
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
  async createRoleClearer(
    @Body() request: CreateRoleClearerRequestDto,
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<CreateRoleResponseDto> {
    const role = await this.roleService.createRoleClearer(request, userCurrent);

    return RoleMapper.toCreateDto(role);
  }

  @Patch(':roleId')
  @Permissions(PermissionClearer.roleUpdate)
  @ApiOperation({ summary: 'Update clearer role' })
  @ApiOkResponse({
    description: 'Successfully updated clearer role id',
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
    description: 'Clearer role has not been found',
    type: ExceptionDto,
  })
  async updateRoleClearer(
    @Param('roleId', ParseObjectIdPipe) roleId: string,
    @Body() request: UpdateRoleClearerRequestDto,
  ): Promise<UpdateRoleResponseDto> {
    const role = await this.roleService.getRoleClearerById(roleId);

    if (!role) {
      throw new NotFoundException();
    }

    await this.roleService.updateRoleClearer(role, request);

    return RoleMapper.toUpdateDto(role);
  }

  @Delete(':roleId')
  @Permissions(PermissionClearer.roleDelete)
  @ApiOperation({ summary: 'Delete clearer role' })
  @ApiOkResponse({
    description: 'Successfully deleted clearer role id',
    type: DeleteRoleResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Impossible delete clearer role with assigned users',
    type: InvalidFormExceptionDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Clearer role has not been found',
    type: ExceptionDto,
  })
  async deleteRoleClearer(
    @Param('roleId', ParseObjectIdPipe) roleId: string,
  ): Promise<DeleteRoleResponseDto> {
    const role = await this.roleService.getRoleClearerById(roleId);

    if (!role) {
      throw new NotFoundException();
    }

    if (role.users?.length) {
      throw new BadRequestException(
        'Impossible delete clearer role with assigned users',
      );
    }

    await role.remove();
    await this.userService.deleteRole(role);

    return RoleMapper.toUpdateDto(role);
  }
}
