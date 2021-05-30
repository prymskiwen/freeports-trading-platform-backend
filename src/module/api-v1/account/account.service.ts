import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/schema/user/user.schema';
import { CreateAccountRequestDto } from './dto/create-account-request.dto';
import { Account, AccountDocument } from 'src/schema/account/account.schema';
import { AccountDetailsType } from 'src/schema/account/embedded/account-details.embedded';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name)
    private accountModel: Model<AccountDocument>,
  ) {}

  async getById(id: string): Promise<AccountDocument> {
    return await this.accountModel.findById(id).exec();
  }

  async create(
    request: CreateAccountRequestDto,
    user: UserDocument,
    persist = true,
  ): Promise<AccountDocument> {
    const account = new this.accountModel();

    account.owner = user;
    account.details = {
      name: request.name,
      currency: request.currency,
      type: request.type,
    };
    if (request.type === AccountDetailsType.fiat) {
      account.fiatDetails = {
        iban: request.iban,
      };
    } else if (request.type === AccountDetailsType.crypto) {
      account.cryptotDetails = {
        publicAddress: request.publicAddress,
        vaultWalletId: request.vaultWalletId,
      };
    }

    if (persist) {
      await account.save();
    }

    return account;
  }
}
