import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/schema/user/user.schema';
import {
  Organization,
  OrganizationDocument,
} from 'src/schema/organization/organization.schema';
import { CreateOrganizationAccountRequestDto } from './dto/create-organization-account-request.dto';
import { CreateOrganizationAccountResponseDto } from './dto/create-organization-account-response.dto';
import { Account, AccountDocument } from 'src/schema/account/account.schema';
import { AccountMapper } from './mapper/account.mapper';
import { DeleteOrganizationAccountResponseDto } from './dto/delete-organization-account-response.dto';

@Injectable()
export class ClearerService {
  constructor(
    @InjectModel(Account.name)
    private accountModel: Model<AccountDocument>,
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
  ) {}

  async createAccount(
    id: string,
    request: CreateOrganizationAccountRequestDto,
    user: UserDocument,
  ): Promise<CreateOrganizationAccountResponseDto> {
    let account = new this.accountModel();
    const organization = await this.organizationModel.findById(id).exec();

    if (!organization) {
      throw new NotFoundException();
    }

    account = AccountMapper.toCreateDocument(account, request);
    account.owner = user;
    await account.save();

    organization.clearing.push({
      currency: request.currency,
      account: account,
    });
    await organization.save();

    return AccountMapper.toCreateDto(account);
  }

  async deleteAccount(
    organizationId: string,
    accountId: string,
  ): Promise<DeleteOrganizationAccountResponseDto> {
    const account = await this.accountModel.findById(accountId).exec();
    const organization = await this.organizationModel
      .findById(organizationId)
      .exec();

    if (!account || !organization) {
      throw new NotFoundException();
    }

    await account.remove();
    await this.organizationModel.updateOne(
      { _id: organization._id },
      { $pull: { clearing: { account: account._id } } },
    );

    return AccountMapper.toDeleteDto(account);
  }
}
