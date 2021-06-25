import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AccountOperation, AccountOperationDocument } from "src/schema/account-operation/account-operation.schema";
import { AccountDocument } from "src/schema/account/account.schema";
import { UserDocument } from "src/schema/user/user.schema";
import { CreateOperationRequestDto } from "./dto/create-operation-request.dto";

@Injectable()
export class OperationService {
  constructor(
    @InjectModel(AccountOperation.name)
    private accountOperationModel: Model<AccountOperationDocument>,
  ){}

  async createOperation(
    request: CreateOperationRequestDto,
    account: AccountDocument,
    accountFrom: AccountDocument,
    inituser: UserDocument,
  ): Promise<AccountOperationDocument> {
    const operation = new this.accountOperationModel()

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
    }
    await operation.save();
    console.log(request);
    return operation
  }
}