import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Delete,
  Param,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ExceptionDto } from 'src/exeption/dto/exception.dto';
import JwtTwoFactorGuard from '../auth/guard/jwt-two-factor.guard';
import { UserDocument } from 'src/schema/user/user.schema';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { GetUserPublicKeyResponseDto } from './dto/public-key/get-user-public-key-response.dto';
import { CreateUserPublicKeyRequestDto } from './dto/public-key/create-user-public-key-request.dto';
import { ParseObjectIdPipe } from 'src/pipe/parse-objectid.pipe';
import { UserService } from './user.service';
import { UserPublicKeyStatus } from 'src/schema/user/embedded/user-public-key.embedded';

@UseGuards(JwtTwoFactorGuard)
@Controller('api/v1/my/public-key')
@ApiTags('user', 'my', 'public-key')
@ApiBearerAuth()
export class UserPublicKeyController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get user public key list' })
  @ApiOkResponse({ type: [GetUserPublicKeyResponseDto] })
  @ApiUnauthorizedResponse({
    description: 'Not authenticated',
    type: ExceptionDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ExceptionDto,
  })
  async getUserPublicKeyList(
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<GetUserPublicKeyResponseDto[]> {
    return userCurrent.publicKeys.map((publicKey) => {
      return {
        id: publicKey.id,
        key: publicKey.key,
        status: publicKey.status,
      };
    });
  }

  @Post()
  @ApiOperation({ summary: 'Create user public key' })
  @ApiCreatedResponse({
    description: 'Successfully created public key',
    type: GetUserPublicKeyResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Not authenticated',
    type: ExceptionDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ExceptionDto,
  })
  async addUserPublicKey(
    @Body() request: CreateUserPublicKeyRequestDto,
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<GetUserPublicKeyResponseDto> {
    const publicKey = await this.userService.createPublicKey(
      userCurrent,
      request,
    );

    await userCurrent.get('organization');
    // create vault user
    if (userCurrent.organization) {
      console.log('user current ');
    }

    return {
      id: publicKey.id,
      key: publicKey.key,
      status: publicKey.status,
    };
  }

  @Post(':keyId/revoke')
  @ApiOperation({ summary: 'Revoke user public key' })
  @ApiOkResponse({
    description: 'Successfully revoked user public key list',
    type: GetUserPublicKeyResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Not authenticated',
    type: ExceptionDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'User public key has not been found',
    type: ExceptionDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ExceptionDto,
  })
  async revokeUserPublicKey(
    @Param('keyId', ParseObjectIdPipe) keyId: string,
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<GetUserPublicKeyResponseDto> {
    const publicKey = userCurrent.publicKeys.id(keyId);

    if (!publicKey) {
      throw new NotFoundException();
    }

    publicKey.status = UserPublicKeyStatus.revoked;
    await userCurrent.save();

    return {
      id: publicKey.id,
      key: publicKey.key,
      status: publicKey.status,
    };
  }

  @Delete(':keyId')
  @ApiOperation({ summary: 'Delete user public key' })
  @ApiOkResponse({
    description: 'Successfully updated user public key list',
    type: [GetUserPublicKeyResponseDto],
  })
  @ApiUnauthorizedResponse({
    description: 'Not authenticated',
    type: ExceptionDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'User public key has not been found',
    type: ExceptionDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ExceptionDto,
  })
  async deleteUserPublicKey(
    @Param('keyId', ParseObjectIdPipe) keyId: string,
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<GetUserPublicKeyResponseDto[]> {
    const publicKey = userCurrent.publicKeys.id(keyId);

    if (!publicKey) {
      throw new NotFoundException();
    }

    await publicKey.remove();
    await userCurrent.save();

    return userCurrent.publicKeys.map((publicKey) => {
      return {
        id: publicKey.id,
        key: publicKey.key,
        status: publicKey.status,
      };
    });
  }
}
