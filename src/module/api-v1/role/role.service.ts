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
import { PermissionOrganization } from 'src/schema/role/enum/permission.enum';
import { Role, RoleDocument, ROLE_DEFAULT } from 'src/schema/role/role.schema';
import { DeskDocument } from 'src/schema/desk/desk.schema';
import { RoleDesk, RoleDeskDocument } from 'src/schema/role/role-desk.schema';

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

  async findById(id: string): Promise<RoleDocument> {
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

  async getRoleDeskDefault(desk: DeskDocument): Promise<RoleDeskDocument> {
    return await this.roleDeskModel
      .findOne({ desk: desk, name: ROLE_DEFAULT })
      .exec();
  }
}
