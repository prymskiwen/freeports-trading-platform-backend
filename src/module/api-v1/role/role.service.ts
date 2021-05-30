import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/schema/user/user.schema';
import { OrganizationDocument } from 'src/schema/organization/organization.schema';
import {
  RoleOrganization,
  RoleOrganizationDocument,
} from 'src/schema/role/role-organization.schema';
import {
  RoleClearer,
  RoleClearerDocument,
} from 'src/schema/role/role-clearer.schema';
import {
  PermissionDesk,
  PermissionOrganization,
} from 'src/schema/role/enum/permission.enum';
import { Role, RoleDocument, ROLE_DEFAULT } from 'src/schema/role/role.schema';
import { DeskDocument } from 'src/schema/desk/desk.schema';
import { RoleDesk, RoleDeskDocument } from 'src/schema/role/role-desk.schema';
import { CreateRoleOrganizationRequestDto } from './dto/create-role-organization-request.dto';
import { CreateRoleDeskRequestDto } from './dto/create-role-desk-request.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name)
    private roleModel: Model<RoleDocument>,
    @InjectModel(RoleClearer.name)
    private roleClearerModel: Model<RoleClearerDocument>,
    @InjectModel(RoleOrganization.name)
    private roleOrganizationModel: Model<RoleOrganizationDocument>,
    @InjectModel(RoleDesk.name)
    private roleDeskModel: Model<RoleDeskDocument>,
  ) {}

  async getById(id: string): Promise<RoleDocument> {
    return await this.roleModel.findById(id).exec();
  }

  async createRoleOrganizationDefault(
    organization: OrganizationDocument,
    user: UserDocument,
    persist = true,
  ): Promise<RoleOrganizationDocument> {
    const role = new this.roleOrganizationModel();

    role.name = ROLE_DEFAULT;
    role.organization = organization;
    role.owner = user;
    role.permissions.push(PermissionOrganization.Default);

    if (persist) {
      await role.save();
    }

    return role;
  }

  async getRoleOrganizationDefault(
    organization: OrganizationDocument,
  ): Promise<RoleOrganizationDocument> {
    return await this.roleOrganizationModel
      .findOne({ organization: organization, name: ROLE_DEFAULT })
      .exec();
  }

  async createRoleOrganization(
    organization: OrganizationDocument,
    request: CreateRoleOrganizationRequestDto,
    user: UserDocument,
  ): Promise<RoleOrganizationDocument> {
    const role = new this.roleOrganizationModel();

    role.organization = organization;
    role.owner = user;
    role.permissions = request.permissions;
    await role.save();

    return role;
  }

  async createRoleDeskDefault(
    desk: DeskDocument,
    user: UserDocument,
    persist = true,
  ): Promise<RoleDeskDocument> {
    const role = new this.roleDeskModel();

    role.name = ROLE_DEFAULT;
    role.desk = desk;
    role.owner = user;
    role.permissions.push(PermissionDesk.Default);

    if (persist) {
      await role.save();
    }

    return role;
  }

  async getRoleDeskDefault(desk: DeskDocument): Promise<RoleDeskDocument> {
    return await this.roleDeskModel
      .findOne({ desk: desk, name: ROLE_DEFAULT })
      .exec();
  }

  async createRoleDesk(
    desk: DeskDocument,
    request: CreateRoleDeskRequestDto,
    user: UserDocument,
  ): Promise<RoleDeskDocument> {
    const role = new this.roleDeskModel();

    role.desk = desk;
    role.owner = user;
    role.permissions = request.permissions;
    await role.save();

    return role;
  }
}
