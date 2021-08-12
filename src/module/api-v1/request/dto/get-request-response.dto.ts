import { RequestStatus } from 'src/schema/request/request.schema';

export class GetRequestResponseDto {
  id: string;
  friendlyId: string;
  quantity: string;
  status: RequestStatus;
  createdAt: Date;
}
