import { DeskDocument } from 'src/schema/desk/desk.schema';
import { CreateDeskResponseDto } from '../dto/create-desk-response.dto';
import { DeleteDeskResponseDto } from '../dto/delete-desk-response.dto';
import { GetDeskDetailsResponseDto } from '../dto/get-desk-details-response.dto';
import { GetDeskResponseDto } from '../dto/get-desk-response.dto';
import { UpdateDeskResponseDto } from '../dto/update-desk-response.dto';

export class DeskMapper {
  public static toCreateDto(document: DeskDocument): CreateDeskResponseDto {
    const dto = new CreateDeskResponseDto();

    dto.id = document.id;

    return dto;
  }

  public static toUpdateDto(document: DeskDocument): UpdateDeskResponseDto {
    const dto = new UpdateDeskResponseDto();

    dto.id = document.id;

    return dto;
  }

  public static toDeleteDto(document: DeskDocument): DeleteDeskResponseDto {
    const dto = new DeleteDeskResponseDto();

    dto.id = document.id;

    return dto;
  }

  public static toGetDto(document: DeskDocument): GetDeskResponseDto {
    const dto = new GetDeskResponseDto();

    dto.id = document._id;
    dto.name = document.name;
    dto.investors = document.investors?.length;
    dto.coworkers = 0;
    dto.value = 0;
    dto.createdAt = document.createdAt;

    return dto;
  }

  public static toGetDetailsDto(
    document: DeskDocument,
  ): GetDeskDetailsResponseDto {
    const dto = Object.assign(
      new GetDeskDetailsResponseDto(),
      this.toGetDto(document),
    );

    return dto;
  }
}
