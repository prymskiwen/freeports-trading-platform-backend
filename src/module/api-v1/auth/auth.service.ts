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
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { Response } from 'express';

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
        isSecondFactorAuthenticated: false,
      }),
      isOTPDefined: user.twoFactorAuthenticationSecret ? true : false,
    };
  }

  async login2FA(user: UserDocument): Promise<LoginResponseDto> {
    return {
      user: UserMapper.toGetDto(user),
      token: this.generateAuthToken({
        sub: user.id,
        name: user.personal.nickname,
        email: user.personal.email,
        refresh: false,
        isSecondFactorAuthenticated: true,
      }),
      isOTPDefined: user.twoFactorAuthenticationSecret ? true : false,
    };
  }

  public generateAuthToken(payload: JwtPayload): TokenDto {
    const payloadNoExp = this.stripExpiresIn(payload);
    const tokenType = this.authConfig.type;
    const accessTokenExpires = this.authConfig.access_expires_in;
    const refreshTokenExpires = this.authConfig.refresh_expires_in;
    const accessToken = this.jwtService.sign(
      { ...payloadNoExp, refresh: false },
      { expiresIn: accessTokenExpires, mutatePayload: true },
    );
    const refreshToken = this.jwtService.sign(
      { ...payloadNoExp, refresh: true },
      { expiresIn: refreshTokenExpires, mutatePayload: true },
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
      const user = await this.userService.getById(sub);

      if (!user) {
        return { valid: false };
      }

      return { valid: !!sub };
    } catch (error) {
      return { valid: false };
    }
  }

  public async generateTwoFactorAuthenticationSecret(user: UserDocument) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(
      user.personal.email,
      this.authConfig.authentication_two_factor_app_name,
      secret,
    );

    await this.userService.setTwoFactorAuthenticationSecret(user, secret);

    return {
      secret,
      otpauthUrl,
    };
  }

  public isTwoFactorAuthenticationCodeValid(
    twoFactorAuthenticationCode: string,
    user: UserDocument,
  ) {
    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: user.twoFactorAuthenticationSecret,
    });
  }

  public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }

  private stripExpiresIn(payload: JwtPayload) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { exp, ...rest } = payload;

    return rest;
  }
}
