import { OrganizationDocument } from 'src/schema/organization/organization.schema';
import { CreateOrganizationResponseDto } from '../dto/create-organization-response.dto';
import { GetOrganizationResponseDto } from '../dto/get-organization-response.dto';
import { GetOrganizationDetailsResponseDto } from '../dto/get-organization-details-response.dto';
import { UpdateOrganizationResponseDto } from '../dto/update-organization-response.dto';

export class OrganizationMapper {
  public static toCreateDto(
    document: OrganizationDocument,
  ): CreateOrganizationResponseDto {
    const dto = new CreateOrganizationResponseDto();

    dto.id = document.id;

    return dto;
  }

  public static toUpdateDto(
    document: OrganizationDocument,
  ): UpdateOrganizationResponseDto {
    const dto = new UpdateOrganizationResponseDto();

    dto.id = document.id;

    return dto;
  }

  public static async toGetDto(
    document: OrganizationDocument,
  ): Promise<GetOrganizationResponseDto> {
    const dto = new GetOrganizationResponseDto();

    dto.id = document._id;
    dto.name = document.details.name;
    dto.createdAt = document.createdAt;
    dto.commissionOrganization = document.commissionRatio.organization;
    dto.commissionClearer = document.commissionRatio.clearer;

    await document.populate('users').execPopulate();

    const userSuspendedCount = document.users.reduce(
      (val, u) => val + (u.suspended ? 1 : 0),
      0,
    );

    dto.userActive = document.users.length - userSuspendedCount;
    dto.userSuspended = userSuspendedCount;

    return dto;
  }

  public static async toGetDetailsDto(
    document: OrganizationDocument,
  ): Promise<GetOrganizationDetailsResponseDto> {
    const dto = Object.assign(
      new GetOrganizationDetailsResponseDto(),
      await this.toGetDto(document),
    );

    dto.street = document.details.street;
    dto.street2 = document.details.street2;
    dto.zip = document.details.zip;
    dto.city = document.details.city;
    dto.country = document.details.country;
    dto.logo = document.details.logo;

    dto.clearing = document.clearing;

    return dto;
  }
}
