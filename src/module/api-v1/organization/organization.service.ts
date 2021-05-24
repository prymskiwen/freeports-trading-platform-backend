import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schema/user/user.schema';
import {
  Organization,
  OrganizationDocument,
} from 'src/schema/organization/organization.schema';
import { Desk, DeskDocument } from 'src/schema/desk/desk.schema';
import { CreateDeskRequestDto } from './dto/create-desk-request.dto';
import { CreateDeskResponseDto } from './dto/create-desk-response.dto';
import { CreatePermissionManagerRequestDto } from './dto/create-permission-manager-request.dto';
import { CreatePermissionManagerResponseDto } from './dto/create-permission-manager-response.dto';
import * as bcrypt from 'bcrypt';
import {
  RoleOrganization,
  RoleOrganizationDocument,
} from 'src/schema/role/role-organization.schema';
import { CreateRoleOrganizationRequestDto } from './dto/create-role-organization-request.dto';
import { RoleDesk, RoleDeskDocument } from 'src/schema/role/role-desk.schema';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(RoleOrganization.name)
    private roleOrganizationModel: Model<RoleOrganizationDocument>,
    @InjectModel(RoleDesk.name)
    private roleDeskModel: Model<RoleDeskDocument>,
    @InjectModel(Desk.name)
    private deskModel: Model<DeskDocument>,
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async createDesk(
    organizationId: string,
    createRequest: CreateDeskRequestDto,
  ): Promise<CreateDeskResponseDto> {
    const desk = new this.deskModel();
    const organization = await this.organizationModel
      .findById(organizationId)
      .exec();

    if (!organization) {
      throw new NotFoundException();
    }

    desk.name = createRequest.name;
    desk.organization = organization;
    await desk.save();

    return {
      id: desk._id,
    };
  }

  async createDeskPermissionManager(
    deskId: string,
    createRequest: CreatePermissionManagerRequestDto,
  ): Promise<CreatePermissionManagerResponseDto> {
    const manager = new this.userModel();
    const desk = await this.deskModel.findById(deskId).exec();

    if (!desk) {
      throw new NotFoundException();
    }

    manager.organization = desk.organization;
    manager.personal.email = createRequest.email;
    manager.personal.nickname = createRequest.nickname;
    manager.personal.password = await bcrypt.hash(createRequest.password, 13);

    const roleDefault = await this.roleDeskModel
      .findOne({ desk: desk, name: '_default' })
      .exec();
    manager.roles.push(roleDefault);
    await manager.save();

    return {
      id: manager._id,
    };
  }

  async createRole(
    id: string,
    request: CreateRoleOrganizationRequestDto,
    user: UserDocument,
  ): Promise<CreatePermissionManagerResponseDto> {
    const role = new this.roleOrganizationModel();
    const organization = await this.organizationModel.findById(id).exec();

    if (!organization) {
      throw new NotFoundException();
    }

    role.organization = organization;
    role.owner = user;
    role.permissions = request.permissions;
    await role.save();

    return {
      id: role._id,
    };
  }
}
