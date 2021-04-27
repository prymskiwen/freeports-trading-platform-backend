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
import { TransactionRequestsService } from './transaction-requests.service';
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

@Controller('transaction-requests')
@ApiTags('transaction-requests')
export class TransactionRequestsController {
  constructor(
    private readonly transactionRequestsService: TransactionRequestsService,
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
    return this.transactionRequestsService.create(createTransactionRequestDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all TransactionRequests' })
  @ApiOkResponse({
    type: [ReadTransactionRequestDto],
  })
  findAll() {
    return this.transactionRequestsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a TransactionRequest by id' })
  @ApiOkResponse({
    type: ReadTransactionRequestDto,
  })
  findOne(@Param('id') id: string) {
    return this.transactionRequestsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a TransactionRequest by id' })
  @ApiOkResponse({
    type: ReadTransactionRequestDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateTransactionRequestDto: UpdateTransactionRequestDto,
  ) {
    return this.transactionRequestsService.update(
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
  async remove(@Param('id') id: string) {
    try {
      const tr = await this.transactionRequestsService.remove(id);

      if (tr) {
        return {
          success: true,
          message: 'TransactionRequest has been deleted',
          id: tr._id,
        };
      }
    } catch (ex) {}

    throw new NotFoundException({
      success: false,
      message: 'TransactionRequest does not exist',
    });
  }
}
