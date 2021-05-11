import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRoles } from 'src/schema/user/user.schema';
import {
  Organization,
  OrganizationDocument,
} from 'src/schema/organization/organization.schema';
import { CreateOrganizationRequestDto } from './dto/create-organization-request.dto';
import { CreateOrganizationResponseDto } from './dto/create-organization-response.dto';
import { CreateOrganizationManagerRequestDto } from './dto/create-organization-manager-request.dto';
import { CreateOrganizationManagerResponseDto } from './dto/create-organization-manager-response.dto';
import { UpdateOrganizationRequestDto } from './dto/update-organization-request';
import { OrganizationMapper } from './mapper/organization.mapper';
import { GetOrganizationResponseDto } from './dto/get-organization-response.dto';
import { UpdateOrganizationManagerRequestDto } from './dto/update-organization-manager-request';
import { UpdateOrganizationResponseDto } from './dto/update-organization-response.dto';
import { ManagerMapper } from './mapper/manager.mapper';
import { GetOrganizationManagerResponseDto } from './dto/get-organization-manager-response.dto';

@Injectable()
export class ClearerService {
  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  // dummy
  private encrypt(st: string): string {
    st = '#@$#%';

    return st;
  }

  async createOrganization(
    request: CreateOrganizationRequestDto,
  ): Promise<CreateOrganizationResponseDto> {
    const organization = new this.organizationModel();

    await OrganizationMapper.toCreateDocument(organization, request).save();

    return OrganizationMapper.toCreateDto(organization);
  }

  async updateOrganization(
    id: string,
    request: UpdateOrganizationRequestDto,
  ): Promise<UpdateOrganizationResponseDto> {
    const organization = await this.organizationModel.findById(id).exec();

    if (!organization) {
      throw new NotFoundException();
    }

    await OrganizationMapper.toUpdateDocument(organization, request).save();

    return OrganizationMapper.toUpdateDto(organization);
  }

  async getOrganizations(): Promise<GetOrganizationResponseDto[]> {
    const organizations = await this.organizationModel.find().exec();

    return organizations.map((organization) =>
      OrganizationMapper.toGetDto(organization),
    );
  }

  async createOrganizationManager(
    id: string,
    request: CreateOrganizationManagerRequestDto,
  ): Promise<CreateOrganizationManagerResponseDto> {
    let manager = new this.userModel();
    const organization = await this.organizationModel.findById(id).exec();

    if (!organization) {
      throw new NotFoundException();
    }

    manager = ManagerMapper.toCreateDocument(manager, request);
    manager.organization = organization;
    manager.personal.password = this.encrypt(manager.personal.password);
    manager.roles.push(UserRoles.org_user);
    await manager.save();

    return ManagerMapper.toCreateDto(manager);
  }

  async updateOrganizationManager(
    id: string,
    request: UpdateOrganizationManagerRequestDto,
  ): Promise<CreateOrganizationManagerResponseDto> {
    const manager = await this.userModel.findById(id).exec();

    if (!manager) {
      throw new NotFoundException();
    }

    await ManagerMapper.toUpdateDocument(manager, request).save();

    return ManagerMapper.toUpdateDto(manager);
  }

  async getOrganizationManagers(
    id: string,
  ): Promise<GetOrganizationManagerResponseDto[]> {
    const organization = await this.organizationModel.findById(id).exec();

    if (!organization) {
      throw new NotFoundException();
    }

    const managers = await this.userModel
      .find({ organization: organization })
      .exec();

    return managers.map((manager) => ManagerMapper.toGetDto(manager));
  }
}
