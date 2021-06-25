import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  Get,
  BadRequestException,
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
import { ParseObjectIdPipe } from 'src/pipe/parse-objectid.pipe';
import { UserDocument } from 'src/schema/user/user.schema';
import { AccountService } from '../account/account.service';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import JwtTwoFactorGuard from '../auth/guard/jwt-two-factor.guard';
import { PermissionsGuard } from '../auth/guard/permissions.guard';
import { CreateOperationRequestDto } from './dto/create-operation-request.dto';
import { CreateOperationResponseDto } from './dto/create-operation-response.dto';
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
  ){}

  
  @Post()
  @ApiOperation({ summary: 'Create new operation'})
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
    const account_from = await this.accountService.getAccountClearerById(request.accountFrom);
    
    const operation = await this.operationService.createOperation(request, account, account_from, userCurrent);
    console.log(operation);
    return OperationMapper.toCreateDto(operation);
  }

  // @Get()
  // @ApiOperation({ summary: 'Get All operations' })
  // @ApiOkResponse({type: CreateOperationResponseDto})
  // @ApiUnprocessableEntityResponse({
  //   description: 'Invalid Id',
  //   type: ExceptionDto,
  // })
  // @ApiInternalServerErrorResponse({
  //   description: 'Server error',
  //   type: ExceptionDto,
  // })
  // async getAllOperations(
  //   @Param('accountId', ParseObjectIdPipe) accountId: string,
  // ): Promise<CreateOperationResponseDto> {

  // }

  // @Get('/:operationId')
  // @ApiOperation({
  //   summary: 'Get account operation'
  // })
  // @ApiOkResponse({type: CreateOperationResponseDto})
  // @ApiUnprocessableEntityResponse({
  //   description: 'Invalid Id',
  //   type: ExceptionDto,
  // })
  // @ApiInternalServerErrorResponse({
  //   description: 'Server error',
  //   type: ExceptionDto,
  // })
  // async getOperation(
  //   @Param('accountId' , ParseObjectIdPipe) accountId: string,
  //   @Param('operationId', ParseObjectIdPipe) operationId: string,
  // ): Promise<CreateOperationResponseDto> {
  //   // const account = await this.accountService.getAccountClearerById(accountId);

  //   // return OperationMapper.toCreateDto(account);
  // }

}