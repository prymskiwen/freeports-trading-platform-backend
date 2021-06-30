import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginationRequest } from 'src/pagination/pagination-request.interface';
import {
  AccountOperation,
  AccountOperationDocument,
} from 'src/schema/account-operation/account-operation.schema';
import { AccountDocument } from 'src/schema/account/account.schema';
import { UserDocument } from 'src/schema/user/user.schema';
import { CreateOperationRequestDto } from './dto/create-operation-request.dto';
import { UpdateOperationRequestDto } from './dto/update-operation-request.dto';

@Injectable()
export class OperationService {
  constructor(
    @InjectModel(AccountOperation.name)
    private accountOperationModel: Model<AccountOperationDocument>,
  ) {}

  async createOperation(
    request: CreateOperationRequestDto,
    account: AccountDocument,
    accountFrom: AccountDocument,
    inituser: UserDocument,
  ): Promise<AccountOperationDocument> {
    const operation = new this.accountOperationModel();

    operation.details = {
      initiator: inituser,
      accountFrom: accountFrom,
      accountId: account,
      amount: request.amount,
      createdAt: request.createAt,
      operationDate: request.operationDate,
      operationLabel: request.operationLabel,
      thirdParty: request.thirdParty,
      lineId: request.lineId,
    };

    await operation.save();

    return operation;
  }

  async getOperationPaginated(
    account: AccountDocument,
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
          $and: [
            {
              'details.accountId': account._id,
            },
          ],
        },
      },
    ];

    if (search) {
      query.push({
        $match: {
          'details.operationLabel': {
            $regex: '.*' + search + '.*',
            $options: 'i',
          },
        },
      });
    }
    if (Object.keys(order).length) {
      query.push({ $sort: order });
    }

    return await this.accountOperationModel.aggregate([
      ...query,
      {
        $facet: {
          paginatedResult: [{ $skip: skip }, { $limit: limit }],
          totalResult: [{ $count: 'total' }],
        },
      },
    ]);
  }

  async getOperationWithAccount(
    account: AccountDocument,
    operationId: string,
  ): Promise<AccountOperationDocument> {
    return this.accountOperationModel
      .findOne({
        _id: operationId,
        $and: [
          { 'details.accountId': { $exists: true } },
          { 'details.accountId': account._id },
        ],
      })
      .exec();
  }

  async getOperationById(
    operationId: string,
  ): Promise<AccountOperationDocument> {
    return this.accountOperationModel
      .findOne({
        _id: operationId,
      })
      .exec();
  }

  async updateOperation(
    operation: AccountOperationDocument,
    request: UpdateOperationRequestDto,
    persist = true,
  ): Promise<AccountOperationDocument> {
    const { ...requestSet } = request;

    Object.keys(requestSet).forEach((key) => {
      operation.details[key] = requestSet[key];
    });

    if (persist) {
      await operation.save();
    }

    return operation;
  }
}
