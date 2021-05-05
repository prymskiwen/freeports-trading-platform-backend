import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterRequestDto } from './dto/register-request.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Controller('api/v1/auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Sign up' })
  @ApiCreatedResponse({
    description: 'The user has been successfully registered.',
    type: RegisterResponseDto,
  })
  register(
    @Body() registerRequest: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    return this.authService.register(registerRequest);
  }

  @Post('login')
  @ApiOperation({ summary: 'Sign in' })
  @ApiCreatedResponse({
    description: 'The user has been successfully registered.',
    type: LoginResponseDto,
  })
  login(@Body() loginRequest: LoginRequestDto): Promise<LoginResponseDto> {
    return this.authService.login(loginRequest);
  }
}
