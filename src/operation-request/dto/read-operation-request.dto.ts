import { PartialType } from '@nestjs/swagger';
import { OperationRequest } from '../schema/operation-request.schema';

export class ReadOperationRequestDto extends PartialType(OperationRequest) {}
