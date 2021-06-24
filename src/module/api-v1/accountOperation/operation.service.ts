import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserDocument } from "src/schema/user/user.schema";
import { CreateOperationRequestDto } from "./dto/create-operation-request.dto";

@Injectable()
export class OperationService {
  constructor(
  ){}

  async createOperation(
    request: CreateOperationRequestDto,
    user: UserDocument,
  ): Promise<any> {
    console.log(request);
    return user
  }
}