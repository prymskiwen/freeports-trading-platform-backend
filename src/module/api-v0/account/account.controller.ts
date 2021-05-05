import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ParseObjectIdPipe } from 'src/pipe/parse-objectid.pipe';
import { ReadAccountDto } from './dto/read-account.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { AccountService } from './account.service';
import { UpdateAccountDto } from './dto/update-account.dto';

@Controller('api/v0/accounts')
@ApiTags('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @ApiOperation({ summary: 'Create an account' })
  @ApiCreatedResponse({
    description: 'The account has been successfully created.',
    type: ReadAccountDto,
  })
  create(@Body() createAccountDto: CreateAccountDto): Promise<ReadAccountDto> {
    return this.accountService.create(createAccountDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all accounts' })
  @ApiOkResponse({
    type: [ReadAccountDto],
  })
  findAll(): Promise<ReadAccountDto[]> {
    return this.accountService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an account by id' })
  @ApiOkResponse({
    type: ReadAccountDto,
  })
  findOne(@Param('id', ParseObjectIdPipe) id: string): Promise<ReadAccountDto> {
    return this.accountService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an account by id' })
  @ApiOkResponse({
    type: ReadAccountDto,
  })
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<ReadAccountDto> {
    return this.accountService.update(id, updateAccountDto);
  }
}
