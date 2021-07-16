import { Controller, UseGuards, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ExceptionDto } from 'src/exeption/dto/exception.dto';
import JwtTwoFactorGuard from '../auth/guard/jwt-two-factor.guard';
import { UserDocument } from 'src/schema/user/user.schema';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { GetInvestorResponseDto } from './dto/get-investor-response.dto';
import { InvestorService } from './investor.service';
import { InvestorMapper } from './mapper/investor.mapper';

@UseGuards(JwtTwoFactorGuard)
@Controller('api/v1/my/investor')
@ApiTags('investor', 'my')
@ApiBearerAuth()
export class InvestorMyController {
  constructor(private readonly investorService: InvestorService) {}

  @Get()
  @ApiOperation({ summary: 'Get investor list a user has access to' })
  @ApiOkResponse({ type: [GetInvestorResponseDto] })
  @ApiUnauthorizedResponse({
    description: 'Not authenticated',
    type: ExceptionDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ExceptionDto,
  })
  async getUserInvestorList(
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<GetInvestorResponseDto[]> {
    return (
      await this.investorService.getMyInvestorList(userCurrent)
    ).map((investor) => InvestorMapper.toGetDto(investor));
  }
}
