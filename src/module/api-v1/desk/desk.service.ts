import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Desk, DeskDocument } from 'src/schema/desk/desk.schema';
import { CreateDeskRequestDto } from './dto/create-desk-request.dto';
import { OrganizationDocument } from 'src/schema/organization/organization.schema';

@Injectable()
export class DeskService {
  constructor(
    @InjectModel(Desk.name)
    private deskModel: Model<DeskDocument>,
  ) {}

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

    if (persist) {
      await desk.save();
    }

    return desk;
  }
}
