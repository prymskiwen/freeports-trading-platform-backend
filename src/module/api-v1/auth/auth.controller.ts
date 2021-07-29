import { RevokeOTPSecretResponseDto } from './dto/revoke-otp-secret-response.dto';
import { OTPSecretAlreadySet } from './../../../exeption/otp-secret-already-set.exception';
import { TwoFactorAuthenticationCodeDto } from './dto/twoFactorAuthenticationCode.dto';
import { Invalid2faCodeException } from '../../../exeption/invalid-2fa-code.exception';
import JwtTwoFactorGuard from './guard/jwt-two-factor.guard';
import { PermissionsGuard } from './guard/permissions.guard';
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Res,
  Param,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { ExceptionDto } from 'src/exeption/dto/exception.dto';
import { InvalidFormExceptionDto } from 'src/exeption/dto/invalid-form-exception.dto';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { RefreshTokenRequestDto } from './dto/refresh-token-request.dto';
import { TokenDto } from './dto/token.dto';
import { ValidateTokenRequestDto } from './dto/validate-token-request.dto';
import { ValidateTokenResponseDto } from './dto/validate-token-response.dto';
import { UserDocument } from 'src/schema/user/user.schema';
import { CurrentUser } from './decorator/current-user.decorator';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { Response } from 'express';
import { ParseObjectIdPipe } from 'src/pipe/parse-objectid.pipe';
import { NewPasswordRequestDto } from './dto/new-password-request.dto';
import { NewPasswordResponseDto } from './dto/new-password-response.dto';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { ResetPasswordResponseDto } from './dto/reset-password-response.dto';

@Controller('api/v1/auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Sign in', description: 'User authentication' })
  @ApiCreatedResponse({
    description: 'Successfully authenticated user access key',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    type: ExceptionDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid form',
    type: InvalidFormExceptionDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ExceptionDto,
  })
  login(
    // Keep request here to validate login form
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() loginRequest: LoginRequestDto,
    @CurrentUser() user: UserDocument,
  ): Promise<LoginResponseDto> {
    return this.authService.login(user);
  }

  @Post(':userId/setpassword')
  @ApiCreatedResponse({
    description: 'New Password is saved successfully',
    type: ResetPasswordResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    type: ExceptionDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid form',
    type: InvalidFormExceptionDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ExceptionDto,
  })
  async resetNewPassword(
    @Param('userId', ParseObjectIdPipe) userId: string,
    @Body() request: ResetPasswordRequestDto,
  ): Promise<any> {
    return this.authService.resetPassword(userId, request.password, request.token);
  }

  @Post(':userId/password')
  @ApiCreatedResponse({
    description: 'New Password is saved successfully',
    type: NewPasswordResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    type: ExceptionDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid form',
    type: InvalidFormExceptionDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ExceptionDto,
  })
  async updatePassword(
    @Param('userId', ParseObjectIdPipe) userId: string,
    @Body() request: NewPasswordRequestDto,
  ): Promise<NewPasswordResponseDto> {
    const updatedUser = await this.authService.updatePassword(
      userId,
      request.password,
    );
    return { id: updatedUser._id };
  }

  @Post('/2fa/generate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'Returns qr code image',
    content: {
      'image/png': {
        schema: {
          type: 'file',
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'OTP secret is already set',
    type: ExceptionDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Not authenticated',
    type: ExceptionDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ExceptionDto,
  })
  async register(
    @CurrentUser() userCurrent: UserDocument,
    @Res() response: Response,
  ) {
    if (userCurrent.twoFactorAuthenticationSecret) {
      throw new OTPSecretAlreadySet();
    }

    const { otpauthUrl } =
      await this.authService.generateTwoFactorAuthenticationSecret(userCurrent);

    response.set({ 'Content-Type': 'image/png' });

    return this.authService.pipeQrCodeStream(response, otpauthUrl);
  }

  @Post('/2fa/authenticate')
  @ApiOperation({ summary: 'Sign in 2fa', description: 'Validate 2fa code' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({
    description: 'Not authenticated',
    type: ExceptionDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid form',
    type: InvalidFormExceptionDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ExceptionDto,
  })
  async authenticate(
    @Body() { code }: TwoFactorAuthenticationCodeDto,
    @CurrentUser() userCurrent: UserDocument,
  ) {
    const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(
      code,
      userCurrent,
    );

    if (!isCodeValid) {
      throw new Invalid2faCodeException();
    }

    return this.authService.login2FA(userCurrent);
  }

  @Post('/token/refresh')
  @ApiOperation({
    summary: 'Refresh token',
    description: 'Renew access in the application',
  })
  @ApiOkResponse({ description: 'Token successfully renewed', type: TokenDto })
  @ApiUnauthorizedResponse({ description: 'Refresh token invalid or expired' })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ExceptionDto,
  })
  async getNewToken(
    @Body() refreshTokenDto: RefreshTokenRequestDto,
  ): Promise<TokenDto> {
    return this.authService.generateRefreshToken(refreshTokenDto.refreshToken);
  }

  @Post('/token/validate')
  @ApiOperation({ description: 'Validate token' })
  @ApiOkResponse({
    description: 'Validation was successful',
    type: ValidateTokenResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ExceptionDto,
  })
  async validateToken(
    @Body() validateTokenDto: ValidateTokenRequestDto,
  ): Promise<ValidateTokenResponseDto> {
    return this.authService.validateToken(validateTokenDto.token);
  }

  @Post('/:userId/revoke-secret')
  @ApiOperation({ description: 'Revoke OTP secret' })
  @ApiOkResponse({
    description: 'Secret was revoked successfully',
    type: RevokeOTPSecretResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ExceptionDto,
  })
  async revokeOTPSecret(
    @Param('userId', ParseObjectIdPipe) userId: string,
  ): Promise<RevokeOTPSecretResponseDto> {
    return this.authService.revokeOTPSecret(userId);
  }
}
