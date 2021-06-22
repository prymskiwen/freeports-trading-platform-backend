import {
  Controller,
  Post,
  Body,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ExceptionDto } from 'src/exeption/dto/exception.dto';
import { InvalidFormExceptionDto } from 'src/exeption/dto/invalid-form-exception.dto';
import { UserService } from '../user/user.service';
import { RoleService } from '../role/role.service';
import { AuthService } from '../auth/auth.service';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { LoginResponseDto } from '../auth/dto/login-response.dto';

@Controller('api/v1')
@ApiTags('user')
export class InitController {
  constructor(
    private readonly authService: AuthService,
    private readonly roleService: RoleService,
    private readonly userService: UserService,
  ) {}

  @Post('manager')
  @ApiTags('clearer')
  @ApiOperation({ summary: 'Create clearer manager' })
  @ApiCreatedResponse({
    description: 'Successfully registered clearer manager authentication data',
    type: LoginResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid form',
    type: InvalidFormExceptionDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Clearer manager already exists',
    type: ExceptionDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ExceptionDto,
  })
  async createClearerManager(
    @Body() request: CreateUserRequestDto,
  ): Promise<LoginResponseDto> {
    if (await this.roleService.getRoleClearerManager()) {
      throw new UnprocessableEntityException('Clearer manager already exists');
    }

    const user = await this.userService.create(request, false);
    const roleManager = await this.roleService.createRoleClearerManager(
      user,
      false,
    );

    user.roles.push({
      role: roleManager,
      assignedAt: new Date(),
      assignedBy: user,
    });
    roleManager.users.push(user);

    await user.save();
    await roleManager.save();

    return await this.authService.login(user);
  }
}
