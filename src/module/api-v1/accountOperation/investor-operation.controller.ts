import { Body, Get } from '@nestjs/common';
import {
  Controller, Param, Post, UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ExceptionDto } from 'src/exeption/dto/exception.dto';
import { InvalidFormExceptionDto } from 'src/exeption/dto/invalid-form-exception.dto';
import { ParseObjectIdPipe } from 'src/pipe/parse-objectid.pipe';
import { UserDocument } from 'src/schema/user/user.schema';
import { AccountService } from '../account/account.service';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import JwtTwoFactorGuard from '../auth/guard/jwt-two-factor.guard';
import { PermissionsGuard } from '../auth/guard/permissions.guard';
import { InvestorService } from '../investor/investor.service';
import { CreateOrganizationRequestDto } from '../organization/dto/create-organization-request.dto';
import { OrganizationService } from '../organization/organization.service';
import { CreateOperationRequestDto } from './dto/create-operation-request.dto';
import { CreateOperationResponseDto } from './dto/create-operation-response.dto';
import { GetOperationResponseDto } from './dto/get-operation-response.dto';
import { OperationMapper } from './mapper/operation.mapper';
import { OperationService } from './operation.service';

@UseGuards(JwtTwoFactorGuard, PermissionsGuard)
@Controller('api/v1/organization/:organizationId/investor/:investorId/account/:accountId/operation')
@ApiTags('investor')
@ApiBearerAuth()
export class InvestorAccountOperationController {
  constructor(
    private readonly oranizationServce: OrganizationService,
    private readonly operationService: OperationService,
    private readonly accountService: AccountService,
    private readonly investorService: InvestorService,
  ){}
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
    @Param('accountId', ParseObjectIdPipe) accountId: string,
    @Param('investorId', ParseObjectIdPipe) investorId: string,
    @Body() request: CreateOperationRequestDto,
    @CurrentUser() userCurrent: UserDocument,
  ): Promise<CreateOperationResponseDto>{
    const organization = await this.oranizationServce.getById(organizationId);
    const investor = await this.investorService.getInvestorById(investorId, organization);
    const account = await this.accountService.getAccountInvestorById(accountId, investor);
    const accountfrom = await this.accountService.getAccountClearerById(request.accountFrom);

    const operation = await this.operationService.createOperation(request, account, accountfrom, userCurrent);
    
    return OperationMapper.toCreateDto(operation);
  }

  // @Get()
  // @ApiOperation({ summary: 'Get Investor Account Operations' })
  // @ApiOkResponse({type: GetOperationResponseDto})

}