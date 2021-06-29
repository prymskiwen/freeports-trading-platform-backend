import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/schema/user/user.schema';
import { CreateAccountRequestDto } from './dto/create-account-request.dto';
import { AccountDetailsType } from 'src/schema/account/embedded/account-details.embedded';
import {
  AccountClearer,
  AccountClearerDocument,
} from 'src/schema/account/account-clearer.schema';
import {
  AccountInvestor,
  AccountInvestorDocument,
} from 'src/schema/account/account-investor.schema';
import { UpdateAccountRequestDto } from './dto/update-account-request.dto';
import { OrganizationDocument } from 'src/schema/organization/organization.schema';
import { InvestorDocument } from 'src/schema/investor/investor.schema';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(AccountClearer.name)
    private accountClearerModel: Model<AccountClearerDocument>,
    @InjectModel(AccountInvestor.name)
    private accountInvestorModel: Model<AccountInvestorDocument>,
  ) {}

  async getAccountClearerList(): Promise<AccountClearerDocument[]> {
    return await this.accountClearerModel.find().exec();
  }

  async getAccountClearerById(id: string): Promise<AccountClearerDocument> {
    return await this.accountClearerModel.findById(id).exec();
  }

  async createAccountClearer(
    request: CreateAccountRequestDto,
    user: UserDocument,
    persist = true,
  ): Promise<AccountClearerDocument> {
    const account = new this.accountClearerModel();

    account.owner = user;
    account.details = {
      name: request.name,
      currency: request.currency,
      balance: request.balance,
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

  async updateAccountClearer(
    account: AccountClearerDocument,
    request: UpdateAccountRequestDto,
    persist = true,
  ): Promise<AccountClearerDocument> {
    account.details = {
      name: request.name,
      currency: request.currency,
      balance: request.balance,
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

  async unassignAccountClearerOrganization(
    account: AccountClearerDocument,
    organization: OrganizationDocument,
  ) {
    await this.accountClearerModel.updateOne(
      { _id: account._id },
      { $pull: { organizations: organization._id } },
    );
  }

  async getAccountInvestorList(
    investor: InvestorDocument,
  ): Promise<AccountInvestorDocument[]> {
    return await this.accountInvestorModel
      .find({
        investor: investor._id,
      })
      .exec();
  }

  async getAccountInvestorById(
    id: string,
    investor: InvestorDocument,
  ): Promise<AccountInvestorDocument> {
    return await this.accountInvestorModel
      .findOne({
        _id: id,
        investor: investor._id,
      })
      .exec();
  }

  async createAccountInvestor(
    investor: InvestorDocument,
    request: CreateAccountRequestDto,
    user: UserDocument,
    persist = true,
  ): Promise<AccountInvestorDocument> {
    const account = new this.accountInvestorModel();

    account.investor = investor;
    account.owner = user;
    account.details = {
      name: request.name,
      currency: request.currency,
      balance: request.balance,
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
