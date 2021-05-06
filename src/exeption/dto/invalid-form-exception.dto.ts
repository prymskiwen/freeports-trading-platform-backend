import { ApiProperty } from '@nestjs/swagger';
import { ErrorType } from '../enum/error-type.enum';

export class InvalidFormExceptionDto {
  @ApiProperty({
    type: 'string',
    example: ErrorType.FormInvalid,
  })
  errorType: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        path: { type: 'string', example: 'email' },
        constraints: {
          type: 'object',
          example: {
            constraint_1: 'error text 1',
            constraint_2: 'error text 2',
          },
          additionalProperties: {
            type: 'string',
            example: 'error text',
          },
        },
      },
    },
  })
  message: { path: string; constraints: { [type: string]: string } }[];
}
