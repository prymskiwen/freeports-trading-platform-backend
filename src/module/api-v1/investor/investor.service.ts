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
import { PermissionDesk } from 'src/schema/role/permission.helper';
import { RoleDesk } from 'src/schema/role/role-desk.schema';
import { RoleMultidesk } from 'src/schema/role/role-multidesk.schema';
import { PaginationRequest } from 'src/pagination/pagination-request.interface';

@Injectable()
export class InvestorService {
  constructor(
    @InjectModel(Investor.name)
    private investorModel: Model<InvestorDocument>,
    @InjectModel(InvestorAccount.name)
    private investorAccountModel: Model<InvestorAccountDocument>,
  ) {}

  hydrate(investor: any): InvestorDocument {
    return this.investorModel.hydrate(investor);
  }

  async getInvestorsPaginated(
    desk: DeskDocument,
    pagination: PaginationRequest,
  ): Promise<any[]> {
    const {
      skip,
      limit,
      order,
      params: { search },
    } = pagination;

    const query: any[] = [
      {
        $match: {
          desk: desk._id,
        },
      },
    ];

    if (search) {
      query.push({
        $match: {
          name: { $regex: '.*' + search + '.*', $options: 'i' },
        },
      });
    }
    if (Object.keys(order).length) {
      query.push({ $sort: order });
    }

    return await this.investorModel.aggregate([
      ...query,
      {
        $facet: {
          paginatedResult: [{ $skip: skip }, { $limit: limit }],
          totalResult: [{ $count: 'total' }],
        },
      },
    ]);
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

    investor.name = request.name;
    investor.createdAt = new Date();
    investor.owner = user;
    investor.desk = desk;

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

  async getMyInvestorList(user: UserDocument): Promise<InvestorDocument[]> {
    await user.populate('roles.role').execPopulate();

    const deskIds = user.roles.reduce((prev, role) => {
      if (role.role.disabled) {
        return prev;
      }

      if (!role.role.permissions.includes(PermissionDesk.investorRead)) {
        return prev;
      }

      if (role.role.kind === RoleDesk.name) {
        return prev.concat(role.role['desk']);
      }

      if (role.role.kind === RoleMultidesk.name) {
        return prev.concat(role.effectiveDesks);
      }

      return prev;
    }, []);

    return await this.investorModel.find({ desk: { $in: deskIds } }).exec();
  }

  // TODO: improve query if possible, sanitize search
  async getMyInvestorsPaginated(
    pagination: PaginationRequest,
    user: UserDocument,
  ): Promise<any[]> {
    await user.populate('roles.role').execPopulate();

    const deskIds = user.roles.reduce((prev, role) => {
      if (role.role.disabled) {
        return prev;
      }

      if (!role.role.permissions.includes(PermissionDesk.investorRead)) {
        return prev;
      }

      if (role.role.kind === RoleDesk.name) {
        return prev.concat(role.role['desk']);
      }

      if (role.role.kind === RoleMultidesk.name) {
        return prev.concat(role.effectiveDesks);
      }

      return prev;
    }, []);

    const {
      skip,
      limit,
      order,
      params: { search },
    } = pagination;

    const query: any[] = [
      {
        $match: {
          desk: { $in: deskIds },
        },
      },
    ];

    if (search) {
      query.push({
        $match: {
          name: { $regex: '.*' + search + '.*', $options: 'i' },
        },
      });
    }
    if (Object.keys(order).length) {
      query.push({ $sort: order });
    }

    return await this.investorModel.aggregate([
      ...query,
      {
        $facet: {
          paginatedResult: [{ $skip: skip }, { $limit: limit }],
          totalResult: [{ $count: 'total' }],
        },
      },
    ]);
  }
}
