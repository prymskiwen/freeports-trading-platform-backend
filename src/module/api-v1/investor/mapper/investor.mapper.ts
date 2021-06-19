import { InvestorDocument } from 'src/schema/investor/investor.schema';
import { GetInvestorDetailsResponseDto } from '../dto/get-investor-details-response.dto';
import { GetInvestorResponseDto } from '../dto/get-investor-response.dto';
import { DeleteInvestorResponseDto } from '../dto/delete-investor-response.dto';
import { UpdateInvestorResponseDto } from '../dto/update-investor-response.dto';
import { CreateInvestorResponseDto } from '../dto/create-investor-response.dto';

export class InvestorMapper {
  public static toCreateDto(
    document: InvestorDocument,
  ): CreateInvestorResponseDto {
    const dto = new CreateInvestorResponseDto();

    dto.id = document.id;

    return dto;
  }

  public static toUpdateDto(
    document: InvestorDocument,
  ): UpdateInvestorResponseDto {
    const dto = new UpdateInvestorResponseDto();

    dto.id = document.id;

    return dto;
  }

  public static toDeleteDto(
    document: InvestorDocument,
  ): DeleteInvestorResponseDto {
    const dto = new DeleteInvestorResponseDto();

    dto.id = document.id;

    return dto;
  }

  public static toGetDto(document: InvestorDocument): GetInvestorResponseDto {
    const dto = new GetInvestorResponseDto();

    dto.id = document.id;
    dto.name = document.name;

    return dto;
  }

  public static toGetDetailsDto(
    document: InvestorDocument,
  ): GetInvestorDetailsResponseDto {
    const dto = new GetInvestorDetailsResponseDto();

    dto.id = document.id;
    dto.name = document.name;
    dto.accounts = document.accounts;

    return dto;
  }
}
