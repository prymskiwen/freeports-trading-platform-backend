import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ParseObjectIdPipe } from 'src/pipe/parse-objectid.pipe';
import { CreateAccountOperationDto } from './dto/create-account-operation.dto';
import { UpdateAccountOperationDto } from './dto/update-account-operation.dto';
import { ReadAccountOperationDto } from './dto/read-account-operation.dto';
import { AccountOperationService } from './account-operation.service';

@Controller('account-operations')
@ApiTags('account operations')
export class AccountOperationController {
  constructor(
    private readonly accountOperationService: AccountOperationService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create an account operation' })
  @ApiCreatedResponse({
    description: 'The account operation has been successfully created.',
    type: ReadAccountOperationDto,
  })
  create(
    @Body() createAccountDto: CreateAccountOperationDto,
  ): Promise<ReadAccountOperationDto> {
    return this.accountOperationService.create(createAccountDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all account operations' })
  @ApiOkResponse({
    type: [ReadAccountOperationDto],
  })
  findAll(): Promise<ReadAccountOperationDto[]> {
    return this.accountOperationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an account operation by id' })
  @ApiOkResponse({
    type: ReadAccountOperationDto,
  })
  findOne(
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<ReadAccountOperationDto> {
    return this.accountOperationService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an account operation by id' })
  @ApiOkResponse({
    type: ReadAccountOperationDto,
  })
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateAccountOperationDto: UpdateAccountOperationDto,
  ): Promise<ReadAccountOperationDto> {
    return this.accountOperationService.update(id, updateAccountOperationDto);
  }
}
