import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  Get,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ExceptionDto } from 'src/exeption/dto/exception.dto';
import { InvalidFormExceptionDto } from 'src/exeption/dto/invalid-form-exception.dto';
import { InvestorService } from './investor.service';
import { ParseObjectIdPipe } from 'src/pipe/parse-objectid.pipe';
import JwtTwoFactorGuard from '../auth/guard/jwt-two-factor.guard';
import { UserDocument } from 'src/schema/user/user.schema';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { Permissions } from '../auth/decorator/permissions.decorator';
import { PermissionsGuard } from '../auth/guard/permissions.guard';
import { OrganizationService } from '../organization/organization.service';
import { InvestorMapper } from './mapper/investor.mapper';
import { PermissionDesk } from 'src/schema/role/permission.helper';
import { GetInvestorResponseDto } from './dto/get-investor-response.dto';
import { GetInvestorDetailsResponseDto } from './dto/get-investor-details-response.dto';
import { CreateInvestorResponseDto } from './dto/create-investor-response.dto';
import { CreateInvestorRequestDto } from './dto/create-investor-request.dto';
import { UpdateInvestorResponseDto } from './dto/update-investor-response.dto';
import { UpdateInvestorRequestDto } from './dto/update-investor-request.dto';
import { DeleteInvestorResponseDto } from './dto/delete-investor-response.dto';
import { DeskService } from '../desk/desk.service';
import { ApiPaginationResponse } from 'src/pagination/api-pagination-response.decorador';
import { PaginationResponseDto } from 'src/pagination/pagination-response.dto';
import { PaginationHelper } from 'src/pagination/pagination.helper';
import { PaginationParams } from 'src/pagination/pagination-params.decorator';
import { PaginationRequest } from 'src/pagination/pagination-request.interface';
import { InvestorDocument } from 'src/schema/investor/investor.schema';

@UseGuards(JwtTwoFactorGuard, PermissionsGuard)
@Controller('api/v1/organization/:organizationId/desk/:deskId/investor')
@ApiTags('investor')
@ApiBearerAuth()
export class InvestorController {
  constructor(
    private readonly deskService: DeskService,
    private readonly investorService: InvestorService,
    private readonly organizationService: OrganizationService,
  ) {}

  @Get()
  @Permissions(PermissionDesk.investorRead)
  @ApiOperation({ summary: 'Get investor list' })
  @ApiPaginationResponse(GetInvestorResponseDto)
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Organization has not been found',
    type: ExceptionDto,
  })
  async getInvestorList(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @PaginationParams() pagination: PaginationRequest,
  ): Promise<PaginationResponseDto<GetInvestorResponseDto>> {
    const organization = await this.organizationService.getById(organizationId);
    const desk = await this.deskService.getById(deskId);

    if (
      !organization ||
      !desk ||
      desk.organization.toString() !== organization.id
    ) {
      throw new NotFoundException();
    }

    const [
      { paginatedResult, totalResult },
    ] = await this.investorService.getInvestorsPaginated(desk, pagination);
    const investorDtos: GetInvestorResponseDto[] = await Promise.all(
      paginatedResult.map(
        async (investor: InvestorDocument): Promise<GetInvestorResponseDto> => {
          const investorHydrated = this.investorService.hydrate(investor);
          const deskDto = InvestorMapper.toGetDto(investorHydrated);

          return deskDto;
        },
      ),
    );

    return PaginationHelper.of(
      pagination,
      totalResult[0]?.total || 0,
      investorDtos,
    );
  }

  @Get(':investorId')
  @Permissions(PermissionDesk.investorRead)
  @ApiOperation({ summary: 'Get investor' })
  @ApiOkResponse({ type: GetInvestorDetailsResponseDto })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Investor has not been found',
    type: ExceptionDto,
  })
  async getInvestor(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Param('investorId', ParseObjectIdPipe) investorId: string,
  ): Promise<GetInvestorDetailsResponseDto> {
    const organization = await this.organizationService.getById(organizationId);
    const desk = await this.deskService.getById(deskId);

    if (
      !organization ||
      !desk ||
      desk.organization.toString() !== organization.id
    ) {
      throw new NotFoundException();
    }

    const investor = await this.investorService.getInvestorById(
      investorId,
      desk,
    );

    return InvestorMapper.toGetDetailsDto(investor);
  }

  @Post()
  @Permissions(PermissionDesk.investorCreate)
  @ApiOperation({ summary: 'Create investor' })
  @ApiCreatedResponse({
    description: 'Successfully created investor id',
    type: CreateInvestorResponseDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid form',
    type: InvalidFormExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Organization has not been found',
    type: ExceptionDto,
  })
  async createInvestor(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Body() request: CreateInvestorRequestDto,
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<CreateInvestorResponseDto> {
    const organization = await this.organizationService.getById(organizationId);
    const desk = await this.deskService.getById(deskId);

    if (
      !organization ||
      !desk ||
      desk.organization.toString() !== organization.id
    ) {
      throw new NotFoundException();
    }

    const investor = await this.investorService.createInvestor(
      desk,
      request,
      userCurrent,
    );
    await desk.updateOne({ $push: { investors: investor._id } });

    return InvestorMapper.toCreateDto(investor);
  }

  @Patch(':investorId')
  @Permissions(PermissionDesk.investorUpdate)
  @ApiOperation({ summary: 'Update investor' })
  @ApiOkResponse({
    description: 'Successfully updated investor id',
    type: UpdateInvestorResponseDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid form',
    type: InvalidFormExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Investor has not been found',
    type: ExceptionDto,
  })
  async updateInvestor(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Param('investorId', ParseObjectIdPipe) investorId: string,
    @Body() request: UpdateInvestorRequestDto,
  ): Promise<UpdateInvestorResponseDto> {
    const organization = await this.organizationService.getById(organizationId);
    const desk = await this.deskService.getById(deskId);

    if (
      !organization ||
      !desk ||
      desk.organization.toString() !== organization.id
    ) {
      throw new NotFoundException();
    }

    const investor = await this.investorService.getInvestorById(
      investorId,
      desk,
    );

    if (!investor) {
      throw new NotFoundException();
    }

    await this.investorService.updateInvestor(investor, request);

    return InvestorMapper.toUpdateDto(investor);
  }

  @Delete(':investorId')
  @Permissions(PermissionDesk.investorDelete)
  @ApiOperation({ summary: 'Delete investor' })
  @ApiOkResponse({
    description: 'Successfully deleted investor id',
    type: DeleteInvestorResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Impossible delete investor with accounts or requests',
    type: InvalidFormExceptionDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Investor has not been found',
    type: ExceptionDto,
  })
  async deleteInvestor(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Param('investorId', ParseObjectIdPipe) investorId: string,
  ): Promise<DeleteInvestorResponseDto> {
    const organization = await this.organizationService.getById(organizationId);
    const desk = await this.deskService.getById(deskId);

    if (
      !organization ||
      !desk ||
      desk.organization.toString() !== organization.id
    ) {
      throw new NotFoundException();
    }

    const investor = await this.investorService.getInvestorById(
      investorId,
      desk,
    );

    if (!investor) {
      throw new NotFoundException();
    }

    if (investor.accounts?.length) {
      throw new BadRequestException('Impossible delete investor with accounts');
    }

    if (investor.requests?.length) {
      throw new BadRequestException('Impossible delete investor with requests');
    }

    await investor.remove();
    await desk.updateOne({ $pull: { investors: investor._id } });

    return InvestorMapper.toDeleteDto(investor);
  }
}
