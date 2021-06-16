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
import { CreateDeskResponseDto } from './dto/create-desk-response.dto';
import { CreateDeskRequestDto } from './dto/create-desk-request.dto';
import { Permissions } from '../auth/decorator/permissions.decorator';
import { PermissionsGuard } from '../auth/guard/permissions.guard';
import { DeskService } from './desk.service';
import { OrganizationService } from '../organization/organization.service';
import { DeskMapper } from './mapper/desk.mapper';
import JwtTwoFactorGuard from '../auth/guard/jwt-two-factor.guard';
import { PermissionOrganization } from 'src/schema/role/permission.helper';

@UseGuards(JwtTwoFactorGuard, PermissionsGuard)
@Controller('api/v1/organization')
@ApiBearerAuth()
export class DeskController {
  constructor(
    private readonly deskService: DeskService,
    private readonly organizationService: OrganizationService,
  ) {}

  @Post(':organizationId/desk')
  @Permissions(PermissionOrganization.deskCreate)
  @ApiTags('organization')
  @ApiOperation({ summary: 'Create desk' })
  @ApiCreatedResponse({
    description: 'Successfully registered desk id',
    type: CreateDeskResponseDto,
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
  async createDesk(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Body() request: CreateDeskRequestDto,
  ): Promise<CreateDeskResponseDto> {
    const organization = await this.organizationService.getById(organizationId);

    if (!organization) {
      throw new NotFoundException();
    }

    const desk = await this.deskService.create(organization, request);

    return DeskMapper.toCreateDto(desk);
  }
}
