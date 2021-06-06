import { InvalidCredentialsException } from 'src/exeption/invalid-credentials.exception';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtPayload } from '../dto/jwt-payload';
import authenticationConfig from 'src/config/auth.config';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtTwoFactorStrategy extends PassportStrategy(
  Strategy,
  'jwt-two-factor',
) {
  constructor(
    private readonly userService: UserService,
    @Inject(authenticationConfig.KEY)
    private authConfig: ConfigType<typeof authenticationConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authConfig.secret,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userService.getByEmail(payload.email);

    if (!user) {
      throw new InvalidCredentialsException();
    }

    if (!payload.isSecondFactorAuthenticated) {
      throw new InvalidCredentialsException();
    }
    return user;
  }
}
