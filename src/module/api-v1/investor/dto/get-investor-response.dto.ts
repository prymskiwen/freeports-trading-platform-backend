import { Desk } from 'src/schema/desk/desk.schema';

export class GetInvestorResponseDto {
  id: string;
  desk: Desk;
  name: string;
}
