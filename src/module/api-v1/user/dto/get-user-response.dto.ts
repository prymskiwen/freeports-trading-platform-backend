import { UserRole } from 'src/schema/user/embedded/user-role.embedded';

export class GetUserResponseDto {
  id: string;
  nickname: string;
  email: string;
  roles: UserRole[];
  jobTitle: string;
}
