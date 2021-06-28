import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Get,
  UseGuards,
  NotFoundException,
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
import { ApiPaginationResponse } from 'src/pagination/api-pagination-response.decorador';
import { PaginationParams } from 'src/pagination/pagination-params.decorator';
import { PaginationRequest } from 'src/pagination/pagination-request.interface';
import { PaginationResponseDto } from 'src/pagination/pagination-response.dto';
import { UserDocument } from 'src/schema/user/user.schema';
import { Permissions } from '../auth/decorator/permissions.decorator';
import { PermissionsGuard } from '../auth/guard/permissions.guard';
import { CreateUserResponseDto } from '../user/dto/create-user-response.dto';
import { CreateUserRequestDto } from '../user/dto/create-user-request.dto';
import { UpdateUserResponseDto } from '../user/dto/update-user-response.dto';
import { UpdateUserRequestDto } from '../user/dto/update-user-request.dto';
import { GetUserResponseDto } from '../user/dto/get-user-response.dto';
import { UserService } from './user.service';
import { UserMapper } from './mapper/user.mapper';
import { PaginationHelper } from 'src/pagination/pagination.helper';
import JwtTwoFactorGuard from '../auth/guard/jwt-two-factor.guard';
import { PermissionClearer } from 'src/schema/role/permission.helper';
import { GetUserDetailsResponseDto } from './dto/get-user-details-response.dto';
import { UniqueFieldException } from 'src/exeption/unique-field.exception';

@UseGuards(JwtTwoFactorGuard, PermissionsGuard)
@Controller('api/v1/user')
@ApiTags('user', 'clearer')
@ApiBearerAuth()
export class UserClearerController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Permissions(PermissionClearer.coworkerRead)
  @ApiOperation({ summary: 'Get clearer user list' })
  @ApiPaginationResponse(GetUserResponseDto)
  async getClearerUserPaginated(
    @PaginationParams() pagination: PaginationRequest,
  ): Promise<PaginationResponseDto<GetUserResponseDto>> {
    const [
      { paginatedResult, totalResult },
    ] = await this.userService.getClearerUserPaginated(pagination);

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
  @Permissions(PermissionClearer.coworkerRead)
  @ApiOperation({ summary: 'Get clearer user' })
  @ApiOkResponse({ type: GetUserDetailsResponseDto })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Clearer user has not been found',
    type: ExceptionDto,
  })
  async getClearerUser(
    @Param('userId', ParseObjectIdPipe) userId: string,
  ): Promise<GetUserDetailsResponseDto> {
    const user = await this.userService.getClearerUserById(userId);

    if (!user) {
      throw new NotFoundException();
    }

    return UserMapper.toGetDetailsDto(user);
  }

  @Post()
  @Permissions(PermissionClearer.coworkerCreate)
  @ApiOperation({ summary: 'Create clearer user' })
  @ApiCreatedResponse({
    description: 'Successfully registered clearer user id',
    type: CreateUserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid form',
    type: InvalidFormExceptionDto,
  })
  async createClearerUser(
    @Body() request: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    try {
      const user = await this.userService.create(request);

      return UserMapper.toCreateDto(user);
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

  @Patch(':userId')
  @Permissions(PermissionClearer.coworkerUpdate)
  @ApiOperation({ summary: 'Update clearer user' })
  @ApiOkResponse({
    description: 'Successfully updated clearer user id',
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
    description: 'Clearer user has not been found',
    type: ExceptionDto,
  })
  async updateClearerUser(
    @Param('userId', ParseObjectIdPipe) userId: string,
    @Body() request: UpdateUserRequestDto,
  ): Promise<UpdateUserResponseDto> {
    try {
      const user = await this.userService.getClearerUserById(userId);

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
  @Permissions(PermissionClearer.coworkerState)
  @ApiOperation({ summary: 'Suspend clearer user' })
  @ApiOkResponse({
    description: 'Successfully suspended clearer user id',
    type: UpdateUserResponseDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Clearer user has not been found',
    type: ExceptionDto,
  })
  async suspendClearerUser(
    @Param('userId', ParseObjectIdPipe) userId: string,
  ): Promise<UpdateUserResponseDto> {
    const user = await this.userService.getClearerUserById(userId);

    if (!user) {
      throw new NotFoundException();
    }

    user.suspended = true;
    await user.save();

    return UserMapper.toUpdateDto(user);
  }

  @Put(':userId/resume')
  @Permissions(PermissionClearer.coworkerState)
  @ApiOperation({ summary: 'Resume clearer user' })
  @ApiOkResponse({
    description: 'Successfully resumed clearer user id',
    type: UpdateUserResponseDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Clearer user has not been found',
    type: ExceptionDto,
  })
  async resumeClearerUser(
    @Param('userId', ParseObjectIdPipe) userId: string,
  ): Promise<UpdateUserResponseDto> {
    const user = await this.userService.getClearerUserById(userId);

    if (!user) {
      throw new NotFoundException();
    }

    user.suspended = false;
    await user.save();

    return UserMapper.toUpdateDto(user);
  }
}
