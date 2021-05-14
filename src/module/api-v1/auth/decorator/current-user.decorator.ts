import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from 'src/schema/user/user.schema';

export const CurrentUser = createParamDecorator<UserDocument>(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return request.user;
  },
);
