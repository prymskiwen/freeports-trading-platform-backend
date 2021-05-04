import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Organization,
  OrganizationDocument,
} from './schema/organization.schema';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { ReadOrganizationDto } from './dto/read-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
  ) {}

  async create(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<ReadOrganizationDto> {
    const createdOrganization = new this.organizationModel(
      createOrganizationDto,
    );

    return createdOrganization.save();
  }

  async findAll(): Promise<ReadOrganizationDto[]> {
    return this.organizationModel.find().exec();
  }

  findOne(id: string): Promise<ReadOrganizationDto> {
    return this.organizationModel.findById(id).exec();
  }

  update(
    id: string,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<ReadOrganizationDto> {
    return this.organizationModel
      .findByIdAndUpdate(id, updateOrganizationDto)
      .exec();
  }

  remove(id: string): Promise<ReadOrganizationDto> {
    return this.organizationModel.findByIdAndRemove(id).exec();
  }
}
