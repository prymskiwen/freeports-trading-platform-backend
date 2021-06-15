import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Organization,
  OrganizationDocument,
} from 'src/schema/organization/organization.schema';
import { CreateOrganizationRequestDto } from './dto/create-organization-request.dto';
import { UpdateOrganizationRequestDto } from './dto/update-organization-request.dto';
import { PaginationRequest } from 'src/pagination/pagination-request.interface';
import { AccountDocument } from 'src/schema/account/account.schema';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
  ) {}

  async getById(id: string): Promise<OrganizationDocument> {
    return await this.organizationModel.findById(id).exec();
  }

  async create(
    request: CreateOrganizationRequestDto,
    persist = true,
  ): Promise<OrganizationDocument> {
    const organization = new this.organizationModel();

    organization.details = {
      name: request.name,
      street: request.street,
      street2: request.street2,
      zip: request.zip,
      city: request.city,
      country: request.country,
      logofile: request.logofile,
      createtime: request.createtime,
    };

    organization.commissionRatio = {
      organization: request.сommission,
      clearer: request.clearer,
    };

    if (persist) {
      await organization.save();
    }

    return organization;
  }

  async update(
    organization: OrganizationDocument,
    request: UpdateOrganizationRequestDto,
    persist = true,
  ): Promise<OrganizationDocument> {
    organization.details = {
      name: request.name,
      street: request.street,
      street2: request.street2,
      zip: request.zip,
      city: request.city,
      country: request.country,
      createtime: request.createtime,
    };

    organization.commissionRatio = {
      organization: request.сommission,
      clearer: request.clearer,
    };

    if (persist) {
      await organization.save();
    }

    return organization;
  }

  async getOrganizationsPaginated(
    pagination: PaginationRequest,
  ): Promise<any[]> {
    const {
      skip,
      limit,
      order,
      params: { search },
    } = pagination;

    const query: any[] = [];

    if (search) {
      query.push({
        $match: {
          'details.name': { $regex: '.*' + search + '.*', $options: 'i' },
        },
      });
    }
    if (Object.keys(order).length) {
      query.push({ $sort: order });
    }

    return await this.organizationModel.aggregate([
      ...query,
      {
        $facet: {
          paginatedResult: [{ $skip: skip }, { $limit: limit }],
          totalResult: [{ $count: 'total' }],
        },
      },
    ]);
  }

  async deleteAccount(
    organization: OrganizationDocument,
    account: AccountDocument,
  ) {
    await this.organizationModel.updateOne(
      { _id: organization._id },
      { $pull: { clearing: { account: account._id } } },
    );
  }
}
