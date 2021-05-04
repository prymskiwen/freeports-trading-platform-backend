import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { TransactionRequestService } from './transaction-request.service';
import { CreateTransactionRequestDto } from './dto/create-transaction-request.dto';
import { UpdateTransactionRequestDto } from './dto/update-transaction-request.dto';
import { ReadTransactionRequestDto } from './dto/read-transaction-request.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ParseObjectIdPipe } from 'src/pipe/parse-objectid.pipe';

@Controller('transaction-requests')
@ApiTags('transaction requests')
export class TransactionRequestController {
  constructor(
    private readonly transactionRequestService: TransactionRequestService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a TransactionRequest' })
  @ApiCreatedResponse({
    description: 'The TransactionRequest has been successfully created.',
    type: ReadTransactionRequestDto,
  })
  create(
    @Body() createTransactionRequestDto: CreateTransactionRequestDto,
  ): Promise<ReadTransactionRequestDto> {
    return this.transactionRequestService.create(createTransactionRequestDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all TransactionRequests' })
  @ApiOkResponse({
    type: [ReadTransactionRequestDto],
  })
  findAll() {
    return this.transactionRequestService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a TransactionRequest by id' })
  @ApiOkResponse({
    type: ReadTransactionRequestDto,
  })
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.transactionRequestService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a TransactionRequest by id' })
  @ApiOkResponse({
    type: ReadTransactionRequestDto,
  })
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateTransactionRequestDto: UpdateTransactionRequestDto,
  ) {
    return this.transactionRequestService.update(
      id,
      updateTransactionRequestDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a TransactionRequest' })
  @ApiParam({
    name: 'id',
    description: 'id of TransactionRequest we want to delete.',
  })
  @ApiOkResponse({})
  async remove(@Param('id', ParseObjectIdPipe) id: string) {
    const tr = await this.transactionRequestService.remove(id);

    if (!tr) {
      throw new NotFoundException({
        success: false,
        message: 'TransactionRequest does not exist',
      });
    }

    return {
      success: true,
      message: 'TransactionRequest has been deleted',
      id: tr._id,
    };
  }
}
