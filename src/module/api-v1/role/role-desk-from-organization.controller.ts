import {
  Controller,
  Param,
  UseGuards,
  NotFoundException,
  Get,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ExceptionDto } from 'src/exeption/dto/exception.dto';
import { ParseObjectIdPipe } from 'src/pipe/parse-objectid.pipe';
import { Permissions } from '../auth/decorator/permissions.decorator';
import { PermissionsGuard } from '../auth/guard/permissions.guard';
import { RoleService } from './role.service';
import { RoleMapper } from './mapper/role.mapper';
import { OrganizationService } from '../organization/organization.service';
import { DeskService } from '../desk/desk.service';
import JwtTwoFactorGuard from '../auth/guard/jwt-two-factor.guard';
import { PermissionOrganization } from 'src/schema/role/permission.helper';
import { GetRoleDeskDetailsResponseDto } from './dto/desk/get-role-desk-details-response.dto';

@UseGuards(JwtTwoFactorGuard, PermissionsGuard)
@Controller('api/v1/organization/:organizationId/deskrole')
@ApiTags('role', 'organization', 'desk')
@ApiBearerAuth()
export class RoleDeskFromOrganizationController {
  constructor(
    private readonly deskService: DeskService,
    private readonly organizationService: OrganizationService,
    private readonly roleService: RoleService,
  ) {}

  @Get()
  @Permissions(PermissionOrganization.roleRead)
  @ApiOperation({ summary: 'Get desk role list of orgaization' })
  @ApiOkResponse({ type: [GetRoleDeskDetailsResponseDto] })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Organization or desk within has not been found',
    type: ExceptionDto,
  })
  async getRoleList(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
  ): Promise<GetRoleDeskDetailsResponseDto[]> {
    const organization = await this.organizationService.getById(organizationId);

    if (!organization) {
      throw new NotFoundException();
    }

    const desks = await this.deskService.getDeskList(organization);

    if (!desks || !desks.length) {
      throw new NotFoundException();
    }

    const roles = await this.roleService.getOrganizationRoleDeskList(desks);

    return Promise.all(
      roles.map(async (role) => await RoleMapper.toGetRoleDeskDetailsDto(role)),
    );
  }
}
