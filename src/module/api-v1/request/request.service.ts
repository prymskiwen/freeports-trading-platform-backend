import {
  RequestTradeOrderTrade,
  RequestTradeOrderTradeDocument,
} from './../../../schema/request/embedded/request-trade-order-trade.embedded';
import { Injectable, NotFoundException } from '@nestjs/common';
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
import { PaginationRequest } from 'src/pagination/pagination-request.interface';
import { BrokersService } from '../brokers/brokers.service';
import { v4 as uuidv4 } from 'uuid';
import { CreateRequestTradeOrderRequestDto } from './dto/trade/create-request-trade-order-request.dto';
import {
  RequestTradeOrder,
  RequestTradeOrderDocument,
} from 'src/schema/request/embedded/request-trade-order.embedded';
import { BigNumber } from 'bignumber.js';

@Injectable()
export class RequestService {
  readonly ORDER_VALID_UNTIL = 10000;

  constructor(
    @InjectModel(RequestTrade.name)
    private requestTradeModel: Model<RequestTradeDocument>,
    @InjectModel(RequestTradeRfq.name)
    private requestTradeRfqModel: Model<RequestTradeRfqDocument>,
    @InjectModel(RequestTradeOrder.name)
    private requestTradeOrderModel: Model<RequestTradeOrderDocument>,
    @InjectModel(RequestTradeOrderTrade.name)
    private requestTradeOrderTradeModel: Model<RequestTradeOrderTradeDocument>,
    @InjectModel(RequestFund.name)
    private requestFundModel: Model<RequestFundDocument>,
    @InjectModel(RequestRefund.name)
    private requestRefundModel: Model<RequestRefundDocument>,
    @InjectModel(RequestMove.name)
    private requestMoveModel: Model<RequestMoveDocument>,
    private readonly investorService: InvestorService,
    private readonly brokersService: BrokersService,
  ) {}

  hydrateRequestTrade(request: any): RequestTradeDocument {
    return this.requestTradeModel.hydrate(request);
  }

  hydrateRequestFund(request: any): RequestFundDocument {
    return this.requestFundModel.hydrate(request);
  }

  hydrateRequestRefund(request: any): RequestRefundDocument {
    return this.requestRefundModel.hydrate(request);
  }

