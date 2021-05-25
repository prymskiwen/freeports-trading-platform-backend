import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
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
