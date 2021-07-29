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
import { RoleDocument } from 'src/schema/role/role.schema';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { MailService } from '../mail/mail.service';
import {
  UserPublicKey,
  UserPublicKeyDocument,
} from 'src/schema/user/embedded/user-public-key.embedded';
import { CreateUserPublicKeyRequestDto } from './dto/public-key/create-user-public-key-request.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(UserPublicKey.name)
    private userPublicKeyModel: Model<UserPublicKeyDocument>,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

  async createPublicKey(
    user: UserDocument,
    request: CreateUserPublicKeyRequestDto,
    persist = true,
  ): Promise<UserPublicKeyDocument> {
    const publicKey = new this.userPublicKeyModel();

    publicKey.key = request.key;

    user.publicKeys.push(publicKey);

    if (persist) {
      await user.save();
    }

    return publicKey;
  }

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

  async getDeskUserById(id: string, desk: DeskDocument): Promise<UserDocument> {
    const user = await this.userModel
      .findOne({
        _id: id,
        $and: [
          { organization: { $exists: true } },
          { organization: desk.organization },
        ],
      })
      .exec();

    if (!user) {
      return null;
    }

    // TODO: could it be better to make it in query?
    // check the user belongs to the desk by have desk permission
    const permissions: string[] = await user.get('permissions');
    const hasDesk = permissions.some((permission: string) =>
      permission.startsWith(`desk.${desk.id}`),
    );

    if (!hasDesk) {
      return null;
    }

    return user;
  }

  async create(
    request: CreateUserRequestDto,
    persist = true,
  ): Promise<UserDocument> {
    const user = new this.userModel();

    user.personal = {
      email: request.email,
      nickname: request.nickname,
      phone: request.phone,
      avatar: request.avatar,
      jobTitle: request.jobTitle,
    };

    if (request.password) {
      user.personal.password = await bcrypt.hash(request.password, 13);
    }

    if (persist) {
      await user.save();
      
      if(!request.password) {
        const resetPasswordToken = this.jwtService.sign(
          { user_id: user._id }
        );
        await this.mailService.sendResetPasswordEmail(user, resetPasswordToken);    
      }
    }

    await this.mailService.sendUserConfirmation(user, user._id);

    return user;
  }

  async updatePassword(
    userId: string,
    newPassword: string,
  ): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);
    user.personal.password = await bcrypt.hash(newPassword, 13);
    user.save();
    return user;
  }

  async update(
    user: UserDocument,
    request: UpdateUserRequestDto,
    persist = true,
  ): Promise<UserDocument> {
    Object.keys(request).forEach((key) => {
      user.personal[key] = request[key];
    });

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
                $exists: true,
                $elemMatch: { $eq: desk._id },
              },
            },
            {
              user_roles: {
                $elemMatch: {
                  kind: RoleDesk.name,
                  desk: desk._id,
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

  async getDeskUserCount(desk: DeskDocument): Promise<number> {
    const result = await this.userModel.aggregate([
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
                $exists: true,
                $elemMatch: { $eq: desk._id },
              },
            },
            {
              user_roles: {
                $elemMatch: {
                  kind: RoleDesk.name,
                  desk: desk._id,
                },
              },
            },
          ],
        },
      },
      {
        $count: 'total',
      },
    ]);

    return result[0]?.total || 0;
  }

  async getByRolePaginated(
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

  async unassignRole(role: RoleDocument, user: UserDocument) {
    await this.userModel.updateOne(
      { _id: user.id },
      { $pull: { roles: { role: role._id } } },
    );
  }
}
