import {
  Controller,
  Param,
  Post,
  UseGuards,
  Body,
  Delete,
  Get,
  NotFoundException,
  Put,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ExceptionDto } from 'src/exeption/dto/exception.dto';
import { InvalidFormExceptionDto } from 'src/exeption/dto/invalid-form-exception.dto';
import { ApiPaginationResponse } from 'src/pagination/api-pagination-response.decorador';
import { PaginationParams } from 'src/pagination/pagination-params.decorator';
import { PaginationRequest } from 'src/pagination/pagination-request.interface';
import { PaginationResponseDto } from 'src/pagination/pagination-response.dto';
import { PaginationHelper } from 'src/pagination/pagination.helper';
import { ParseObjectIdPipe } from 'src/pipe/parse-objectid.pipe';
import { AccountOperationDocument } from 'src/schema/account-operation/account-operation.schema';
import { UserDocument } from 'src/schema/user/user.schema';
import { AccountService } from '../account/account.service';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import JwtTwoFactorGuard from '../auth/guard/jwt-two-factor.guard';
import { PermissionsGuard } from '../auth/guard/permissions.guard';
import { DeskService } from '../desk/desk.service';
import { InvestorService } from '../investor/investor.service';
import { CreateOrganizationRequestDto } from '../organization/dto/create-organization-request.dto';
import { OrganizationService } from '../organization/organization.service';
import { CreateOperationRequestDto } from './dto/create-operation-request.dto';
import { CreateOperationResponseDto } from './dto/create-operation-response.dto';
import { DeleteOperationResponseDto } from './dto/delet-operation-response.dto';
import { GetOperationResponseDto } from './dto/get-operation-response.dto';
import { UpdateOperationRequestDto } from './dto/update-operation-request.dto';
import { UpdateOperationResponseDto } from './dto/update-operation-response.dto';
import { OperationMapper } from './mapper/operation.mapper';
import { OperationService } from './operation.service';

@UseGuards(JwtTwoFactorGuard, PermissionsGuard)
@Controller(
  'api/v1/organization/:organizationId/desk/:deskId/investor/:investorId/account/:accountId/operation',
)
@ApiTags('investor')
@ApiBearerAuth()
export class OperationInvestorController {
  constructor(
    private readonly deskService: DeskService,
    private readonly organizationService: OrganizationService,
    private readonly operationService: OperationService,
    private readonly accountService: AccountService,
    private readonly investorService: InvestorService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create Investor Account Operation' })
  @ApiCreatedResponse({
    description: 'Successfully assigned to investor account operation',
    type: CreateOrganizationRequestDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid Form',
    type: InvalidFormExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Investor has not been found',
    type: ExceptionDto,
  })
  async createOperation(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Param('accountId', ParseObjectIdPipe) accountId: string,
    @Param('investorId', ParseObjectIdPipe) investorId: string,
    @Body() request: CreateOperationRequestDto,
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<CreateOperationResponseDto> {
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
    const account = await this.accountService.getAccountInvestorById(
      accountId,
      investor,
    );

    const operation = await this.operationService.createOperation(
      request,
      account,
      userCurrent,
    );

    return OperationMapper.toCreateDto(operation);
  }

  @Get()
  @ApiOperation({ summary: 'Get Investor Account Operations' })
  @ApiPaginationResponse(GetOperationResponseDto)
  async getOperations(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Param('accountId', ParseObjectIdPipe) accountId: string,
    @Param('investorId', ParseObjectIdPipe) investorId: string,
    @PaginationParams() pagination: PaginationRequest,
  ): Promise<PaginationResponseDto<GetOperationResponseDto>> {
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
    const account = await this.accountService.getAccountInvestorById(
      accountId,
      investor,
    );
    const [
      { paginatedResult, totalResult },
    ] = await this.operationService.getOperationPaginated(account, pagination);
    const operationDtos: GetOperationResponseDto[] = await Promise.all(
      paginatedResult.map(
        async (
          operation: AccountOperationDocument,
        ): Promise<GetOperationResponseDto> =>
          OperationMapper.toGetDto(operation),
      ),
    );

    return PaginationHelper.of(
      pagination,
      totalResult[0].total || 0,
      operationDtos,
    );
  }

  @Get(':operationId')
  @ApiOperation({ summary: 'Get Operation' })
  @ApiOkResponse({ type: GetOperationResponseDto })
  @ApiUnprocessableEntityResponse({
    description: 'Invalide Id',
    type: ExceptionDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalide Id',
    type: ExceptionDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ExceptionDto,
  })
  async getOperation(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Param('accountId', ParseObjectIdPipe) accountId: string,
    @Param('investorId', ParseObjectIdPipe) investorId: string,
    @Param('operationId', ParseObjectIdPipe) operationId: string,
  ): Promise<any> {
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
    const account = await this.accountService.getAccountInvestorById(
      accountId,
      investor,
    );
    const operation = await this.operationService.getOperationWithAccount(
      account,
      operationId,
    );

    return OperationMapper.toGetDto(operation);
  }

  @Put(':operationId')
  @ApiOkResponse({ type: UpdateOperationResponseDto })
  @ApiCreatedResponse({
    description: 'SuccessFully updated account',
    type: UpdateOperationResponseDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Operation has not been found',
    type: ExceptionDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalide form',
    type: InvalidFormExceptionDto,
  })
  async updateOperation(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Param('accountId', ParseObjectIdPipe) accountId: string,
    @Param('investorId', ParseObjectIdPipe) investorId: string,
    @Param('operationId', ParseObjectIdPipe) operationId: string,
    @Body() request: UpdateOperationRequestDto,
  ): Promise<UpdateOperationResponseDto> {
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
    const account = await this.accountService.getAccountInvestorById(
      accountId,
      investor,
    );
    const operation = await this.operationService.getOperationWithAccount(
      account,
      operationId,
    );
    const updatedOperation = await this.operationService.updateOperation(
      operation,
      request,
    );

    return OperationMapper.toUpdateDto(updatedOperation);
  }

  @Delete(':operationId')
  @ApiOperation({ summary: 'Delete Operatioin' })
  @ApiOkResponse({
    description: 'Successfully deleted investor Id',
    type: DeleteOperationResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Impossible delete operation with this id',
    type: InvalidFormExceptionDto,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Invalide Id',
    type: ExceptionDto,
  })
  @ApiNotFoundResponse({
    description: 'Operation has not been found',
    type: ExceptionDto,
  })
  async deleteOperation(
    @Param('organizationId', ParseObjectIdPipe) organizationId: string,
    @Param('deskId', ParseObjectIdPipe) deskId: string,
    @Param('accountId', ParseObjectIdPipe) accountId: string,
    @Param('investorId', ParseObjectIdPipe) investorId: string,
    @Param('operationId', ParseObjectIdPipe) operationId: string,
  ): Promise<any> {
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
    const account = await this.accountService.getAccountInvestorById(
      accountId,
      investor,
    );
    const operation = await this.operationService.getOperationWithAccount(
      account._id,
      operationId,
    );
    if (!operation) {
      throw new NotFoundException();
    }

    await operation.remove();

    return OperationMapper.toDeleteDto(operation);
  }
}
