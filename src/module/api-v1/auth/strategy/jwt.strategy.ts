import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import authenticationConfig from 'src/config/auth.config';
import { InvalidCredentialsException } from 'src/exeption/invalid-credentials.exception';
import { WrongTokenException } from 'src/exeption/wrong-token.exception';
import { User, UserDocument } from 'src/schema/user/user.schema';
import { JwtPayload } from '../dto/jwt-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
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

    const user = await this.userModel
      .findOne({ 'personal.email': email })
      .exec();

    if (!user) {
      throw new InvalidCredentialsException();
    }

    return user;
  }
}
