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
import { GetDeskResponseDto } from './dto/get-desk-response.dto';
import { DeskService } from './desk.service';
import { DeskMapper } from './mapper/desk.mapper';

@UseGuards(JwtTwoFactorGuard)
@Controller('api/v1/my/desk')
@ApiTags('desk', 'my')
@ApiBearerAuth()
export class DeskMyController {
  constructor(private readonly deskService: DeskService) {}

  @Get()
  @ApiOperation({ summary: 'Get desk list a user has access to' })
  @ApiOkResponse({ type: [GetDeskResponseDto] })
  @ApiUnauthorizedResponse({
    description: 'Not authenticated',
    type: ExceptionDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ExceptionDto,
  })
  async getMyDeskList(
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<GetDeskResponseDto[]> {
    return (await this.deskService.getMyDeskList(userCurrent)).map((desk) =>
      DeskMapper.toGetDto(desk),
    );
  }
}
