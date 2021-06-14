import { OrganizationDocument } from 'src/schema/organization/organization.schema';
import { CreateOrganizationResponseDto } from '../dto/create-organization-response.dto';
import { GetOrganizationResponseDto } from '../dto/get-organization-response.dto';
import { GetOrganizationSingleResponseDto } from '../dto/get-organizationsingle-response.dto';
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

  public static toGetsignDto(
    document: OrganizationDocument,
  ): GetOrganizationSingleResponseDto {
    const dto = new GetOrganizationSingleResponseDto();

    dto.id = document._id;
    dto.name = document.details.name;
    dto.logofile = document.details.logofile;
    dto.commission = document.commissionRatio.organization;
    dto.commissionclear = document.commissionRatio.clearer;
    dto.clearing = document.clearing;

    return dto;
  }

  public static toGetDto(
    document: OrganizationDocument,
  ): GetOrganizationResponseDto {
    const dto = new GetOrganizationResponseDto();
  
    dto.id = document._id;
    dto.name = document.details.name;
    dto.commission = document.commissionRatio.organization;
    dto.commissionclear = document.commissionRatio.clearer;
    dto.clearing = document.clearing;

    return dto;
  }
}
