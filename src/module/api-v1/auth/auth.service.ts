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
import { OTPSecretNotSet } from 'src/exeption/otp-secret-not-set.exception';
import { SuspendedUserException } from 'src/exeption/suspended-user.exception';
import { ResetPasswordResponseDto } from './dto/reset-password-response.dto';

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

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<UserDocument> {
    return await this.userService.changePassword(
      userId,
      currentPassword,
      newPassword,
    );
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

  async generateRefreshToken(refreshToken: string): Promise<TokenDto> {
    try {
      const token = this.jwtService.verify(refreshToken);
      const user = await this.userService.getById(token.sub);

      if (!user) {
        throw new InvalidTokenException();
      }

      if (user.suspended) {
        throw new SuspendedUserException();
      }

      return this.generateAuthToken(token);
    } catch (error) {
      if (error.name && error.name === 'TokenExpiredError') {
        throw new ExpiredTokenException();
      }

      if (error.response) {
        throw error;
      }

      throw new InvalidTokenException();
    }
  }

  public async validateToken(token: string): Promise<ValidateTokenResponseDto> {
    try {
      const { sub } = this.jwtService.verify(token);
      const user = await this.userService.getById(sub);

      if (!user || user.suspended) {
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

    user.twoFactorAuthenticationSecret = secret;
    await user.save();

    return {
      secret,
      otpauthUrl,
    };
  }

  public isTwoFactorAuthenticationCodeValid(
    twoFactorAuthenticationCode: string,
    user: UserDocument,
  ) {
    if (!user.twoFactorAuthenticationSecret) {
      throw new OTPSecretNotSet();
    }

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
    const { exp, iat, ...rest } = payload;

    return rest;
  }

  public async revokeOTPSecret(userId: string) {
    const user = await this.userService.getById(userId);

    user.twoFactorAuthenticationSecret = undefined;
    await user.save();

    return { success: true };
  }

  async resetPassword(
    userId: string, 
    password: string, 
    resetPasswordToken: string,
  ): Promise<ResetPasswordResponseDto> {
    try {
      const token = this.jwtService.verify(resetPasswordToken);
      const user = await this.userService.getById(token.user_id);

      if (!user) {
        throw new InvalidTokenException();
      }

      if (user && JSON.stringify(user._id) !== JSON.stringify(userId)) {
        throw new InvalidTokenException();
      }

      await this.userService.updatePassword(userId, password);

      return { success: true };

    } catch (error) {
      if (error.name && error.name === 'TokenExpiredError') {
        throw new ExpiredTokenException();
      }

      if (error.response) {
        throw error;
      }

      throw new InvalidTokenException();
    }
  }
}
