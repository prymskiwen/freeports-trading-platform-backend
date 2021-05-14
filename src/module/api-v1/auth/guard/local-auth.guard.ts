import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  // override this method to show form validation
  // otherwise unauthorized exception thrown on invalid form
  handleRequest(err, user) {
    if (err) {
      throw err;
    }

    return user;
  }
}
