import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import {
  TransactionRequest,
  TransactionRequestDocument,
} from './schemas/transaction-request.schema';
import { CreateTransactionRequestDto } from './dto/create-transaction-request.dto';
import { ReadTransactionRequestDto } from './dto/read-transaction-request.dto';
import { UpdateTransactionRequestDto } from './dto/update-transaction-request.dto';

@Injectable()
export class TransactionRequestsService {
  constructor(
    @InjectModel(TransactionRequest.name)
    private transactionRequestModel: Model<TransactionRequestDocument>,
    @InjectConnection() private connection: Connection, // to make native API calls
  ) {}

  create(
    createTransactionRequestDto: CreateTransactionRequestDto,
  ): Promise<TransactionRequest> {
    const createdTransactionRequest = new this.transactionRequestModel(
      createTransactionRequestDto,
    );

    return createdTransactionRequest.save();
  }

  findAll(): Promise<ReadTransactionRequestDto[]> {
    return this.transactionRequestModel.find().exec();
  }

  findOne(id: string): Promise<ReadTransactionRequestDto> {
    return this.transactionRequestModel.findById(id).exec();
  }

  update(
    id: string,
    updateTransactionRequestDto: UpdateTransactionRequestDto,
  ): Promise<ReadTransactionRequestDto> {
    return this.transactionRequestModel
      .findByIdAndUpdate(id, updateTransactionRequestDto)
      .exec();
  }

  remove(id: string): Promise<ReadTransactionRequestDto> {
    return this.transactionRequestModel.findByIdAndRemove(id).exec();
  }
}
