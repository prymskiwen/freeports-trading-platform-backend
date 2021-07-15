import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/schema/user/user.schema';
import {
  Investor,
  InvestorDocument,
} from 'src/schema/investor/investor.schema';
import { CreateInvestorRequestDto } from './dto/create-investor-request.dto';
import { UpdateInvestorRequestDto } from './dto/update-investor-request.dto';
import { DeskDocument } from 'src/schema/desk/desk.schema';
import {
  InvestorAccount,
  InvestorAccountDocument,
} from 'src/schema/investor/embedded/investor-account.embedded';
import { CreateInvestorAccountRequestDto } from './dto/account/create-investor-account-request.dto';

@Injectable()
export class InvestorService {
  constructor(
    @InjectModel(Investor.name)
    private investorModel: Model<InvestorDocument>,
    @InjectModel(InvestorAccount.name)
    private investorAccountModel: Model<InvestorAccountDocument>,
  ) {}

  async getInvestorList(desk: DeskDocument): Promise<InvestorDocument[]> {
    return await this.investorModel.find({ desk: desk._id }).exec();
  }

  async getInvestorById(
    id: string,
    desk: DeskDocument,
  ): Promise<InvestorDocument> {
    return await this.investorModel.findOne({ _id: id, desk: desk._id }).exec();
  }

  async createInvestor(
    desk: DeskDocument,
    request: CreateInvestorRequestDto,
    user: UserDocument,
    persist = true,
  ): Promise<InvestorDocument> {
    const investor = new this.investorModel();

    investor.desk = desk;
    investor.owner = user;
    investor.name = request.name;

    if (persist) {
      await investor.save();
    }

    return investor;
  }

  async updateInvestor(
    investor: InvestorDocument,
    request: UpdateInvestorRequestDto,
    persist = true,
  ): Promise<InvestorDocument> {
    investor.name = request.name;

    if (persist) {
      await investor.save();
    }

    return investor;
  }

  async createAccount(
    investor: InvestorDocument,
    request: CreateInvestorAccountRequestDto,
    persist = true,
  ): Promise<InvestorAccountDocument> {
    const account = new this.investorAccountModel();

    account.name = request.name;
    account.currency = request.currency;

    // TODO: vault request here
    // account.vaultWalletId = requestVault.id;
    // account.publicAddress = requestVault.address;

    investor.accounts.push(account);

    if (persist) {
      await investor.save();
    }

    return account;
  }
}
