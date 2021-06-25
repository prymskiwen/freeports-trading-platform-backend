export class GetOrganizationResponseDto {
  id: string;
  name: string;
  createdAt: Date;

  commissionOrganization?: number;
  commissionClearer?: number;

  userActive: number;
  userSuspended: number;
}
