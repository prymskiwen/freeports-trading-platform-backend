import { Inject, Injectable } from '@nestjs/common';
import { UserDocument } from 'src/schema/user/user.schema';
import { LoginResponseDto } from './dto/login-response.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/jwt-payload';
import authenticationConfig from 'src/config/auth.config';
import { ConfigType } from '@nestjs/config';
import { TokenDto } from './dto/token.dto';
import { ValidateTokenResponseDto } from './dto/validate-token-response.dto';
import { InvalidTokenException } from 'src/exeption/invalid-token.exception';
import { ExpiredTokenException } from 'src/exeption/expired-token.exception';
import { UserService } from '../user/user.service';
import { UserMapper } from '../user/mapper/user.mapper';

@Injectable()
export class AuthService {
  constructor(
    @Inject(authenticationConfig.KEY)
    private authConfig: ConfigType<typeof authenticationConfig>,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async login(user: UserDocument): Promise<LoginResponseDto> {
    return {
      user: UserMapper.toGetDto(user),
      token: this.generateAuthToken({
        sub: user.id,
        name: user.personal.nickname,
        email: user.personal.email,
        refresh: false,
      }),
    };
  }

  public generateAuthToken(payload: JwtPayload): TokenDto {
    const tokenType = this.authConfig.type;
    const accessTokenExpires = this.authConfig.access_expires_in;
    const refreshTokenExpires = this.authConfig.refresh_expires_in;
    const accessToken = this.jwtService.sign(
      { ...payload, refresh: false },
      { expiresIn: accessTokenExpires },
    );
    const refreshToken = this.jwtService.sign(
      { ...payload, refresh: true },
      { expiresIn: refreshTokenExpires },
    );

    return {
      tokenType,
      accessToken,
      accessTokenExpires,
      refreshToken,
      refreshTokenExpires,
    };
  }

  public generateRefreshToken(refreshToken: string): TokenDto {
    try {
      return this.generateAuthToken(this.jwtService.verify(refreshToken));
    } catch ({ name }) {
      if (name === 'TokenExpiredError') {
        throw new ExpiredTokenException();
      }

      throw new InvalidTokenException();
    }
  }

  public async validateToken(token: string): Promise<ValidateTokenResponseDto> {
    try {
      const { sub } = this.jwtService.verify(token);
      const user = await this.userService.findById(sub);

      if (!user) {
        return { valid: false };
      }

      return { valid: !!sub };
    } catch (error) {
      return { valid: false };
    }
  }
}
