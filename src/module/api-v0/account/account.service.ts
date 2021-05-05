import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account, AccountDocument } from 'src/schema/account/account.schema';
import { CreateAccountDto } from './dto/create-account.dto';
import { ReadAccountDto } from './dto/read-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name)
    private accountModel: Model<AccountDocument>,
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<ReadAccountDto> {
    const createdAccount = new this.accountModel(createAccountDto);

    return createdAccount.save();
  }

  async findAll(): Promise<ReadAccountDto[]> {
    return this.accountModel.find().exec();
  }

  findOne(id: string): Promise<ReadAccountDto> {
    return this.accountModel.findById(id).exec();
  }

  // TODO: It makes no sense to return data before change
  update(
    id: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<ReadAccountDto> {
    return this.accountModel.findByIdAndUpdate(id, updateAccountDto).exec();
  }

  remove(id: string): Promise<ReadAccountDto> {
    return this.accountModel.findByIdAndRemove(id).exec();
  }
}
