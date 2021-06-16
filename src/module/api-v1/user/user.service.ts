import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schema/user/user.schema';
import * as bcrypt from 'bcrypt';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { OrganizationDocument } from 'src/schema/organization/organization.schema';
import { PaginationRequest } from 'src/pagination/pagination-request.interface';
import { DeskDocument } from 'src/schema/desk/desk.schema';
import { RoleDesk } from 'src/schema/role/role-desk.schema';
import { RoleOrganization } from 'src/schema/role/role-organization.schema';
import { RoleDocument, ROLE_MANAGER } from 'src/schema/role/role.schema';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getById(id: string): Promise<UserDocument> {
    return await this.userModel.findById(id).exec();
  }

  async getByEmail(email: string): Promise<UserDocument> {
    return await this.userModel.findOne({ 'personal.email': email }).exec();
  }

  async getClearerUserById(id: string): Promise<UserDocument> {
    return await this.userModel
      .findOne({
        _id: id,
        $or: [{ organization: { $exists: false } }, { organization: null }],
      })
      .exec();
  }

  async getOrganizationUserById(
    id: string,
    organization: OrganizationDocument,
  ): Promise<UserDocument> {
    return await this.userModel
      .findOne({
        _id: id,
        $and: [
          { organization: { $exists: true } },
          { organization: organization._id },
        ],
      })
      .exec();
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

  async getClearerUserPaginated(pagination: PaginationRequest): Promise<any[]> {
    const {
      skip,
      limit,
      order,
      params: { search },
    } = pagination;

    const query: any[] = [
      {
        $match: {
          $or: [{ organization: { $exists: false } }, { organization: null }],
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

  async getOrganizationUserPaginated(
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
        $match: {
          $and: [
            { organization: { $exists: true } },
            { organization: organization._id },
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
              name: ROLE_MANAGER,
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
              name: ROLE_MANAGER,
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
    return users.length;
  }


  async getDeskUserPaginated(
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
          $or: [
            {
              'roles.effectiveDesks': {
                $and: [{ $exists: true }, { $elemMatch: desk._id }],
              },
            },
            {
              user_roles: {
                $elemMatch: {
                  kind: RoleDesk.name,
                  desk: desk._id,
                  system: true,
                },
              },
            },
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
