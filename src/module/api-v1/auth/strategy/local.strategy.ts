import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { InvalidCredentialsException } from 'src/exeption/invalid-credentials.exception';
import { UserDocument } from 'src/schema/user/user.schema';
import * as bcrypt from 'bcrypt';
import { UserService } from '../../user/user.service';
import { SuspendedUserException } from 'src/exeption/suspended-user.exception';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<UserDocument> {
    const user = await this.userService.getByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.personal.password))) {
      throw new InvalidCredentialsException();
    }

    if (user.suspended) {
      throw new SuspendedUserException();
    }

    return user;
  }
}
