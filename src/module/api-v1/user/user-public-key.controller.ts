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
import { PermissionsGuard } from '../auth/guard/permissions.guard';
import { GetUserPublicKeyResponseDto } from './dto/public-key/get-user-public-key-response.dto';
import { CreateUserPublicKeyRequestDto } from './dto/public-key/create-user-public-key-request.dto';
import {
  UserPublicKey,
  UserPublicKeyDocument,
} from 'src/schema/user/embedded/user-public-key.embedded';
import { ParseObjectIdPipe } from 'src/pipe/parse-objectid.pipe';

@UseGuards(JwtTwoFactorGuard, PermissionsGuard)
@Controller('api/v1/my/public-key')
@ApiTags('user', 'public-key')
@ApiBearerAuth()
export class UserPublicKeyController {
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
    return userCurrent.publicKeys.map((publicKey: UserPublicKeyDocument) => {
      return {
        id: publicKey.id,
        key: publicKey.key,
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
    const publicKey = new UserPublicKey();

    publicKey.key = request.key;
    userCurrent.publicKeys.push(publicKey);
    await userCurrent.save();

    await userCurrent.get('organization');
    // create vault user
    if (userCurrent.organization) {
      console.log('user current ');
    }
    //
    return {
      id: publicKey['id'],
      key: publicKey.key,
    };
  }

  @Delete(':keyId')
  @ApiOperation({ summary: 'Delete user public key' })
  @ApiOkResponse({
    description: 'Successfully updated  user public key list',
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
    // works but doesnt returns updated list
    // await userCurrent.update({
    //   $pull: {
    //     publicKeys: { _id: keyId },
    //   },
    // });

    const publicKeysNew = userCurrent.publicKeys.filter(
      (publicKey: UserPublicKeyDocument) =>
        publicKey.id.toString() !== keyId.toString(),
    );

    if (userCurrent.publicKeys.length === publicKeysNew.length) {
      throw new NotFoundException();
    }

    userCurrent.publicKeys = publicKeysNew;
    await userCurrent.save();

    return userCurrent.publicKeys.map((publicKey: UserPublicKeyDocument) => {
      return {
        id: publicKey.id,
        key: publicKey.key,
      };
    });
  }
}
