export class GetOrganizationResponseDto {
  id: string;
  name: string;
  createdAt: Date;

  commissionOrganization?: string;
  commissionClearer?: string;

  userActive: number;
  userSuspended: number;
}
