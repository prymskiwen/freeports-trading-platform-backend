import { ApiProperty } from '@nestjs/swagger';
import { RequestMove } from 'src/schema/request/request-move.schema';
import { RequestKind } from 'src/schema/request/request.schema';
import { GetRequestResponseDto } from './get-request-response.dto';

export class GetRequestOfAccountResponseDto extends GetRequestResponseDto {
  @ApiProperty({
    type: String,
    enum: RequestKind.filter((val) => val !== RequestMove.name),
  })
  kind: string;
}
