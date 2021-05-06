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

@Injectable()
export class AdminService {
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
    createRequest: CreateOrganizationRequestDto,
  ): Promise<CreateOrganizationResponseDto> {
    const organization = new this.organizationModel();

    organization.details = createRequest;
    await organization.save();

    return {
      id: organization._id,
    };
  }

  async createOrganizationManager(
    organizationId: string,
    createRequest: CreateOrganizationManagerRequestDto,
  ): Promise<CreateOrganizationManagerResponseDto> {
    const manager = new this.userModel();
    const organization = await this.organizationModel
      .findById(organizationId)
      .exec();

    if (!organization) {
      throw new NotFoundException();
    }

    manager.organization = organization;
    manager.personal.email = createRequest.email;
    manager.personal.nickname = createRequest.nickname;
    manager.personal.password = this.encrypt(createRequest.password);
    manager.roles.push(UserRoles.org_user);
    await manager.save();

    return {
      id: manager._id,
    };
  }
}
