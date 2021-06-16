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
  RoleDocument,
  ROLE_ADMIN,
  ROLE_DEFAULT,
} from 'src/schema/role/role.schema';
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

  async getUserOfClearerById(id: string): Promise<UserDocument> {
    const users = await this.userModel
      .aggregate([
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
              { _id: id },
              {
                user_roles: {
                  $elemMatch: {
                    kind: RoleClearer.name,
                    name: ROLE_DEFAULT,
                    system: true,
                  },
                },
              },
            ],
          },
        },
      ])
      .exec();

    if (!Array.isArray(users) || users.length !== 1) {
      return null;
    }

    return this.userModel.hydrate(users[0]);
  }

  async getManagerOfOrganizationById(
    id: string,
    organization: OrganizationDocument,
  ): Promise<UserDocument> {
    const users = await this.userModel
      .aggregate([
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
              { _id: id },
              {
                user_roles: {
                  $all: [
                    {
                      $elemMatch: {
                        kind: RoleOrganization.name,
                        name: ROLE_DEFAULT,
                        organization: organization._id,
                        system: true,
                      },
                    },
                    {
                      $elemMatch: {
                        kind: RoleOrganization.name,
                        name: ROLE_ADMIN,
                        organization: organization._id,
                        system: false,
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ])
      .exec();

    if (!Array.isArray(users) || users.length !== 1) {
      return null;
    }

    return this.userModel.hydrate(users[0]);
  }

  async getUserOfOrganizationById(
    id: string,
    organization: OrganizationDocument,
  ): Promise<UserDocument> {
    const users = await this.userModel
      .aggregate([
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
              { _id: id },
              {
                user_roles: {
                  $elemMatch: {
                    kind: RoleOrganization.name,
                    name: ROLE_DEFAULT,
                    organization: organization._id,
                    system: true,
                  },
                },
              },
            ],
          },
        },
      ])
      .exec();

    if (!Array.isArray(users) || users.length !== 1) {
      return null;
    }

    return this.userModel.hydrate(users[0]);
  }

  async getUserOfDeskById(
    id: string,
    desk: DeskDocument,
  ): Promise<UserDocument> {
    const users = await this.userModel
      .aggregate([
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
              { _id: id },
              {
                user_roles: {
                  $elemMatch: {
                    kind: RoleDesk.name,
                    name: ROLE_DEFAULT,
                    desk: desk._id,
                    system: true,
                  },
                },
              },
            ],
          },
        },
      ])
      .exec();

    if (!Array.isArray(users) || users.length !== 1) {
      return null;
    }

    return this.userModel.hydrate(users[0]);
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

  async getUserOfClearerPaginated(
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
          user_roles: {
            $elemMatch: {
              kind: RoleClearer.name,
              name: ROLE_DEFAULT,
              system: true,
            },
          },
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

  async getManagerOfOrganizationPaginated(
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
          user_roles: {
            $all: [
              {
                $elemMatch: {
                  kind: RoleOrganization.name,
                  name: ROLE_DEFAULT,
                  organization: organization._id,
                  system: true,
                },
              },
              {
                $elemMatch: {
                  kind: RoleOrganization.name,
                  name: ROLE_ADMIN,
                  organization: organization._id,
                  system: false,
                },
              },
            ],
          },
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

  async getActiveUserCountOfOrganization(organization: OrganizationDocument): Promise<any> {
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
          user_roles: {
            $elemMatch: {
              kind: RoleOrganization.name,
              name: ROLE_DEFAULT,
              organization: organization._id,
              system: true,
            },
          },
        },
      },
    ];
     const users = await this.userModel.aggregate([
      ...query,
      {
        $facet: {
          totalResult: [{ $count: 'total' }],
        },
      },
    ]);
    return users.length;
  }

  async getDisActiveUserCountOfOrganization(organization: OrganizationDocument): Promise<any> {
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
          user_roles: {
            $elemMatch: {
              kind: RoleOrganization.name,
              name: ROLE_DEFAULT,
              organization: organization._id,
              system: false,
            },
          },
        },
      },
    ];
     const users = await this.userModel.aggregate([
      ...query,
      {
        $facet: {
          totalResult: [{ $count: 'total' }],
        },
      },
    ]);
    return users;
  }


  async getUserOfOrganizationPaginated(
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
          user_roles: {
            $elemMatch: {
              kind: RoleOrganization.name,
              name: ROLE_DEFAULT,
              organization: organization._id,
              system: true,
            },
          },
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

  async getUserOfDeskPaginated(
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
          user_roles: {
            $elemMatch: {
              kind: RoleDesk.name,
              name: ROLE_DEFAULT,
              desk: desk._id,
              system: true,
            },
          },
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

  async getUserOfRolePaginated(
    role: RoleDocument,
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
        $match: {
          roles: { $elemMatch: { role: role._id } },
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

  async deleteRole(role: RoleDocument) {
    await this.userModel.updateMany({ $pull: { roles: { role: role._id } } });
  }
}
