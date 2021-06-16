import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import authenticationConfig from 'src/config/auth.config';
import { InvalidCredentialsException } from 'src/exeption/invalid-credentials.exception';
import { SuspendedUserException } from 'src/exeption/suspended-user.exception';
import { WrongTokenException } from 'src/exeption/wrong-token.exception';
import { UserDocument } from 'src/schema/user/user.schema';
import { UserService } from '../../user/user.service';
import { JwtPayload } from '../dto/jwt-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    @Inject(authenticationConfig.KEY)
    private authConfig: ConfigType<typeof authenticationConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authConfig.secret,
    });
  }

  async validate({ email, refresh }: JwtPayload): Promise<UserDocument> {
    if (refresh) {
      throw new WrongTokenException();
    }

    const user = await this.userService.getByEmail(email);

    if (!user) {
      throw new InvalidCredentialsException();
    }

    if (user.suspended) {
      throw new SuspendedUserException();
    }

    return user;
  }
}
