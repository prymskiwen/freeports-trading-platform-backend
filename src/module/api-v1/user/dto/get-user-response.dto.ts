import { Organization } from 'src/schema/organization/organization.schema';

export class GetUserResponseDto {
  id: string;
  organization?: Organization;
  nickname: string;
  email: string;
  phone: string;
  jobTitle: string;
  suspended: boolean;
}
