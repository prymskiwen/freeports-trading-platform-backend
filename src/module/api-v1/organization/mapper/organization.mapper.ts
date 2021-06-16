import { OrganizationDocument } from 'src/schema/organization/organization.schema';
import { CreateOrganizationResponseDto } from '../dto/create-organization-response.dto';
import { GetOrganizationResponseDto } from '../dto/get-organization-response.dto';
import { GetOrganizationSingleResponseDto } from '../dto/get-organizationsingle-response.dto';
import { UpdateOrganizationResponseDto } from '../dto/update-organization-response.dto';
import { UserService } from '../../user/user.service';


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
    acitveUser: number,
    discativeUser: number,
  ): GetOrganizationSingleResponseDto {
    const dto = new GetOrganizationSingleResponseDto();
    dto.id = document._id;
    dto.name = document.details.name;
    dto.logofile = document.details.logofile;
    dto.createtime = document.details.createtime;
    dto.commission = document.commissionRatio.organization;
    dto.commissionclear = document.commissionRatio.clearer;
    dto.clearing = document.clearing;
    dto.acitveUser = acitveUser;
    dto.discativeUser = discativeUser;

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
    dto.acitveUser = 0;
    dto.discativeUser = 0;

    return dto;
  }

}
