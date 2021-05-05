import { PartialType } from '@nestjs/swagger';
import { OperationRequest } from 'src/schema/operation-request/operation-request.schema';

export class ReadOperationRequestDto extends PartialType(OperationRequest) {}
