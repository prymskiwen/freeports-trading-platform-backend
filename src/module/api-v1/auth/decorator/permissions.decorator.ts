import { applyDecorators, SetMetadata } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ExceptionDto } from 'src/exeption/dto/exception.dto';
import { Permission } from 'src/schema/role/enum/permission.enum';

export const PERMISSIONS_KEY = 'permissions';

export const Permissions = (...permissions: Permission[]) => {
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
