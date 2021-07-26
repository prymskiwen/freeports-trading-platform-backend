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
import {
  RequestFund,
  RequestFundDocument,
} from 'src/schema/request/request-fund.schema';
import { CreateRequestFundRequestDto } from './dto/fund/create-request-fund-request.dto';
import {
  RequestRefund,
  RequestRefundDocument,
} from 'src/schema/request/request-refund.schema';
import {
  RequestMove,
  RequestMoveDocument,
} from 'src/schema/request/request-move.schema';
import { InvestorAccountDocument } from 'src/schema/investor/embedded/investor-account.embedded';
import { CreateRequestRefundRequestDto } from './dto/refund/create-request-refund-request.dto';
import { CreateRequestMoveRequestDto } from './dto/move/create-request-move-request.dto';

@Injectable()
export class RequestService {
  constructor(
    @InjectModel(RequestTrade.name)
    private requestTradeModel: Model<RequestTradeDocument>,
    @InjectModel(RequestTradeRfq.name)
    private requestTradeRfqModel: Model<RequestTradeRfqDocument>,
    @InjectModel(RequestFund.name)
    private requestFundModel: Model<RequestFundDocument>,
    @InjectModel(RequestRefund.name)
    private requestRefundModel: Model<RequestRefundDocument>,
    @InjectModel(RequestMove.name)
    private requestMoveModel: Model<RequestMoveDocument>,
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
  ): Promise<RequestTradeRfqDocument[]> {
    const rfq = new this.requestTradeRfqModel();

    rfq.initiator = user;
    rfq.quantity = request.quantity;

    // TODO: broker API request here
    rfq.brokerId = 'broker 1';
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

    return [rfq];
  }

  async getRequestFundList(
    investor: InvestorDocument,
  ): Promise<RequestFundDocument[]> {
    return await this.requestFundModel
      .find({
        investor: investor._id,
      })
      .exec();
  }

  async getRequestFundById(
    requestFundId: string,
    investor: InvestorDocument,
  ): Promise<RequestFundDocument> {
    return await this.requestFundModel
      .findOne({
        _id: requestFundId,
        investor: investor,
      })
      .exec();
  }

  async createRequestFund(
    investor: InvestorDocument,
    accountFrom: InvestorAccountDocument,
    accountTo: OrganizationClearing,
    request: CreateRequestFundRequestDto,
    user: UserDocument,
    persist = true,
  ): Promise<RequestFundDocument> {
    const fund = new this.requestFundModel();

    fund.status = RequestStatus.requesting;
    fund.investor = investor;
    fund.initiator = user;
    fund.quantity = request.quantity;
    fund.createdAt = new Date();
    fund.accountFrom = accountFrom;
    fund.accountTo = accountTo.account;

    if (persist) {
      await fund.save();
    }

    return fund;
  }

  async getRequestRefundList(
    investor: InvestorDocument,
  ): Promise<RequestRefundDocument[]> {
    return await this.requestRefundModel
      .find({
        investor: investor._id,
      })
      .exec();
  }

  async getRequestRefundById(
    requestRefundId: string,
    investor: InvestorDocument,
  ): Promise<RequestRefundDocument> {
    return await this.requestRefundModel
      .findOne({
        _id: requestRefundId,
        investor: investor,
      })
      .exec();
  }

  async createRequestRefund(
    investor: InvestorDocument,
    accountFrom: OrganizationClearing,
    accountTo: InvestorAccountDocument,
    request: CreateRequestRefundRequestDto,
    user: UserDocument,
    persist = true,
  ): Promise<RequestRefundDocument> {
    const refund = new this.requestRefundModel();

    refund.status = RequestStatus.requesting;
    refund.investor = investor;
    refund.initiator = user;
    refund.quantity = request.quantity;
    refund.createdAt = new Date();
    refund.accountFrom = accountFrom.account;
    refund.accountTo = accountTo;

    if (persist) {
      await refund.save();
    }

    return refund;
  }

  async getRequestMoveList(
    investor: InvestorDocument,
  ): Promise<RequestMoveDocument[]> {
    return await this.requestMoveModel
      .find({
        investor: investor._id,
      })
      .exec();
  }

  async getRequestMoveById(
    requestMoveId: string,
    investor: InvestorDocument,
  ): Promise<RequestMoveDocument> {
    return await this.requestMoveModel
      .findOne({
        _id: requestMoveId,
        investor: investor,
      })
      .exec();
  }

  async createRequestMove(
    investor: InvestorDocument,
    accountFrom: InvestorAccountDocument,
    request: CreateRequestMoveRequestDto,
    user: UserDocument,
    persist = true,
  ): Promise<RequestMoveDocument> {
    const move = new this.requestMoveModel();

    move.status = RequestStatus.requesting;
    move.investor = investor;
    move.initiator = user;
    move.quantity = request.quantity;
    move.createdAt = new Date();
    move.accountFrom = accountFrom;
    move.publicAddressTo = request.publicAddressTo;

    if (persist) {
      await move.save();
    }

    return move;
  }
}
