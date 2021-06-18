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

  public static toGetDetailsDto(
    document: OrganizationDocument,
    userActive: number,
    userSuspended: number,
  ): GetOrganizationDetailsResponseDto {
    const dto = new GetOrganizationDetailsResponseDto();

    dto.id = document._id;
    dto.name = document.details.name;
    dto.logofile = document.details.logofile;
    dto.createtime = document.details.createtime;
    dto.commission = document.commissionRatio.organization;
    dto.commissionclear = document.commissionRatio.clearer;
    dto.clearing = document.clearing;
    dto.acitveUser = userActive;
    dto.discativeUser = userSuspended;

    return dto;
  }

  public static toGetDto(
    document: OrganizationDocument,
    userActive: number,
    userSuspended: number,
  ): GetOrganizationResponseDto {
    const dto = new GetOrganizationResponseDto();

    dto.id = document._id;
    dto.name = document.details.name;
    dto.createtime = document.details.createtime;
    dto.commission = document.commissionRatio.organization;
    dto.commissionclear = document.commissionRatio.clearer;
    dto.clearing = document.clearing;
    dto.acitveUser = userActive;
    dto.discativeUser = userSuspended;

    return dto;
  }
}
