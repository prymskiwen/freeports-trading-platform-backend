import { Controller, UseGuards, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ExceptionDto } from 'src/exeption/dto/exception.dto';
import {
  PermissionClearer,
  PermissionDesk,
  PermissionOrganization,
} from 'src/schema/role/enum/permission.enum';
import JwtTwoFactorGuard from '../auth/guard/jwt-two-factor.guard';
import { GetPermissionClearerResponseDto } from './dto/permission/get-permission-clearer-response.dto';
import { GetPermissionDeskResponseDto } from './dto/permission/get-permission-desk-response.dto';
import { GetPermissionOrganizationResponseDto } from './dto/permission/get-permission-organization-response.dto';

@UseGuards(JwtTwoFactorGuard)
@Controller('api/v1/permission')
@ApiTags('permission', 'role')
@ApiBearerAuth()
export class PermissionController {
  @Get('clearer')
  @ApiTags('clearer')
  @ApiOperation({ summary: 'Get clearer permission list' })
  @ApiOkResponse({ type: GetPermissionClearerResponseDto })
  @ApiUnauthorizedResponse({
    description: 'Not authenticated',
    type: ExceptionDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ExceptionDto,
  })
  getPermissionClearer(): GetPermissionClearerResponseDto {
    return {
      permissions: Object.values(PermissionClearer),
    };
  }

  @Get('organization')
  @ApiTags('organization')
  @ApiOperation({ summary: 'Get organization permission list' })
  @ApiOkResponse({ type: GetPermissionOrganizationResponseDto })
  @ApiUnauthorizedResponse({
    description: 'Not authenticated',
    type: ExceptionDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ExceptionDto,
  })
  getPermissionOrganization(): GetPermissionOrganizationResponseDto {
    return {
      permissions: Object.values(PermissionOrganization),
    };
  }

  @Get('desk')
  @ApiTags('desk')
  @ApiOperation({ summary: 'Get desk permission list' })
  @ApiOkResponse({ type: GetPermissionDeskResponseDto })
  @ApiUnauthorizedResponse({
    description: 'Not authenticated',
    type: ExceptionDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ExceptionDto,
  })
  getPermissionDesk(): GetPermissionDeskResponseDto {
    return {
      permissions: Object.values(PermissionDesk),
    };
  }
}
