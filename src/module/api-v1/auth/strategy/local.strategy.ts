import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Strategy } from 'passport-local';
import { InvalidCredentialsException } from 'src/exeption/invalid-credentials.exception';
import { User, UserDocument } from 'src/schema/user/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<UserDocument> {
    const user = await this.userModel
      .findOne({ 'personal.email': email })
      .exec();

    if (!user || !(await bcrypt.compare(password, user.personal.password))) {
      throw new InvalidCredentialsException();
    }

    return user;
  }
}
