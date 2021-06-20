import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/schema/user/user.schema';
import { AccountInvestorDocument } from 'src/schema/account/account-investor.schema';
import { OrganizationDocument } from 'src/schema/organization/organization.schema';
import {
  Investor,
  InvestorDocument,
} from 'src/schema/investor/investor.schema';
import { CreateInvestorRequestDto } from './dto/create-investor-request.dto';
import { UpdateInvestorRequestDto } from './dto/update-investor-request.dto';

@Injectable()
export class InvestorService {
  constructor(
    @InjectModel(Investor.name)
    private investorModel: Model<InvestorDocument>,
  ) {}

  async getInvestorList(
    organization: OrganizationDocument,
  ): Promise<InvestorDocument[]> {
    return await this.investorModel
      .find({
        $and: [
          { organization: { $exists: true } },
          { organization: organization._id },
        ],
      })
      .exec();
  }

  async getInvestorById(
    id: string,
    organization: OrganizationDocument,
  ): Promise<InvestorDocument> {
    return await this.investorModel
      .findOne({
        _id: id,
        $and: [
          { organization: { $exists: true } },
          { organization: organization._id },
        ],
      })
      .exec();
  }

  async createInvestor(
    organization: OrganizationDocument,
    request: CreateInvestorRequestDto,
    user: UserDocument,
    persist = true,
  ): Promise<InvestorDocument> {
    const investor = new this.investorModel();

    investor.organization = organization;
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

  async unassignAccount(
    investor: InvestorDocument,
    account: AccountInvestorDocument,
  ) {
    await this.investorModel.updateOne(
      { _id: investor._id },
      { $pull: { accounts: account._id } },
    );
  }
}
