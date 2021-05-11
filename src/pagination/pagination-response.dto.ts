import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponseDto<T> {
  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  skippedRecords: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  hasNext: boolean;

  @ApiProperty()
  payloadSize: number;

  @ApiProperty()
  totalRecords: number;

  @ApiProperty()
  content: T[];
}
