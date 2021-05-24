import { Reflector } from '@nestjs/core';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { PERMISSIONS_KEY } from '../decorator/permissions.decorator';
import { UserDocument } from 'src/schema/user/user.schema';
import { MissedParameterException } from 'src/exeption/missed-parameter.exception';
import { Permission } from 'src/schema/role/enum/permission.enum';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!permissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const params = request.params;

    const permissionsParsed = permissions.map((permission) => {
      const regex = /(\#(\w+)\#)/g;
      const placeholders = [];
      const missedParams = [];
      let permissionParsed: string = permission;
      let match: any;

      while ((match = regex.exec(permission))) {
        placeholders.push(match[2]);
      }

      placeholders.forEach((placeholder) => {
        if (!(placeholder in params)) {
          missedParams.push(placeholder);
        }
      });

      if (missedParams.length) {
        throw new MissedParameterException(missedParams);
      }

      placeholders.forEach((placeholder) => {
        permissionParsed = permissionParsed.replace(
          `#${placeholder}#`,
          params[placeholder],
        );
      });

      return permissionParsed;
    });

    return this.matchPermissions(permissionsParsed, user);
  }

  async matchPermissions(
    permissions: string[],
    user: UserDocument,
  ): Promise<boolean> {
    const userPermissions = await user.get('permissions');

    return permissions.some((permission) =>
      userPermissions.includes(permission),
    );
  }
}
