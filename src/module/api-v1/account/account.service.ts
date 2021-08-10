import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/schema/user/user.schema';
import { CreateAccountRequestDto } from './dto/create-account-request.dto';
import { AccountType } from 'src/schema/account/account.schema';
import { UpdateAccountRequestDto } from './dto/update-account-request.dto';
import { Account, AccountDocument } from 'src/schema/account/account.schema';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name)
    private accountModel: Model<AccountDocument>,
  ) {}

  async getAccountList(): Promise<AccountDocument[]> {
    return await this.accountModel.find().exec();
  }

  async getAccountById(id: string): Promise<AccountDocument> {
    return await this.accountModel.findById(id).exec();
  }

  async createAccount(
    request: CreateAccountRequestDto,
    user: UserDocument,
    persist = true,
  ): Promise<AccountDocument> {
    const account = new this.accountModel();

    account.owner = user;
    account.name = request.name;
    account.currency = request.currency;
    account.balance = request.balance;
    account.type = request.type;

    if (request.type === AccountType.fiat) {
      account.iban = request.iban;
    } else if (request.type === AccountType.crypto) {
      // TODO: vault request here
      // account.vaultWalletId = requestVault.id;
      // account.publicAddress = requestVault.address;
      // account.hdPath = requestVault.hdPath;
    }

    if (persist) {
      await account.save();
    }

    return account;
  }

  async updateAccount(
    account: AccountDocument,
    request: UpdateAccountRequestDto,
    persist = true,
  ): Promise<AccountDocument> {
    account.name = request.name;
    account.currency = request.currency;
    account.balance = request.balance;
    account.type = request.type;

    if (request.type === AccountType.fiat) {
      account.iban = request.iban;
    } else if (request.type === AccountType.crypto) {
      // TODO: vault request here
      // account.cryptotDetails = {
      //   vaultWalletId: requestVault.id,
      //   publicAddress: requestVault.address,
      // };
    }

    if (persist) {
      await account.save();
    }

    return account;
  }
}
