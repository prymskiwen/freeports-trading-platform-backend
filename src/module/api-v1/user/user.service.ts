import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schema/user/user.schema';
import * as bcrypt from 'bcrypt';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { OrganizationDocument } from 'src/schema/organization/organization.schema';
import { PaginationRequest } from 'src/pagination/pagination-request.interface';
import { RoleOrganization } from 'src/schema/role/role-organization.schema';
import { DeskDocument } from 'src/schema/desk/desk.schema';
import { RoleDesk } from 'src/schema/role/role-desk.schema';
import {
  PermissionClearer,
  PermissionDesk,
  PermissionOrganization,
} from 'src/schema/role/enum/permission.enum';
import { ROLE_DEFAULT } from 'src/schema/role/role.schema';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { RoleClearer } from 'src/schema/role/role-clearer.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getById(id: string): Promise<UserDocument> {
    return await this.userModel.findById(id).exec();
  }

  async getByEmail(email: string): Promise<UserDocument> {
    return await this.userModel.findOne({ 'personal.email': email }).exec();
  }

  async ensureClearer(user: UserDocument): Promise<boolean> {
    const userPermissions: string[] = await user.get('permissions');

    return userPermissions.includes(PermissionClearer.Default);
  }

  async ensureOrganization(
    user: UserDocument,
    organization: OrganizationDocument,
  ): Promise<boolean> {
    const userPermissions: string[] = await user.get('permissions');
    const permissionDefault = PermissionOrganization.Default.replace(
      '#organizationId#',
      organization.id,
    );

    return userPermissions.includes(permissionDefault);
  }

  async ensureDesk(user: UserDocument, desk: DeskDocument): Promise<boolean> {
    const userPermissions: string[] = await user.get('permissions');
    const permissionDefault = PermissionDesk.Default.replace(
      '#deskId#',
      desk.id,
    );

    return userPermissions.includes(permissionDefault);
  }

  async create(
    request: CreateUserRequestDto,
    persist = true,
  ): Promise<UserDocument> {
    const user = new this.userModel();

    user.personal = {
      email: request.email,
      nickname: request.nickname,
      password: await bcrypt.hash(request.password, 13),
    };

    if (persist) {
      await user.save();
    }

    return user;
  }

  async update(
    user: UserDocument,
    request: UpdateUserRequestDto,
    persist = true,
  ): Promise<UserDocument> {
    user.personal.nickname = request.nickname;
    user.personal.email = request.email;

    await user.save();

    if (persist) {
      await user.save();
    }

    return user;
  }

  async getClearerManagersPaginated(
    pagination: PaginationRequest,
  ): Promise<any[]> {
    const {
      skip,
      limit,
      order,
      params: { search },
    } = pagination;

    const query: any[] = [
      {
        $lookup: {
          from: 'roles',
          localField: 'roles.role',
          foreignField: '_id',
          as: 'user_roles',
        },
      },
      {
        $match: {
          $and: [
            { 'user_roles.kind': RoleClearer.name },
            { 'user_roles.name': ROLE_DEFAULT },
          ],
        },
      },
    ];

    if (search) {
      query.push({
        $match: {
          $or: [
            {
              'personal.nickname': {
                $regex: '.*' + search + '.*',
                $options: 'i',
              },
            },
            {
              'personal.email': { $regex: '.*' + search + '.*', $options: 'i' },
            },
          ],
        },
      });
    }
    if (Object.keys(order).length) {
      query.push({ $sort: order });
    }

    return await this.userModel.aggregate([
      ...query,
      {
        $facet: {
          paginatedResult: [{ $skip: skip }, { $limit: limit }],
          totalResult: [{ $count: 'total' }],
        },
      },
    ]);
  }

  async getOrganizationManagersPaginated(
    organization: OrganizationDocument,
    pagination: PaginationRequest,
  ): Promise<any[]> {
    const {
      skip,
      limit,
      order,
      params: { search },
    } = pagination;

    const query: any[] = [
      {
        $lookup: {
          from: 'roles',
          localField: 'roles.role',
          foreignField: '_id',
          as: 'user_roles',
        },
      },
      {
        $match: {
          $and: [
            { 'user_roles.kind': RoleOrganization.name },
            { 'user_roles.name': ROLE_DEFAULT },
            { 'user_roles.organization': organization._id },
          ],
        },
      },
    ];

    if (search) {
      query.push({
        $match: {
          $or: [
            {
              'personal.nickname': {
                $regex: '.*' + search + '.*',
                $options: 'i',
              },
            },
            {
              'personal.email': { $regex: '.*' + search + '.*', $options: 'i' },
            },
          ],
        },
      });
    }
    if (Object.keys(order).length) {
      query.push({ $sort: order });
    }

    return await this.userModel.aggregate([
      ...query,
      {
        $facet: {
          paginatedResult: [{ $skip: skip }, { $limit: limit }],
          totalResult: [{ $count: 'total' }],
        },
      },
    ]);
  }

  async getDeskManagersPaginated(
    desk: DeskDocument,
    pagination: PaginationRequest,
  ): Promise<any[]> {
    const {
      skip,
      limit,
      order,
      params: { search },
    } = pagination;

    const query: any[] = [
      {
        $lookup: {
          from: 'roles',
          localField: 'roles.role',
          foreignField: '_id',
          as: 'user_roles',
        },
      },
      {
        $match: {
          $and: [
            { 'user_roles.kind': RoleDesk.name },
            { 'user_roles.name': ROLE_DEFAULT },
            { 'user_roles.desk': desk._id },
          ],
        },
      },
    ];

    if (search) {
      query.push({
        $match: {
          $or: [
            {
              'personal.nickname': {
                $regex: '.*' + search + '.*',
                $options: 'i',
              },
            },
            {
              'personal.email': { $regex: '.*' + search + '.*', $options: 'i' },
            },
          ],
        },
      });
    }
    if (Object.keys(order).length) {
      query.push({ $sort: order });
    }

    return await this.userModel.aggregate([
      ...query,
      {
        $facet: {
          paginatedResult: [{ $skip: skip }, { $limit: limit }],
          totalResult: [{ $count: 'total' }],
        },
      },
    ]);
  }
}
