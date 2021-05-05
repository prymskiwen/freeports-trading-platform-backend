import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ParseObjectIdPipe } from 'src/pipe/parse-objectid.pipe';
import { CreateOperationRequestDto } from './dto/create-operation-request.dto';
import { UpdateOperationRequestDto } from './dto/update-operation-request.dto';
import { ReadOperationRequestDto } from './dto/read-operation-request.dto';
import { OperationRequestService } from './operation-request.service';

@Controller('api/v1/operation-requests')
@ApiTags('operation requests')
export class OperationRequestController {
  constructor(
    private readonly operationRequestService: OperationRequestService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create an operation request' })
  @ApiCreatedResponse({
    description: 'The operation request has been successfully created.',
    type: ReadOperationRequestDto,
  })
  create(
    @Body() createAccountDto: CreateOperationRequestDto,
  ): Promise<ReadOperationRequestDto> {
    return this.operationRequestService.create(createAccountDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all operation requests' })
  @ApiOkResponse({
    type: [ReadOperationRequestDto],
  })
  findAll(): Promise<ReadOperationRequestDto[]> {
    return this.operationRequestService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an operation request by id' })
  @ApiOkResponse({
    type: ReadOperationRequestDto,
  })
  findOne(
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<ReadOperationRequestDto> {
    return this.operationRequestService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an operation request by id' })
  @ApiOkResponse({
    type: ReadOperationRequestDto,
  })
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateOperationRequestDto: UpdateOperationRequestDto,
  ): Promise<ReadOperationRequestDto> {
    return this.operationRequestService.update(id, updateOperationRequestDto);
  }
}
