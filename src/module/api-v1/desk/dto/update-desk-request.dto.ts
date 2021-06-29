import { PartialType } from '@nestjs/swagger';
import { CreateDeskRequestDto } from './create-desk-request.dto';

export class UpdateDeskRequestDto extends PartialType(CreateDeskRequestDto) {}
