import { GetVaultUsersResponseDto } from './dto/get-vault-users.dto';
import { Controller, Get, Param, UseGuards, Post, Body } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PermissionClearer } from 'src/schema/role/permission.helper';
import { GetVaultOrganizationResponseDto } from './dto/get-vault-organizations.dto';
import { Permissions } from '../auth/decorator/permissions.decorator';
import { VaultService } from './vault.service';
import JwtTwoFactorGuard from '../auth/guard/jwt-two-factor.guard';
import { PermissionsGuard } from '../auth/guard/permissions.guard';
import { JoinVaultOrganizationRequestDto } from './dto/join-vault-organization-request.dto';
import { VaultResourceCreatedResponseDto } from './dto/vault-resource-created.dto';

/**
 * This route is meant for testing
 */
@UseGuards(JwtTwoFactorGuard, PermissionsGuard)
@Controller('api/v1/vault')
@ApiTags('vault', 'clearer')
@ApiBearerAuth()
export class VaultController {
  constructor(private readonly vaultService: VaultService) {}
  @Get('organization')
  @Permissions(PermissionClearer.organizationRead)
  @ApiOperation({ summary: 'Get all organizations in the vault' })
  @ApiOkResponse({ type: GetVaultOrganizationResponseDto })
  async getOrganizations(): Promise<GetVaultOrganizationResponseDto> {
    return this.vaultService.getAllOrganizations();
  }

  @Get('user')
  @Permissions(PermissionClearer.organizationRead)
  @ApiOperation({ summary: 'Get all vault users' })
  @ApiOkResponse({ type: GetVaultUsersResponseDto })
  async getUsers(): Promise<GetVaultUsersResponseDto> {
    return this.vaultService.getAllVaultUsers();
  }

  @Get('organization/user')
  @Permissions(PermissionClearer.organizationRead)
  @ApiOperation({ summary: 'Get all organization users ' })
  @ApiOkResponse({ type: GetVaultUsersResponseDto })
  async getOrganizationUsers(): Promise<GetVaultUsersResponseDto> {
    return this.vaultService.getAllOrganizationUsers();
  }
  @Post('organization/user')
  @Permissions(PermissionClearer.organizationRead)
  @ApiOperation({ summary: 'create organization user ' })
  @ApiOkResponse({ type: VaultResourceCreatedResponseDto })
  async createOrganizationUser(
    @Body() request: JoinVaultOrganizationRequestDto,
  ): Promise<VaultResourceCreatedResponseDto> {
    return this.vaultService.createOrganizationUser(request.publicKey);
  }

  @Post('organization/:organizationId/user')
  @Permissions(PermissionClearer.organizationRead)
  @ApiOperation({ summary: 'Join a user to organization' })
  @ApiOkResponse({ type: GetVaultUsersResponseDto })
  async joinOrganizationUser(
    @Param('organizationId') organizationId: string,
    @Body() request: JoinVaultOrganizationRequestDto,
  ): Promise<VaultResourceCreatedResponseDto> {
    return this.vaultService.joinOrganizationUser(
      organizationId,
      request.publicKey,
    );
  }
}
