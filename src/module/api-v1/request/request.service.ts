import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from '../user/user.service';
import { DeskService } from '../desk/desk.service';
import {
  RequestTrade,
  RequestTradeDocument,
} from 'src/schema/request/request-trade.schema';
import { InvestorDocument } from 'src/schema/investor/investor.schema';
import { CreateRequestTradeRequestDto } from './dto/trade/create-request-trade-request.dto';
import { UserDocument } from 'src/schema/user/user.schema';
import { OrganizationClearing } from 'src/schema/organization/embedded/organization-clearing.embedded';
import { RequestStatus } from 'src/schema/request/request.schema';

@Injectable()
export class RequestService {
  constructor(
    @InjectModel(RequestTrade.name)
    private requestTradeModel: Model<RequestTradeDocument>,
    private deskService: DeskService,
    private userService: UserService,
  ) {}

  async getRequestTradeList(
    investor: InvestorDocument,
  ): Promise<RequestTradeDocument[]> {
    return await this.requestTradeModel
      .find({
        investor: investor._id,
      })
      .exec();
  }

  async createRequestTrade(
    investor: InvestorDocument,
    accountFrom: OrganizationClearing,
    accountTo: OrganizationClearing,
    request: CreateRequestTradeRequestDto,
    user: UserDocument,
    persist = true,
  ): Promise<RequestTradeDocument> {
    const trade = new this.requestTradeModel();

    trade.status = RequestStatus.requesting;
    trade.investor = investor;
    trade.initiator = user;
    trade.createdAt = new Date();
    trade.accountFrom = accountFrom.account;
    trade.accountTo = accountTo.account;
    trade.currencyFrom = accountFrom.currency;
    trade.currencyTo = accountTo.currency;
    trade.type = request.type;
    trade.quantity = request.quantity;
    trade.limitPrice = request.limitPrice;
    trade.limitTime = request.limitTime;

    if (persist) {
      await trade.save();
    }

    return trade;
  }
}
