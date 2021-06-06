import { OTPSecretAlreadySet } from './../../../exeption/otp-secret-already-set.exception';
import { TwoFactorAuthenticationCodeDto } from './dto/twoFactorAuthenticationCode.dto';
import { Invalid2faCodeException } from '../../../exeption/invalid-2fa-code.exception';
import { Controller, Post, Body, UseGuards, Req, Res } from '@nestjs/common';
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
import RequestWithUser from './requestWithUser.interface';
import { Response } from 'express';

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

  @Post('/2fa/generate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async register(@Res() response: Response, @Req() request: RequestWithUser) {
    if (request.user.twoFactorAuthenticationSecret) {
      throw new OTPSecretAlreadySet();
    }
    const {
      otpauthUrl,
    } = await this.authService.generateTwoFactorAuthenticationSecret(
      request.user,
    );

    response.set({ 'Content-Type': 'image/png' });

    return this.authService.pipeQrCodeStream(response, otpauthUrl);
  }

  @Post('/2fa/authenticate')
  @ApiOperation({ summary: 'Sign in 2fa', description: 'Validate 2fa code' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async authenticate(
    @Req() request: RequestWithUser,
    @Body() { twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto,
  ) {
    const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(
      twoFactorAuthenticationCode,
      request.user,
    );

    if (!isCodeValid) {
      throw new Invalid2faCodeException();
    }

    return this.authService.login2FA(request.user);
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
}
