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

  async create(
    organization: OrganizationDocument,
    request: CreateDeskRequestDto,
  ): Promise<DeskDocument> {
    const desk = new this.deskModel();

    desk.name = request.name;
    desk.organization = organization;
    await desk.save();

    return desk;
  }
}
