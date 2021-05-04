import { PartialType } from '@nestjs/swagger';
import { CreateOperationRequestDto } from './create-operation-request.dto';

export class UpdateOperationRequestDto extends PartialType(
  CreateOperationRequestDto,
) {}
