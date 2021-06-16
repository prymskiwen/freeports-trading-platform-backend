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
  PermissionClearerGroup,
  PermissionDeskGroup,
  PermissionOrganizationGroup,
} from 'src/schema/role/permission.helper';
import JwtTwoFactorGuard from '../auth/guard/jwt-two-factor.guard';
import { GetPermissionClearerResponseDto } from './dto/permission/get-permission-clearer-response.dto';
import { GetPermissionDeskResponseDto } from './dto/permission/get-permission-desk-response.dto';
import { GetPermissionOrganizationResponseDto } from './dto/permission/get-permission-organization-response.dto';

@UseGuards(JwtTwoFactorGuard)
@Controller('api/v1')
@ApiTags('permission', 'role')
@ApiBearerAuth()
export class PermissionController {
  @Get('clearer/permission')
  @ApiTags('clearer')
  @ApiOperation({ summary: 'Get clearer permission list' })
  @ApiOkResponse({ type: [GetPermissionClearerResponseDto] })
  @ApiUnauthorizedResponse({
    description: 'Not authenticated',
    type: ExceptionDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ExceptionDto,
  })
  getPermissionClearer(): GetPermissionClearerResponseDto[] {
    return PermissionClearerGroup;
  }

  @Get('organization/:anyOrganizationId/permission')
  @ApiTags('organization')
  @ApiOperation({ summary: 'Get organization permission list' })
  @ApiOkResponse({ type: [GetPermissionOrganizationResponseDto] })
  @ApiUnauthorizedResponse({
    description: 'Not authenticated',
    type: ExceptionDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ExceptionDto,
  })
  getPermissionOrganization(): GetPermissionOrganizationResponseDto[] {
    return PermissionOrganizationGroup;
  }

  @Get('organization/:anyOrganizationId/desk/:anyDeskId/permission')
  @ApiTags('desk')
  @ApiOperation({ summary: 'Get desk permission list' })
  @ApiOkResponse({ type: [GetPermissionDeskResponseDto] })
  @ApiUnauthorizedResponse({
    description: 'Not authenticated',
    type: ExceptionDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ExceptionDto,
  })
  getPermissionDesk(): GetPermissionDeskResponseDto[] {
    return PermissionDeskGroup;
  }
}
