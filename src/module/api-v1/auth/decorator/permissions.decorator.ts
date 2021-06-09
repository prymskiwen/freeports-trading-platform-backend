import { applyDecorators, SetMetadata } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ExceptionDto } from 'src/exeption/dto/exception.dto';
import { PermissionAny } from 'src/schema/role/permission.helper';

export const PERMISSIONS_KEY = 'permissions';

export const Permissions = (...permissions: PermissionAny[]) => {
  return applyDecorators(
    SetMetadata(PERMISSIONS_KEY, permissions),
    ApiUnauthorizedResponse({
      description: 'Not authenticated',
      type: ExceptionDto,
    }),
    ApiForbiddenResponse({ description: 'Access denied', type: ExceptionDto }),
    ApiInternalServerErrorResponse({
      description: 'Server error',
      type: ExceptionDto,
    }),
  );
};