  hydrateRequestMove(request: any): RequestMoveDocument {
    return this.requestMoveModel.hydrate(request);
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

  async getRequestTradesPaginated(
    investor: InvestorDocument,
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
          investor: investor._id,
        },
      },
    ];

    if (search) {
      query.push({
        $match: {
          friendlyId: { $regex: '.*' + search + '.*', $options: 'i' },
        },
      });
    }
    if (Object.keys(order).length) {
      query.push({ $sort: order });
    }

    return await this.requestTradeModel.aggregate([
      ...query,
      {
        $facet: {
          paginatedResult: [{ $skip: skip }, { $limit: limit }],
          totalResult: [{ $count: 'total' }],
        },
      },
    ]);
  }

  // TODO: improve query if possible, sanitize search
  async getMyRequestTradesPaginated(
    pagination: PaginationRequest,
    user: UserDocument,
  ): Promise<any[]> {
    const investors = await this.investorService.getMyInvestorList(user);

    const {
      skip,
      limit,
      order,
      params: { search },
    } = pagination;

    const query: any[] = [
      {
        $match: {
          investor: { $in: investors.map((investor) => investor._id) },
        },
      },
    ];

    if (search) {
      query.push({
        $match: {
          friendlyId: { $regex: '.*' + search + '.*', $options: 'i' },
        },
      });
    }
    if (Object.keys(order).length) {
      query.push({ $sort: order });
    }

    return await this.requestTradeModel.aggregate([
      ...query,
      {
        $facet: {
          paginatedResult: [{ $skip: skip }, { $limit: limit }],
          totalResult: [{ $count: 'total' }],
        },
      },
    ]);
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
    const clientId = uuidv4();

    const instrument =
      requestTrade.currencyFrom.toUpperCase() +
      requestTrade.currencyTo.toUpperCase() +
      '.SPOT';
    const rfqsResponses = await this.brokersService.rfqs(
      clientId,
      instrument,
      'buy',
      request.quantity,
    );

    const rfqs = [];
    rfqsResponses.forEach((rfqResponse) => {
      const rfq = new this.requestTradeRfqModel();
      rfq.initiator = user;
      rfq.quantity = request.quantity;

      // TODO: broker API request here
      rfq.brokerId = 'B2C2';
      // calculate side and instrument
      // get quantity from request

      rfq.validUntil = new Date(rfqResponse['valid_until']);
      rfq.rfqId = rfqResponse['rfq_id'];
      rfq.clientRfqId = clientId;
      rfq.side = rfqResponse['side'];
      rfq.instrument = rfqResponse['instrument'];
      // that case is for b2c2 only
      rfq.price = new BigNumber(rfqResponse['price'])
        .times(new BigNumber(rfqResponse['quantity']))
        .toString();

      rfq.createdAt = new Date();
      rfq.rawResponse = JSON.stringify(rfqResponse);
      // rfq.rawQuery =
      rfqs.push(rfq);
      requestTrade.rfqs.push(rfq);
    });

    if (persist) {
      await requestTrade.save();
    }

    return rfqs;
  }

  async createOrder(
    requestTrade: RequestTradeDocument,
    request: CreateRequestTradeOrderRequestDto,
    user: UserDocument,
    persist = true,
  ): Promise<RequestTradeOrderDocument> {
    const clientId = uuidv4();

    const rfq = requestTrade.rfqs.find((rfq) => rfq.id === request.rfqId);

    if (!rfq) {
      throw new NotFoundException(`couldn't find rfq with id ${request.rfqId}`);
    }
    const order = new this.requestTradeOrderModel();
    order.initiator = user;
    order.brokerId = rfq.brokerId;
    if (request.validUntil) {
      order.validUntil = new Date(request.validUntil);
    } else if (requestTrade.limitTime) {
      order.validUntil = new Date(requestTrade.limitTime);
    } else {
      order.validUntil = new Date(Date.now() + this.ORDER_VALID_UNTIL);
    }
    order.rfqId = rfq.id;
    order.clientOrderId = clientId;
    order.quantity = rfq.quantity;
    order.instrument = rfq.instrument;
    order.price = new BigNumber(rfq.price)
      .times(new BigNumber(rfq.quantity))
      .toString();
    order.type = request.orderType;
    // order.trades = [];
    const orderResponse = await this.brokersService.order(
      rfq.brokerId,
      clientId,
      rfq.instrument,
      rfq.side,
      rfq.quantity,
      order.price,
      order.validUntil,
    );
    order.executedPrice = orderResponse.executed_price;
    order.rawResponse = JSON.stringify(orderResponse);
    // type: RequestTradeOrderType;
    // status;
    // orderId;
    // side: RequestTradeRfqSide;
    // executingUnit;
    // rawQuery;
    orderResponse.trades.forEach((trade) => {
      order.trades.push(new this.requestTradeOrderTradeModel(trade));
    });

    requestTrade.orders.push(order);

    if (persist) {
      await requestTrade.save();
    }

    return order;
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

  async getRequestFundsPaginated(
    investor: InvestorDocument,
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
          investor: investor._id,
        },
      },
    ];

    if (search) {
      query.push({
        $match: {
          friendlyId: { $regex: '.*' + search + '.*', $options: 'i' },
        },
      });
    }
    if (Object.keys(order).length) {
      query.push({ $sort: order });
    }

    return await this.requestFundModel.aggregate([
      ...query,
      {
        $facet: {
          paginatedResult: [{ $skip: skip }, { $limit: limit }],
          totalResult: [{ $count: 'total' }],
        },
      },
    ]);
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

  async getRequestRefundsPaginated(
    investor: InvestorDocument,
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
          investor: investor._id,
        },
      },
    ];

    if (search) {
      query.push({
        $match: {
          friendlyId: { $regex: '.*' + search + '.*', $options: 'i' },
        },
      });
    }
    if (Object.keys(order).length) {
      query.push({ $sort: order });
    }

    return await this.requestRefundModel.aggregate([
      ...query,
      {
        $facet: {
          paginatedResult: [{ $skip: skip }, { $limit: limit }],
          totalResult: [{ $count: 'total' }],
        },
      },
    ]);
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

  async getRequestMovesPaginated(
    investor: InvestorDocument,
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
          investor: investor._id,
        },
      },
    ];

    if (search) {
      query.push({
        $match: {
          friendlyId: { $regex: '.*' + search + '.*', $options: 'i' },
        },
      });
    }
    if (Object.keys(order).length) {
      query.push({ $sort: order });
    }

    return await this.requestMoveModel.aggregate([
      ...query,
      {
        $facet: {
          paginatedResult: [{ $skip: skip }, { $limit: limit }],
          totalResult: [{ $count: 'total' }],
        },
      },
    ]);
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
