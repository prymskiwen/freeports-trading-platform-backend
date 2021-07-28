import { Controller, UseGuards, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import JwtTwoFactorGuard from '../auth/guard/jwt-two-factor.guard';
import { UserDocument } from 'src/schema/user/user.schema';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { GetDeskResponseDto } from './dto/get-desk-response.dto';
import { DeskService } from './desk.service';
import { DeskMapper } from './mapper/desk.mapper';
import { ApiPaginationResponse } from 'src/pagination/api-pagination-response.decorador';
import { PaginationParams } from 'src/pagination/pagination-params.decorator';
import { PaginationRequest } from 'src/pagination/pagination-request.interface';
import { PaginationResponseDto } from 'src/pagination/pagination-response.dto';
import { PaginationHelper } from 'src/pagination/pagination.helper';
import { DeskDocument } from 'src/schema/desk/desk.schema';

@UseGuards(JwtTwoFactorGuard)
@Controller('api/v1/my/desk')
@ApiTags('desk', 'my')
@ApiBearerAuth()
export class DeskMyController {
  constructor(private readonly deskService: DeskService) {}

  @Get()
  @ApiOperation({ summary: 'Get desk list a user has access to' })
  @ApiPaginationResponse(GetDeskResponseDto)
  async getDesks(
    @PaginationParams() pagination: PaginationRequest,
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<PaginationResponseDto<GetDeskResponseDto>> {
    const [
      { paginatedResult, totalResult },
    ] = await this.deskService.getMyDesksPaginated(pagination, userCurrent);
    const deskDtos: GetDeskResponseDto[] = await Promise.all(
      paginatedResult.map(
        async (desk: DeskDocument): Promise<GetDeskResponseDto> => {
          const deskHydrated = this.deskService.hydrate(desk);
          const deskDto = DeskMapper.toGetDto(deskHydrated);

          return deskDto;
        },
      ),
    );

    return PaginationHelper.of(
      pagination,
      totalResult[0]?.total || 0,
      deskDtos,
    );
  }
}
