import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  RequestTrade,
  RequestTradeDocument,
} from 'src/schema/request/request-trade.schema';
import { InvestorDocument } from 'src/schema/investor/investor.schema';
import { CreateRequestTradeRequestDto } from './dto/trade/create-request-trade-request.dto';
import { UserDocument } from 'src/schema/user/user.schema';
import { OrganizationClearing } from 'src/schema/organization/embedded/organization-clearing.embedded';
import { RequestStatus } from 'src/schema/request/request.schema';
import {
  RequestTradeRfq,
  RequestTradeRfqDocument,
} from 'src/schema/request/embedded/request-trade-rfq.embedded';
import { OrganizationDocument } from 'src/schema/organization/organization.schema';
import { CreateRequestTradeRfqRequestDto } from './dto/trade/create-request-trade-rfq-request.dto';
import { InvestorService } from '../investor/investor.service';

@Injectable()
export class RequestService {
  constructor(
    @InjectModel(RequestTrade.name)
    private requestTradeModel: Model<RequestTradeDocument>,
    @InjectModel(RequestTradeRfq.name)
    private requestTradeRfqModel: Model<RequestTradeRfqDocument>,
    private readonly investorService: InvestorService,
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

  async getRequestTradeById(
    requestTradeId: string,
    investor: InvestorDocument,
  ): Promise<RequestTradeDocument> {
    return await this.requestTradeModel
      .findOne({
        _id: requestTradeId,
        investor: investor,
      })
      .exec();
  }

  async getRequestTradeMyList(
    user: UserDocument,
  ): Promise<RequestTradeDocument[]> {
    const investors = await this.investorService.getMyInvestorList(user);

    return await this.requestTradeModel
      .find({ investor: { $in: investors } })
      .exec();
  }

  async createRequestTrade(
    investor: InvestorDocument,
    organization: OrganizationDocument,
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
    trade.commissionClearer = organization.commissionRatio.clearer;
    trade.commissionOrganization = organization.commissionRatio.organization;

    if (persist) {
      await trade.save();
    }

    return trade;
  }

  async createRfq(
    requestTrade: RequestTradeDocument,
    request: CreateRequestTradeRfqRequestDto,
    user: UserDocument,
    persist = true,
  ): Promise<RequestTradeRfqDocument> {
    const rfq = new this.requestTradeRfqModel();

    rfq.initiator = user;
    rfq.quantity = request.quantity;

    // TODO: broker API request here
    // calculate side and instrument
    // get quantity from request
    //
    // rfq.validUntil = requestBroker['valid_until'];
    // rfq.rfqId = requestBroker['rfq_id'];
    // rfq.clientRfqId = requestBroker['client_rfq_id'];
    // rfq.side = requestBroker['side'];
    // rfq.instrument = requestBroker['instrument'];
    // rfq.price = requestBroker['price'];
    // rfq.createdAt = new Date();
    //
    // rfq.rawQuery =
    // rfq.rawResponse =

    requestTrade.rfqs.push(rfq);

    if (persist) {
      await requestTrade.save();
    }

    return rfq;
  }
}
