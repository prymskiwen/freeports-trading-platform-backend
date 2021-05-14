import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExpiredTokenException } from 'src/exeption/expired-token.exception';
import { InvalidTokenException } from 'src/exeption/invalid-token.exception';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    if (info && info.name === 'TokenExpiredError') {
      throw new ExpiredTokenException();
    }

    if (err || !user) {
      throw new InvalidTokenException();
    }

    return user;
  }
}
