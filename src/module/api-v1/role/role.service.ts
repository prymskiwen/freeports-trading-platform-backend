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
  PermissionClearer,
  PermissionDesk,
  PermissionOrganization,
} from 'src/schema/role/enum/permission.enum';
import {
  Role,
  RoleDocument,
  ROLE_ADMIN_INITIAL,
  ROLE_DEFAULT,
} from 'src/schema/role/role.schema';
import { DeskDocument } from 'src/schema/desk/desk.schema';
import { RoleDesk, RoleDeskDocument } from 'src/schema/role/role-desk.schema';
import { CreateRoleOrganizationRequestDto } from './dto/create-role-organization-request.dto';
import { CreateRoleDeskRequestDto } from './dto/create-role-desk-request.dto';
import { CreateRoleClearerRequestDto } from './dto/create-role-clearer-request.dto';
import { CreateRoleDeskMultiRequestDto } from './dto/create-role-desk-multi-request.dto';
import {
  RoleDeskMulti,
  RoleDeskMultiDocument,
} from 'src/schema/role/role-desk-multi.schema';

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
    @InjectModel(RoleDeskMulti.name)
    private roleDeskMultiModel: Model<RoleDeskMultiDocument>,
  ) {}

  async getById(id: string): Promise<RoleDocument> {
    return await this.roleModel.findById(id).exec();
  }

  async createRoleClearerDefault(
    user: UserDocument,
    persist = true,
  ): Promise<RoleClearerDocument> {
    const role = new this.roleClearerModel();

    role.name = ROLE_DEFAULT;
    role.permissions.push(PermissionClearer.Default);
    role.owner = user;

    if (persist) {
      await role.save();
    }

    return role;
  }

  async getRoleClearerDefault(): Promise<RoleClearerDocument> {
    return await this.roleClearerModel.findOne({ name: ROLE_DEFAULT }).exec();
  }

  async createRoleClearerInitial(
    user: UserDocument,
    persist = true,
  ): Promise<RoleClearerDocument> {
    const role = new this.roleClearerModel();

    role.name = ROLE_ADMIN_INITIAL;
    role.permissions = [
      PermissionClearer.CoworkerRead,
      PermissionClearer.CoworkerCreate,
      PermissionClearer.CoworkerUpdate,
      PermissionClearer.CoworkerDisable,

      PermissionClearer.RoleRead,
      PermissionClearer.RoleCreate,
      PermissionClearer.RoleUpdate,
      PermissionClearer.RoleDelete,
      PermissionClearer.RoleAssign,

      PermissionClearer.OrganizationRead,
      PermissionClearer.OrganizationCreate,
      PermissionClearer.OrganizationUpdate,
      PermissionClearer.OrganizationDisable,
    ];
    role.owner = user;

    if (persist) {
      await role.save();
    }

    return role;
  }

  async createRoleClearer(
    request: CreateRoleClearerRequestDto,
    user: UserDocument,
  ): Promise<RoleClearerDocument> {
    const role = new this.roleClearerModel();

    role.name = request.name;
    role.permissions = request.permissions;
    role.owner = user;
    await role.save();

    return role;
  }

  async createRoleOrganizationDefault(
    organization: OrganizationDocument,
    user: UserDocument,
    persist = true,
  ): Promise<RoleOrganizationDocument> {
    const role = new this.roleOrganizationModel();

    role.name = ROLE_DEFAULT;
    role.permissions.push(PermissionOrganization.Default);
    role.organization = organization;
    role.owner = user;

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

    role.name = request.name;
    role.permissions = request.permissions;
    role.organization = organization;
    role.owner = user;
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
    role.permissions.push(PermissionDesk.Default);
    role.desk = desk;
    role.owner = user;

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

    role.name = request.name;
    role.permissions = request.permissions;
    role.desk = desk;
    role.owner = user;
    await role.save();

    return role;
  }

  async createRoleDeskMulti(
    organization: OrganizationDocument,
    request: CreateRoleDeskMultiRequestDto,
    user: UserDocument,
  ): Promise<RoleDeskMultiDocument> {
    const role = new this.roleDeskMultiModel();

    role.name = request.name;
    role.permissions = request.permissions;
    role.organization = organization;
    role.owner = user;
    await role.save();

    return role;
  }
}
