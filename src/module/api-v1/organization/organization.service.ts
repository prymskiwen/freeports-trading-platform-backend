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

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
  ) {}

  hydrate(organization: any): OrganizationDocument {
    return this.organizationModel.hydrate(organization);
  }

  async getById(id: string): Promise<OrganizationDocument> {
    return await this.organizationModel.findById(id).exec();
  }

  async create(
    request: CreateOrganizationRequestDto,
    persist = true,
  ): Promise<OrganizationDocument> {
    const organization = new this.organizationModel();

    organization.createdAt = new Date();
    organization.details = {
      name: request.name,
      street: request.street,
      street2: request.street2,
      zip: request.zip,
      city: request.city,
      country: request.country,
      logo: request.logo,
    };

    organization.commissionRatio = {
      organization: request.commissionOrganization,
      clearer: request.commissionClearer,
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
    const {
      commissionOrganization,
      commissionClearer,
      ...requestRest
    } = request;
    Object.keys(requestRest).forEach((key) => {
      organization.details[key] = requestRest[key];
    });

    if (commissionOrganization) {
      organization.commissionRatio.organization = commissionOrganization;
    }
    if (commissionClearer) {
      organization.commissionRatio.clearer = commissionClearer;
    }

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
}
