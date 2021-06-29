import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Desk, DeskDocument } from 'src/schema/desk/desk.schema';
import { CreateDeskRequestDto } from './dto/create-desk-request.dto';
import { OrganizationDocument } from 'src/schema/organization/organization.schema';
import { UpdateDeskRequestDto } from './dto/update-desk-request.dto';
import { PaginationRequest } from 'src/pagination/pagination-request.interface';

@Injectable()
export class DeskService {
  constructor(
    @InjectModel(Desk.name)
    private deskModel: Model<DeskDocument>,
  ) {}

  hydrate(desk: any): DeskDocument {
    return this.deskModel.hydrate(desk);
  }

  async getById(id: string): Promise<DeskDocument> {
    return await this.deskModel.findById(id).exec();
  }

  async create(
    organization: OrganizationDocument,
    request: CreateDeskRequestDto,
    persist = true,
  ): Promise<DeskDocument> {
    const desk = new this.deskModel();

    desk.name = request.name;
    desk.organization = organization;
    desk.createdAt = new Date();

    if (persist) {
      await desk.save();
    }

    return desk;
  }

  async update(
    desk: DeskDocument,
    request: UpdateDeskRequestDto,
    persist = true,
  ): Promise<DeskDocument> {
    Object.keys(request).forEach((key) => {
      desk[key] = request[key];
    });

    await desk.save();

    if (persist) {
      await desk.save();
    }

    return desk;
  }

  async getDesksPaginated(
    organization: OrganizationDocument,
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
          organization: organization._id,
        },
      },
    ];

    if (search) {
      query.push({
        $match: {
          name: { $regex: '.*' + search + '.*', $options: 'i' },
        },
      });
    }
    if (Object.keys(order).length) {
      query.push({ $sort: order });
    }

    return await this.deskModel.aggregate([
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
