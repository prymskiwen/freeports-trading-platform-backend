import { OrganizationDocument } from 'src/schema/organization/organization.schema';
import { CreateOrganizationRequestDto } from '../dto/create-organization-request.dto';
import { CreateOrganizationResponseDto } from '../dto/create-organization-response.dto';
import { GetOrganizationResponseDto } from '../dto/get-organization-response.dto';
import { UpdateOrganizationRequestDto } from '../dto/update-organization-request.dto';
import { UpdateOrganizationResponseDto } from '../dto/update-organization-response.dto';

export class OrganizationMapper {
  public static toCreateDto(
    document: OrganizationDocument,
  ): CreateOrganizationResponseDto {
    const dto = new CreateOrganizationResponseDto();

    dto.id = document._id;

    return dto;
  }

  public static toUpdateDto(
    document: OrganizationDocument,
  ): UpdateOrganizationResponseDto {
    const dto = new UpdateOrganizationResponseDto();

    dto.id = document._id;

    return dto;
  }

  public static toGetDto(
    document: OrganizationDocument,
  ): GetOrganizationResponseDto {
    const dto = new GetOrganizationResponseDto();

    dto.id = document._id;
    dto.name = document.details.name;
    dto.commission = document.commissionRatio.organization;

    return dto;
  }

  public static toCreateDocument(
    document: OrganizationDocument,
    dto: CreateOrganizationRequestDto,
  ): OrganizationDocument {
    document.details = {
      name: dto.name,
      street: dto.street,
      street2: dto.street2,
      zip: dto.zip,
      city: dto.city,
      country: dto.country,
    };

    document.commissionRatio = {
      organization: dto.сommission,
    };

    return document;
  }

  public static toUpdateDocument(
    document: OrganizationDocument,
    dto: UpdateOrganizationRequestDto,
  ): OrganizationDocument {
    document.details = {
      name: dto.name,
      street: dto.street,
      street2: dto.street2,
      zip: dto.zip,
      city: dto.city,
      country: dto.country,
    };

    document.commissionRatio = {
      organization: dto.сommission,
    };

    return document;
  }
}
