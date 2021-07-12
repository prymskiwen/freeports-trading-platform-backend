import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  NotFoundException,
  Patch,
  Get,
  Delete,
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
import { ParseObjectIdPipe } from 'src/pipe/parse-objectid.pipe';
import { CreateDeskResponseDto } from './dto/create-desk-response.dto';
import { CreateDeskRequestDto } from './dto/create-desk-request.dto';
import { Permissions } from '../auth/decorator/permissions.decorator';
import { PermissionsGuard } from '../auth/guard/permissions.guard';
import { DeskService } from './desk.service';
import { OrganizationService } from '../organization/organization.service';
import { DeskMapper } from './mapper/desk.mapper';
import JwtTwoFactorGuard from '../auth/guard/jwt-two-factor.guard';
import { PermissionOrganization } from 'src/schema/role/permission.helper';
import { UpdateDeskRequestDto } from './dto/update-desk-request.dto';
import { UpdateDeskResponseDto } from './dto/update-desk-response.dto';
import { GetDeskDetailsResponseDto } from './dto/get-desk-details-response.dto';
import { ApiPaginationResponse } from 'src/pagination/api-pagination-response.decorador';
import { GetDeskResponseDto } from './dto/get-desk-response.dto';
import { PaginationRequest } from 'src/pagination/pagination-request.interface';
import { PaginationResponseDto } from 'src/pagination/pagination-response.dto';
import { PaginationParams } from 'src/pagination/pagination-params.decorator';
import { DeskDocument } from 'src/schema/desk/desk.schema';
import { PaginationHelper } from 'src/pagination/pagination.helper';
import { DeleteDeskResponseDto } from './dto/delete-desk-response.dto';

@UseGuards(JwtTwoFactorGuard, PermissionsGuard)
@Controller('api/v1/organization/:organizationId/desk')
@ApiTags('organization', 'desk')
@ApiBearerAuth()
export class DeskController {
  constructor(
    private readonly deskService: DeskService,
    private readonly organizationService: OrganizationService,
  ) {}

  @Get()
  @Permissions(PermissionOrganization.deskRead)
  @ApiOperation({ summary: 'Get desk list' })
  @ApiPaginationResponse(GetDeskResponseDto)
  async getDesks(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @PaginationParams() pagination: PaginationRequest,
  ): Promise<PaginationResponseDto<GetDeskResponseDto>> {
    const organization = await this.organizationService.getById(organizationId);

    if (!organization) {
      throw new NotFoundException();
    }

    const [
      { paginatedResult, totalResult },
    ] = await this.deskService.getDesksPaginated(organization, pagination);
    const deskDtos: GetDeskResponseDto[] = await Promise.all(
      paginatedResult.map(
        async (desk: DeskDocument): Promise<GetDeskResponseDto> =>
          DeskMapper.toGetDto(this.deskService.hydrate(desk)),
      ),
    );

    return PaginationHelper.of(
      pagination,
      totalResult[0]?.total || 0,
      deskDtos,
    );
  }

  @Get(':deskId')
  @Permissions(PermissionOrganization.deskRead)
  @ApiOperation({ summary: 'Get desk details' })
  @ApiOkResponse({ type: GetDeskDetailsResponseDto })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Desk has not been found',
    type: ExceptionDto,
  })
  async getDesk(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
  ): Promise<GetDeskDetailsResponseDto> {
    const organization = await this.organizationService.getById(organizationId);
    const desk = await this.deskService.getById(deskId);

    if (
      !organization ||
      !desk ||
      desk.organization.toString() !== organization.id
    ) {
      throw new NotFoundException();
    }

    return DeskMapper.toGetDetailsDto(desk);
  }

  @Post()
  @Permissions(PermissionOrganization.deskCreate)
  @ApiOperation({ summary: 'Create desk' })
  @ApiCreatedResponse({
    description: 'Successfully created desk id',
    type: CreateDeskResponseDto,
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
  async createDesk(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Body() request: CreateDeskRequestDto,
  ): Promise<CreateDeskResponseDto> {
    const organization = await this.organizationService.getById(organizationId);

    if (!organization) {
      throw new NotFoundException();
    }

    const desk = await this.deskService.create(organization, request);

    return DeskMapper.toCreateDto(desk);
  }

  @Patch(':deskId')
  @Permissions(PermissionOrganization.deskUpdate)
  @ApiOperation({ summary: 'Update desk' })
  @ApiOkResponse({
    description: 'Successfully updated desk id',
    type: CreateDeskResponseDto,
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
    description: 'Desk has not been found',
    type: ExceptionDto,
  })
  async updateDesk(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Body() request: UpdateDeskRequestDto,
  ): Promise<UpdateDeskResponseDto> {
    const organization = await this.organizationService.getById(organizationId);
    const desk = await this.deskService.getById(deskId);

    if (
      !organization ||
      !desk ||
      desk.organization.toString() !== organization.id
    ) {
      throw new NotFoundException();
    }

    await this.deskService.update(desk, request);

    return DeskMapper.toUpdateDto(desk);
  }

  @Delete(':deskId')
  @Permissions(PermissionOrganization.deskDelete)
  @ApiOperation({ summary: 'Delete desk' })
  @ApiOkResponse({
    description: 'Successfully deleted desk id',
    type: DeleteDeskResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Impossible delete desk with investors',
    type: InvalidFormExceptionDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Desk has not been found',
    type: ExceptionDto,
  })
  async deleteDesk(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
  ): Promise<DeleteDeskResponseDto> {
    const organization = await this.organizationService.getById(organizationId);
    const desk = await this.deskService.getById(deskId);

    if (
      !organization ||
      !desk ||
      desk.organization.toString() !== organization.id
    ) {
      throw new NotFoundException();
    }

    if (desk.investors?.length) {
      throw new BadRequestException('Impossible delete desk with investors');
    }

    await desk.remove();

    return DeskMapper.toDeleteDto(desk);
  }
}
