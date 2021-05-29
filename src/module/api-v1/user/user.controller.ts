import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Get,
  UseGuards,
  NotFoundException,
  ForbiddenException,
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
import { ApiPaginationResponse } from 'src/pagination/api-pagination-response.decorador';
import { PaginationParams } from 'src/pagination/pagination-params.decorator';
import { PaginationRequest } from 'src/pagination/pagination-request.interface';
import { PaginationResponseDto } from 'src/pagination/pagination-response.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UserDocument } from 'src/schema/user/user.schema';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { Permissions } from '../auth/decorator/permissions.decorator';
import { PermissionsGuard } from '../auth/guard/permissions.guard';
import {
  PermissionClearer,
  PermissionOrganization,
} from 'src/schema/role/enum/permission.enum';
import { CreateUserResponseDto } from '../user/dto/create-user-response.dto';
import { CreateUserRequestDto } from '../user/dto/create-user-request.dto';
import { UpdateUserResponseDto } from '../user/dto/update-user-response.dto';
import { UpdateUserRequestDto } from '../user/dto/update-user-request.dto';
import { GetUserResponseDto } from '../user/dto/get-user-response.dto';
import { UserService } from './user.service';
import { OrganizationService } from '../organization/organization.service';
import { RoleService } from '../role/role.service';
import { UserMapper } from './mapper/user.mapper';
import { PaginationHelper } from 'src/pagination/pagination.helper';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('api/v1/organization')
@ApiBearerAuth()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly organizationService: OrganizationService,
    private readonly roleService: RoleService,
  ) {}

  @Post(':organizationId/manager')
  @Permissions(
    PermissionClearer.OrganizationManagerCreate,
    PermissionOrganization.CoworkerCreate,
  )
  @ApiTags('clearer', 'organization')
  @ApiOperation({ summary: 'Create organization manager' })
  @ApiCreatedResponse({
    description: 'Successfully registered organization manager id',
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
    description: 'Organization has not been found',
    type: ExceptionDto,
  })
  async createOrganizationManager(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Body() request: CreateUserRequestDto,
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<CreateUserResponseDto> {
    const organization = await this.organizationService.getById(organizationId);

    if (!organization) {
      throw new NotFoundException();
    }

    const roleDefault = await this.roleService.getRoleOrganizationDefault(
      organization,
    );
    const user = await this.userService.create(request, false);

    user.organization = organization;
    user.roles.push({
      role: roleDefault,
      assignedAt: new Date(),
      assignedBy: userCurrent,
    });

    await user.save();

    return UserMapper.toCreateDto(user);
  }

  @Patch(':organizationId/manager/:managerId')
  @Permissions(
    PermissionClearer.OrganizationManagerUpdate,
    PermissionOrganization.CoworkerUpdate,
  )
  @ApiTags('clearer', 'organization')
  @ApiOperation({ summary: 'Update organization manager' })
  @ApiOkResponse({
    description: 'Successfully updated organization manager id',
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
    description: 'Organization manager has not been found',
    type: ExceptionDto,
  })
  async updateOrganizationManager(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('managerId', ParseObjectIdPipe) managerId: string,
    @Body() request: UpdateUserRequestDto,
  ): Promise<UpdateUserResponseDto> {
    const organization = await this.organizationService.getById(organizationId);

    if (!organization) {
      throw new NotFoundException();
    }

    const manager = await this.userService.getById(managerId);

    if (!manager) {
      throw new NotFoundException();
    }

    // TODO: if possible combine with retrieve step to get managers of organizationId only
    if (!(await this.userService.ensureOrganization(manager, organization))) {
      throw new ForbiddenException();
    }

    await this.userService.update(manager, request);

    return UserMapper.toUpdateDto(manager);
  }

  @Get(':organizationId/manager')
  @Permissions(
    PermissionClearer.OrganizationManagerRead,
    PermissionOrganization.CoworkerRead,
  )
  @ApiTags('clearer', 'organization')
  @ApiOperation({ summary: 'Get organization manager list' })
  @ApiPaginationResponse(GetUserResponseDto)
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Organization has not been found',
    type: ExceptionDto,
  })
  async getOrganizationManagers(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @PaginationParams() pagination: PaginationRequest,
  ): Promise<PaginationResponseDto<GetUserResponseDto>> {
    const organization = await this.organizationService.getById(organizationId);

    if (!organization) {
      throw new NotFoundException();
    }

    const [
      { paginatedResult, totalResult },
    ] = await this.userService.getOrganizationManagersPaginated(
      organization,
      pagination,
    );

    const userDtos = paginatedResult.map((user: UserDocument) =>
      UserMapper.toGetDto(user),
    );

    return PaginationHelper.of(
      pagination,
      totalResult[0]?.total || 0,
      userDtos,
    );
  }
}
