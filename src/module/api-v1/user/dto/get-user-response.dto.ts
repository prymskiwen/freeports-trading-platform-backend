import { Organization } from 'src/schema/organization/organization.schema';
import { UserRole } from 'src/schema/user/embedded/user-role.embedded';

export class GetUserResponseDto {
  id: string;
  nickname: string;
  email: string;
  roles: UserRole[];
  jobTitle: string;
  organization: string | Organization;
}
