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
import { CreateRoleOrganizationRequestDto } from './dto/organization/create-role-organization-request.dto';
import { CreateRoleDeskRequestDto } from './dto/desk/create-role-desk-request.dto';
import { CreateRoleClearerRequestDto } from './dto/clearer/create-role-clearer-request.dto';
import { CreateRoleMultideskRequestDto } from './dto/multidesk/create-role-multidesk-request.dto';
import {
  RoleMultidesk,
  RoleMultideskDocument,
} from 'src/schema/role/role-multidesk.schema';
import { UpdateRoleClearerRequestDto } from './dto/clearer/update-role-clearer-request.dto';
import { UpdateRoleMultideskRequestDto } from './dto/multidesk/update-role-multidesk-request.dto';
import { UpdateRoleDeskRequestDto } from './dto/desk/update-role-desk-request.dto';
import {
  PermissionClearer,
  PermissionOrganization,
} from 'src/schema/role/permission.helper';
import { UserService } from '../user/user.service';
import { UpdateRoleOrganizationRequestDto } from './dto/organization/update-role-organization-request.dto';
import { DeskService } from '../desk/desk.service';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(RoleClearer.name)
    private roleClearerModel: Model<RoleClearerDocument>,
    @InjectModel(RoleOrganization.name)
    private roleOrganizationModel: Model<RoleOrganizationDocument>,
    @InjectModel(RoleDesk.name)
    private roleDeskModel: Model<RoleDeskDocument>,
    @InjectModel(RoleMultidesk.name)
    private roleMultideskModel: Model<RoleMultideskDocument>,
    private deskService: DeskService,
    private userService: UserService,
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

  async getOrganizationRoleDeskList(
    desks: DeskDocument[],
  ): Promise<RoleDeskDocument[]> {
    return await this.roleDeskModel
      .find({
        desk: { $in: desks.map((desk) => desk._id) },
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

  async createRoleMultidesk(
    organization: OrganizationDocument,
    request: CreateRoleMultideskRequestDto,
    user: UserDocument,
  ): Promise<RoleMultideskDocument> {
    const role = new this.roleMultideskModel();

    role.name = request.name;
    role.system = false;
    role.owner = user;
    role.organization = organization;
    role.permissions = request.permissions;
    await role.save();

    return role;
  }

  async getRoleMultideskList(
    organization: OrganizationDocument,
  ): Promise<RoleMultideskDocument[]> {
    return await this.roleMultideskModel
      .find({
        organization: organization,
        $or: [{ system: { $exists: false } }, { system: false }],
      })
      .exec();
  }

  async getRoleMultideskById(
    roleId: string,
    organization: OrganizationDocument,
  ): Promise<RoleMultideskDocument> {
    return await this.roleMultideskModel
      .findOne({
        _id: roleId,
        organization: organization,
      })
      .exec();
  }

  async updateRoleMultidesk(
    role: RoleMultideskDocument,
    request: UpdateRoleMultideskRequestDto,
    persist = true,
  ): Promise<RoleMultideskDocument> {
    role.name = request.name;
    role.permissions = request.permissions;

    if (persist) {
      await role.save();
    }

    return role;
  }

  async assignRoleClearer(
    roles: string[],
    user: UserDocument,
    assignedBy: UserDocument,
  ) {
    await Promise.all(
      roles.map(async (roleId) => {
        const role = await this.getRoleClearerById(roleId);
        if (!role) {
          return;
        }

        const assigned = role.users.some((userId) => {
          return userId.toString() === user.id;
        });
        if (assigned) {
          return;
        }

        user.roles.push({
          role: role.id,
          assignedAt: new Date(),
          assignedBy: assignedBy.id,
        });

        role.users.push(user.id);

        await role.save();
      }),
    );

    await user.save();
  }

  async unassignRoleClearer(roles: string[], user: UserDocument) {
    await Promise.all(
      roles.map(async (roleId) => {
        const role = await this.getRoleClearerById(roleId);
        if (!role) {
          return;
        }

        const assigned = role.users.some((userId) => {
          return userId.toString() === user.id;
        });
        if (!assigned) {
          return;
        }

        await this.roleClearerModel.updateOne(
          { _id: role.id },
          { $pull: { users: user._id } },
        );

        await this.userService.unassignRole(role, user);
      }),
    );
  }

  async updateRoleClearerOfUser(
    roles: string[],
    user: UserDocument,
    assignedBy: UserDocument,
  ) {
    await this.resetRoleClearerOfUser(user);

    if (roles.length) {
      return this.assignRoleClearer(roles, user, assignedBy);
    } else {
      await user.save();
    }
  }

  async resetRoleClearerOfUser(user: UserDocument) {
    return this.unassignRoleClearer(
      user.roles.map((r) => {
        return r.role.toString();
      }),
      user,
    );
  }

  async assignRoleOrganization(
    roles: string[],
    organization: OrganizationDocument,
    user: UserDocument,
    assignedBy: UserDocument,
  ) {
    await Promise.all(
      roles.map(async (roleId) => {
        const role = await this.getRoleOrganizationById(roleId, organization);
        if (!role) {
          return;
        }

        const assigned = role.users.some((userId) => {
          return userId.toString() === user.id;
        });
        if (assigned) {
          return;
        }

        user.roles.push({
          role: role.id,
          assignedAt: new Date(),
          assignedBy: assignedBy.id,
        });

        role.users.push(user.id);

        await role.save();
      }),
    );

    await user.save();
  }

  async unassignRoleOrganization(
    roles: string[],
    organization: OrganizationDocument,
    user: UserDocument,
  ) {
    await Promise.all(
      roles.map(async (roleId) => {
        const role = await this.getRoleOrganizationById(roleId, organization);
        if (!role) {
          return;
        }

        const assigned = role.users.some((userId) => {
          return userId.toString() === user.id;
        });
        if (!assigned) {
          return;
        }

        await this.roleOrganizationModel.updateOne(
          { _id: role.id },
          { $pull: { users: user._id } },
        );

        await this.userService.unassignRole(role, user);
      }),
    );
  }

  async updateRoleOrganizationOfUser(
    roles: string[],
    organization: OrganizationDocument,
    user: UserDocument,
    assignedBy: UserDocument,
  ) {
    await this.resetRoleOrganizationOfUser(organization, user);

    if (roles.length) {
      return this.assignRoleOrganization(roles, organization, user, assignedBy);
    } else {
      await user.save();
    }
  }

  async resetRoleOrganizationOfUser(
    organization: OrganizationDocument,
    user: UserDocument,
  ) {
    return this.unassignRoleOrganization(
      user.roles.map((r) => {
        return r.role.toString();
      }),
      organization,
      user,
    );
  }

  async assignRoleMultidesk(
    roles: string[],
    desks: string[],
    organization: OrganizationDocument,
    user: UserDocument,
    assignedBy: UserDocument,
  ) {
    await Promise.all(
      roles.map(async (roleId) => {
        const effectiveDesks = [];
        const role = await this.getRoleMultideskById(roleId, organization);
        if (!role) {
          return;
        }

        const assigned = role.users.some((userId) => {
          return userId.toString() === user.id;
        });
        if (assigned) {
          return;
        }

        await Promise.all(
          desks.map(async (deskId) => {
            const desk = await this.deskService.getById(deskId);

            if (!desk) {
              return;
            }

            if (desk.organization.toString() !== organization.id) {
              return;
            }

            effectiveDesks.push(desk);
          }),
        );

        user.roles.push({
          effectiveDesks: [...effectiveDesks],
          role: role.id,
          assignedAt: new Date(),
          assignedBy: assignedBy.id,
        });

        role.users.push(user.id);

        await role.save();
      }),
    );

    await user.save();
  }

  async unassignRoleMultidesk(
    roles: string[],
    organization: OrganizationDocument,
    user: UserDocument,
  ) {
    await Promise.all(
      roles.map(async (roleId) => {
        const role = await this.getRoleMultideskById(roleId, organization);
        if (!role) {
          return;
        }

        const assigned = role.users.some((userId) => {
          return userId.toString() === user.id;
        });
        if (!assigned) {
          return;
        }

        await this.roleMultideskModel.updateOne(
          { _id: role.id },
          { $pull: { users: user._id } },
        );

        await this.userService.unassignRole(role, user);
      }),
    );
  }

  async updateRoleMultideskOfUser(
    roles: string[],
    desks: string[],
    organization: OrganizationDocument,
    user: UserDocument,
    assignedBy: UserDocument,
  ) {
    await this.resetRoleMultideskOfUser(organization, user);

    if (roles.length) {
      return this.assignRoleMultidesk(
        roles,
        desks,
        organization,
        user,
        assignedBy,
      );
    } else {
      await user.save();
    }
  }

  async resetRoleMultideskOfUser(
    organization: OrganizationDocument,
    user: UserDocument,
  ) {
    return this.unassignRoleMultidesk(
      user.roles.map((r) => {
        return r.role.toString();
      }),
      organization,
      user,
    );
  }

  async assignRoleDesk(
    roles: string[],
    desk: DeskDocument,
    user: UserDocument,
    assignedBy: UserDocument,
  ) {
    await Promise.all(
      roles.map(async (roleId) => {
        const role = await this.getRoleDeskById(roleId, desk);
        if (!role) {
          return;
        }

        const assigned = role.users.some((userId) => {
          return userId.toString() === user.id;
        });
        if (assigned) {
          return;
        }

        user.roles.push({
          role: role.id,
          assignedAt: new Date(),
          assignedBy: assignedBy.id,
        });

        role.users.push(user.id);

        await role.save();
      }),
    );

    await user.save();
  }

  async unassignRoleDesk(
    roles: string[],
    desk: DeskDocument,
    user: UserDocument,
  ) {
    await Promise.all(
      roles.map(async (roleId) => {
        const role = await this.getRoleDeskById(roleId, desk);
        if (!role) {
          return;
        }

        const assigned = role.users.some((userId) => {
          return userId.toString() === user.id;
        });
        if (!assigned) {
          return;
        }

        await this.roleDeskModel.updateOne(
          { _id: role.id },
          { $pull: { users: user._id } },
        );

        await this.userService.unassignRole(role, user);
      }),
    );
  }

  async updateRoleDeskOfUser(
    roles: string[],
    desk: DeskDocument,
    user: UserDocument,
    assignedBy: UserDocument,
  ) {
    await this.resetRoleDeskOfUser(desk, user);

    if (roles.length) {
      return this.assignRoleDesk(roles, desk, user, assignedBy);
    } else {
      await user.save();
    }
  }

  async resetRoleDeskOfUser(desk: DeskDocument, user: UserDocument) {
    return this.unassignRoleDesk(
      user.roles.map((r) => {
        return r.role.toString();
      }),
      desk,
      user,
    );
  }
}
