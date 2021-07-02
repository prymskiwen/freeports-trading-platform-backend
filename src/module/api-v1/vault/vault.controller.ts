import {
  Controller,
  Get,
  Param,
  UseGuards,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { VaultRequestDto } from './dto/vault-request.dto';
import { VaultService } from './vault.service';
import JwtTwoFactorGuard from '../auth/guard/jwt-two-factor.guard';
import { PermissionsGuard } from '../auth/guard/permissions.guard';

/**
 * This route is meant for testing
 */
@UseGuards(JwtTwoFactorGuard, PermissionsGuard)
@Controller('api/v1/vault')
@ApiTags('vault')
@ApiBearerAuth()
export class VaultController {
  constructor(private readonly vaultService: VaultService) {}
  @Post('request')
  @ApiOperation({ summary: 'Send a request to the vault' })
  @ApiOkResponse({})
  async sendRequest(@Body() request: VaultRequestDto): Promise<any> {
    try {
      const vaultResponse = await this.vaultService.sendRequest(
        request.method,
        request.path,
        request.signature,
        request.body,
        request.headers,
      );

      return vaultResponse.data;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.response?.data);
    }
  }
}
