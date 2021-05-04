import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AccountOperation,
  AccountOperationDocument,
} from './schema/account-operation.schema';
import { CreateAccountOperationDto } from './dto/create-account-operation.dto';
import { ReadAccountOperationDto } from './dto/read-account-operation.dto';
import { UpdateAccountOperationDto } from './dto/update-account-operation.dto';

@Injectable()
export class AccountOperationService {
  constructor(
    @InjectModel(AccountOperation.name)
    private accountOperationModel: Model<AccountOperationDocument>,
  ) {}

  async create(
    createAccountOperationDto: CreateAccountOperationDto,
  ): Promise<ReadAccountOperationDto> {
    const createdAccountOperation = new this.accountOperationModel(
      createAccountOperationDto,
    );

    return createdAccountOperation.save();
  }

  async findAll(): Promise<ReadAccountOperationDto[]> {
    return this.accountOperationModel.find().exec();
  }

  findOne(id: string): Promise<ReadAccountOperationDto> {
    return this.accountOperationModel.findById(id).exec();
  }

  // TODO: It makes no sense to return data before change
  update(
    id: string,
    updateAccountOperationDto: UpdateAccountOperationDto,
  ): Promise<ReadAccountOperationDto> {
    return this.accountOperationModel
      .findByIdAndUpdate(id, updateAccountOperationDto)
      .exec();
  }

  remove(id: string): Promise<ReadAccountOperationDto> {
    return this.accountOperationModel.findByIdAndRemove(id).exec();
  }
}
