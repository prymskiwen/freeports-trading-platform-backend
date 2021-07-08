import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  Get,
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
import { UpdateOrganizationResponseDto } from '../organization/dto/update-organization-response.dto';
import { CreateOperationRequestDto } from './dto/create-operation-request.dto';
import { CreateOperationResponseDto } from './dto/create-operation-response.dto';
import { DeleteOperationResponseDto } from './dto/delet-operation-response.dto';
import { GetOperationResponseDto } from './dto/get-operation-response.dto';
import { UpdateOperationRequestDto } from './dto/update-operation-request.dto';
import { OperationMapper } from './mapper/operation.mapper';
import { OperationService } from './operation.service';

@UseGuards(JwtTwoFactorGuard, PermissionsGuard)
@Controller('api/v1/account/:accountId/operation')
@ApiTags('operation')
@ApiBearerAuth()
export class OperationController {
  constructor(
    private readonly operationService: OperationService,
    private readonly accountService: AccountService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create new operation' })
  @ApiCreatedResponse({
    description: 'Succesfully created clearer account operation',
    type: CreateOperationResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalide form',
    type: InvalidFormExceptionDto,
  })
  async createOperationclearer(
    @Param('accountId', ParseObjectIdPipe) accountId: string,
    @Body() request: CreateOperationRequestDto,
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<CreateOperationResponseDto> {
    const account = await this.accountService.getAccountClearerById(accountId);
    const account_from = await this.accountService.getAccountClearerById(
      request.accountFrom,
    );
    const operation = await this.operationService.createOperation(
      request,
      account,
      account_from,
      userCurrent,
    );

    return OperationMapper.toCreateDto(operation);
  }

  @Get()
  @ApiOperation({ summary: 'Get All operations' })
  @ApiPaginationResponse(GetOperationResponseDto)
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  async getAllOperations(
    @Param('accountId', ParseObjectIdPipe) accountId: string,
    @PaginationParams() pagination: PaginationRequest,
  ): Promise<PaginationResponseDto<GetOperationResponseDto>> {
    const account = await this.accountService.getAccountClearerById(accountId);
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
      totalResult[0]?.total || 0,
      operationDtos,
    );
  }

  @Get(':operationId')
  @ApiOperation({
    summary: 'Get account operation',
  })
  @ApiOkResponse({ type: GetOperationResponseDto })
  @ApiUnprocessableEntityResponse({
    description: 'Invalid Id',
    type: ExceptionDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error',
    type: ExceptionDto,
  })
  async getOperation(
    @Param('accountId', ParseObjectIdPipe) accountId: string,
    @Param('operationId', ParseObjectIdPipe) operationId: string,
  ): Promise<GetOperationResponseDto> {
    const account = await this.accountService.getAccountClearerById(accountId);
    const operation = await this.operationService.getOperationWithAccount(
      account,
      operationId,
    );

    return OperationMapper.toGetDto(operation);
  }

  @Put(':operationId')
  @ApiOkResponse({ type: UpdateOrganizationResponseDto })
  @ApiCreatedResponse({
    description: 'Succesfully created clearer account operation',
    type: UpdateOrganizationResponseDto,
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
    @Param('operationId', ParseObjectIdPipe) operationId: string,
    @Body() request: UpdateOperationRequestDto,
  ): Promise<UpdateOrganizationResponseDto> {
    const operation = await this.operationService.getOperationById(operationId);
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
  async deletOperation(
    @Param('operationId', ParseObjectIdPipe) operationId: string,
  ): Promise<DeleteOperationResponseDto> {
    const operation = await this.operationService.getOperationById(operationId);

    if (!operation) {
      throw new NotFoundException();
    }

    await operation.remove();

    return OperationMapper.toDeleteDto(operation);
  }
}
