import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  OperationRequest,
  OperationRequestDocument,
} from 'src/schema/operation-request/operation-request.schema';
import { CreateOperationRequestDto } from './dto/create-operation-request.dto';
import { ReadOperationRequestDto } from './dto/read-operation-request.dto';
import { UpdateOperationRequestDto } from './dto/update-operation-request.dto';

@Injectable()
export class OperationRequestService {
  constructor(
    @InjectModel(OperationRequest.name)
    private operationRequestModel: Model<OperationRequestDocument>,
  ) {}

  async create(
    createOperationRequestDto: CreateOperationRequestDto,
  ): Promise<ReadOperationRequestDto> {
    const createdOperationRequest = new this.operationRequestModel(
      createOperationRequestDto,
    );

    return createdOperationRequest.save();
  }

  async findAll(): Promise<ReadOperationRequestDto[]> {
    return this.operationRequestModel.find().exec();
  }

  findOne(id: string): Promise<ReadOperationRequestDto> {
    return this.operationRequestModel.findById(id).exec();
  }

  // TODO: It makes no sense to return data before change
  update(
    id: string,
    updateOperationRequestDto: UpdateOperationRequestDto,
  ): Promise<ReadOperationRequestDto> {
    return this.operationRequestModel
      .findByIdAndUpdate(id, updateOperationRequestDto)
      .exec();
  }

  remove(id: string): Promise<ReadOperationRequestDto> {
    return this.operationRequestModel.findByIdAndRemove(id).exec();
  }
}
