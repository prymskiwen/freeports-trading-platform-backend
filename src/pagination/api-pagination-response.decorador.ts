import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiQuery,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { PaginationResponseDto } from './pagination-response.dto';
import { ExceptionDto } from 'src/exeption/dto/exception.dto';

export const ApiPaginationResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiQuery({ name: 'orderBy', type: 'String', required: false }),
    ApiQuery({
      name: 'orderDirection',
      enum: ['ASC', 'DESC'],
      required: false,
    }),
    ApiQuery({ name: 'page', type: 'number', required: false, example: '1' }),
    ApiQuery({ name: 'limit', type: 'number', required: false, example: '20' }),
    ApiQuery({ name: 'search', type: 'String', required: false }),
    ApiExtraModels(PaginationResponseDto, model),
    ApiOkResponse({
      schema: {
        title: `PaginationResponseOf${model.name}`,
        allOf: [
          { $ref: getSchemaPath(PaginationResponseDto) },
          {
            properties: {
              content: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Not authenticated',
      type: ExceptionDto,
    }),
    ApiInternalServerErrorResponse({
      description: 'Server error',
      type: ExceptionDto,
    }),
  );
};
