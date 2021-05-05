import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RegisterRequestDto } from './dto/register-request.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { ExceptionDto } from 'src/exeption/dto/exception.dto';

@Controller('api/v1/auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Sign up' })
  @ApiCreatedResponse({
    description: 'Successfully registered user id',
    type: RegisterResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Bad request', type: ExceptionDto })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  register(
    @Body() registerRequest: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    return this.authService.register(registerRequest);
  }

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
  @ApiBadRequestResponse({ description: 'Bad request', type: ExceptionDto })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  login(@Body() loginRequest: LoginRequestDto): Promise<LoginResponseDto> {
    return this.authService.login(loginRequest);
  }
}
