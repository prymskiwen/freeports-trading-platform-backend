class VaultUser {
  id: string;
  publicKey: string;
}

export class GetVaultUsersResponseDto {
  users: VaultUser[];
}
