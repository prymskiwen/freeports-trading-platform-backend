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
import { ROLE_MANAGER } from 'src/schema/role/role.schema';
import { DeskDocument } from 'src/schema/desk/desk.schema';
import { RoleDesk, RoleDeskDocument } from 'src/schema/role/role-desk.schema';
import { CreateRoleOrganizationRequestDto } from './dto/create-role-organization-request.dto';
import { CreateRoleDeskRequestDto } from './dto/create-role-desk-request.dto';
import { CreateRoleClearerRequestDto } from './dto/clearer/create-role-clearer-request.dto';
import { CreateRoleDeskMultiRequestDto } from './dto/create-role-desk-multi-request.dto';
import {
  RoleDeskMulti,
  RoleDeskMultiDocument,
} from 'src/schema/role/role-desk-multi.schema';
import { UpdateRoleClearerRequestDto } from './dto/clearer/update-role-clearer-request.dto';
import { UpdateRoleOrganizationRequestDto } from './dto/update-role-organization-request.dto';
import { UpdateRoleDeskMultiRequestDto } from './dto/update-role-desk-multi.dto';
import { UpdateRoleDeskRequestDto } from './dto/update-role-desk.dto';
import {
  PermissionClearer,
  PermissionOrganization,
} from 'src/schema/role/permission.helper';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(RoleClearer.name)
    private roleClearerModel: Model<RoleClearerDocument>,
    @InjectModel(RoleOrganization.name)
    private roleOrganizationModel: Model<RoleOrganizationDocument>,
    @InjectModel(RoleDesk.name)
    private roleDeskModel: Model<RoleDeskDocument>,
    @InjectModel(RoleDeskMulti.name)
    private roleDeskMultiModel: Model<RoleDeskMultiDocument>,
  ) {}

  async createRoleClearerManager(
    user: UserDocument,
    persist = true,
  ): Promise<RoleClearerDocument> {
    const role = new this.roleClearerModel();

    role.name = ROLE_MANAGER;
    role.system = true;
    role.owner = user;
    role.permissions = Object.values(PermissionClearer);

    if (persist) {
      await role.save();
    }

    return role;
  }

  async getRoleClearerManager(): Promise<RoleClearerDocument> {
    return await this.roleClearerModel
      .findOne({ name: ROLE_MANAGER, system: true })
      .exec();
  }

  async createRoleClearer(
    request: CreateRoleClearerRequestDto,
    user: UserDocument,
  ): Promise<RoleClearerDocument> {
    const role = new this.roleClearerModel();

    role.name = request.name;
    role.system = false;
    role.owner = user;
    role.permissions = request.permissions;
    await role.save();

    return role;
  }

  async getRoleClearerList(): Promise<RoleClearerDocument[]> {
    return await this.roleClearerModel
      .find({
        $or: [{ system: { $exists: false } }, { system: false }],
      })
      .exec();
  }

  async getRoleClearerById(id: string): Promise<RoleClearerDocument> {
    return await this.roleClearerModel.findById(id).exec();
  }

  async updateRoleClearer(
    role: RoleClearerDocument,
    request: UpdateRoleClearerRequestDto,
    persist = true,
  ): Promise<RoleClearerDocument> {
    role.name = request.name;
    role.permissions = request.permissions;

    if (persist) {
      await role.save();
    }

    return role;
  }

  async createRoleOrganizationManager(
    organization: OrganizationDocument,
    user: UserDocument,
    persist = true,
  ): Promise<RoleOrganizationDocument> {
    const role = new this.roleOrganizationModel();

    role.name = ROLE_MANAGER;
    role.system = true;
    role.owner = user;
    role.organization = organization;
    role.permissions = Object.values(PermissionOrganization);

    if (persist) {
      await role.save();
    }

    return role;
  }

  async getRoleOrganizationManager(
    organization: OrganizationDocument,
  ): Promise<RoleOrganizationDocument> {
    return await this.roleOrganizationModel
      .findOne({ organization: organization, name: ROLE_MANAGER, system: true })
      .exec();
  }

  async createRoleOrganization(
    organization: OrganizationDocument,
    request: CreateRoleOrganizationRequestDto,
    user: UserDocument,
  ): Promise<RoleOrganizationDocument> {
    const role = new this.roleOrganizationModel();

    role.name = request.name;
    role.system = false;
    role.owner = user;
    role.organization = organization;
    role.permissions = request.permissions;
    await role.save();

    return role;
  }

  async getRoleOrganizationList(
    organization: OrganizationDocument,
  ): Promise<RoleOrganizationDocument[]> {
    return await this.roleOrganizationModel
      .find({
        organization: organization,
        $or: [{ system: { $exists: false } }, { system: false }],
      })
      .exec();
  }

  async getRoleOrganizationById(
    roleId: string,
    organization: OrganizationDocument,
  ): Promise<RoleOrganizationDocument> {
    return await this.roleOrganizationModel
      .findOne({
        _id: roleId,
        organization: organization,
      })
      .exec();
  }

  async updateRoleOrganization(
    role: RoleOrganizationDocument,
    request: UpdateRoleOrganizationRequestDto,
    persist = true,
  ): Promise<RoleOrganizationDocument> {
    role.name = request.name;
    role.permissions = request.permissions;

    if (persist) {
      await role.save();
    }

    return role;
  }

  async createRoleDesk(
    desk: DeskDocument,
    request: CreateRoleDeskRequestDto,
    user: UserDocument,
  ): Promise<RoleDeskDocument> {
    const role = new this.roleDeskModel();

    role.name = request.name;
    role.system = false;
    role.owner = user;
    role.desk = desk;
    role.permissions = request.permissions;
    await role.save();

    return role;
  }

  async getRoleDeskList(desk: DeskDocument): Promise<RoleDeskDocument[]> {
    return await this.roleDeskModel
      .find({
        desk: desk,
        $or: [{ system: { $exists: false } }, { system: false }],
      })
      .exec();
  }

  async getRoleDeskById(
    roleId: string,
    desk: DeskDocument,
  ): Promise<RoleDeskDocument> {
    return await this.roleDeskModel
      .findOne({
        _id: roleId,
        desk: desk,
      })
      .exec();
  }

  async updateRoleDesk(
    role: RoleDeskDocument,
    request: UpdateRoleDeskRequestDto,
    persist = true,
  ): Promise<RoleDeskDocument> {
    role.name = request.name;
    role.permissions = request.permissions;

    if (persist) {
      await role.save();
    }

    return role;
  }

  async createRoleDeskMulti(
    organization: OrganizationDocument,
    request: CreateRoleDeskMultiRequestDto,
    user: UserDocument,
  ): Promise<RoleDeskMultiDocument> {
    const role = new this.roleDeskMultiModel();

    role.name = request.name;
    role.system = false;
    role.owner = user;
    role.organization = organization;
    role.permissions = request.permissions;
    await role.save();

    return role;
  }

  async getRoleDeskMultiList(
    organization: OrganizationDocument,
  ): Promise<RoleDeskMultiDocument[]> {
    return await this.roleDeskMultiModel
      .find({
        organization: organization,
        $or: [{ system: { $exists: false } }, { system: false }],
      })
      .exec();
  }

  async getRoleDeskMultiById(
    roleId: string,
    organization: OrganizationDocument,
  ): Promise<RoleDeskMultiDocument> {
    return await this.roleDeskMultiModel
      .findOne({
        _id: roleId,
        organization: organization,
      })
      .exec();
  }

  async updateRoleDeskMulti(
    role: RoleDeskMultiDocument,
    request: UpdateRoleDeskMultiRequestDto,
    persist = true,
  ): Promise<RoleDeskMultiDocument> {
    role.name = request.name;
    role.permissions = request.permissions;

    if (persist) {
      await role.save();
    }

    return role;
  }
}
