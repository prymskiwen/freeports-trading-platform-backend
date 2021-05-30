import { DeskDocument } from 'src/schema/desk/desk.schema';
import { CreateDeskResponseDto } from '../dto/create-desk-response.dto';

export class DeskMapper {
  public static toCreateDto(document: DeskDocument): CreateDeskResponseDto {
    const dto = new CreateDeskResponseDto();

    dto.id = document.id;

    return dto;
  }
}
