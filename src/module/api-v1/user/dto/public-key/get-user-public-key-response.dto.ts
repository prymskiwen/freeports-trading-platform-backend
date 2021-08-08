import { UserPublicKeyStatus } from 'src/schema/user/embedded/user-public-key.embedded';

export class GetUserPublicKeyResponseDto {
  id: string;
  key: string;
  status: UserPublicKeyStatus;
}
