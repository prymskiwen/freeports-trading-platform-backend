import { Controller, UseGuards, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import JwtTwoFactorGuard from '../auth/guard/jwt-two-factor.guard';
import { UserDocument } from 'src/schema/user/user.schema';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { GetInvestorResponseDto } from './dto/get-investor-response.dto';
import { InvestorService } from './investor.service';
import { InvestorMapper } from './mapper/investor.mapper';
import { ApiPaginationResponse } from 'src/pagination/api-pagination-response.decorador';
import { PaginationParams } from 'src/pagination/pagination-params.decorator';
import { PaginationRequest } from 'src/pagination/pagination-request.interface';
import { PaginationResponseDto } from 'src/pagination/pagination-response.dto';
import { InvestorDocument } from 'src/schema/investor/investor.schema';
import { PaginationHelper } from 'src/pagination/pagination.helper';

@UseGuards(JwtTwoFactorGuard)
@Controller('api/v1/my/investor')
@ApiTags('investor', 'my')
@ApiBearerAuth()
export class InvestorMyController {
  constructor(private readonly investorService: InvestorService) {}

  @Get()
  @ApiOperation({ summary: 'Get investor list a user has access to' })
  @ApiPaginationResponse(GetInvestorResponseDto)
  async getInvestors(
    @PaginationParams() pagination: PaginationRequest,
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<PaginationResponseDto<GetInvestorResponseDto>> {
    const [
      { paginatedResult, totalResult },
    ] = await this.investorService.getMyInvestorsPaginated(
      pagination,
      userCurrent,
    );
    const investorDtos: GetInvestorResponseDto[] = await Promise.all(
      paginatedResult.map(
        async (investor: InvestorDocument): Promise<GetInvestorResponseDto> => {
          const investorHydrated = this.investorService.hydrate(investor);
          const investorDto = InvestorMapper.toGetDto(investorHydrated);

          return investorDto;
        },
      ),
    );

    return PaginationHelper.of(
      pagination,
      totalResult[0]?.total || 0,
      investorDtos,
    );
  }
}
