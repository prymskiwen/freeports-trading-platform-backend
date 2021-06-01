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
import { OrganizationService } from '../organization/organization.service';
import { RoleService } from '../role/role.service';
import { InitRequestDto } from './dto/init-request.dto';
import { InitResponseDto } from './dto/init-response.dto';
import { OrganizationMapper } from '../organization/mapper/organization.mapper';
import { AuthService } from '../auth/auth.service';

@Controller('api/v1/organization')
@ApiTags('init')
export class InitController {
  constructor(
    private readonly authService: AuthService,
    private readonly organizationService: OrganizationService,
    private readonly roleService: RoleService,
    private readonly userService: UserService,
  ) {}

  @Post('clearer/init')
  @ApiTags('clearer')
  @ApiOperation({ summary: 'Create clearer organization and manager' })
  @ApiCreatedResponse({
    description: 'Successfully registered clearer information',
    type: InitResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid form',
    type: InvalidFormExceptionDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Clearer already initialized',
    type: ExceptionDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ExceptionDto,
  })
  async init(@Body() request: InitRequestDto): Promise<InitResponseDto> {
    const roleClearer = await this.roleService.getRoleClearerDefault();

    if (roleClearer) {
      throw new UnprocessableEntityException('Clearer already initialized');
    }

    const organization = await this.organizationService.create(
      request.organization,
    );
    const user = await this.userService.create(request.user, false);
    const roleDefault = await this.roleService.createRoleClearerDefault(user);

    user.roles.push({
      role: roleDefault,
      assignedAt: new Date(),
      assignedBy: user,
    });

    await user.save();

    return Object.assign(
      {
        organization: OrganizationMapper.toCreateDto(organization),
      },
      await this.authService.login(user),
    );
  }
}
