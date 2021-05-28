import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schema/user/user.schema';
import * as bcrypt from 'bcrypt';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { OrganizationDocument } from 'src/schema/organization/organization.schema';
import { PaginationRequest } from 'src/pagination/pagination-request.interface';
import { RoleOrganization } from 'src/schema/role/role-organization.schema';
import { UserMapper } from './mapper/user.mapper';
import { PaginationHelper } from 'src/pagination/pagination.helper';
import { PaginationResponseDto } from 'src/pagination/pagination-response.dto';
import { GetUserResponseDto } from './dto/get-user-response.dto';
import { DeskDocument } from 'src/schema/desk/desk.schema';
import { RoleDesk } from 'src/schema/role/role-desk.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findById(id: string): Promise<UserDocument> {
    return await this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return await this.userModel.findOne({ 'personal.email': email }).exec();
  }

  async create(
    request: CreateUserRequestDto,
    persist = true,
  ): Promise<UserDocument> {
    const user = new this.userModel();

    user.personal.email = request.email;
    user.personal.nickname = request.nickname;
    user.personal.password = await bcrypt.hash(request.password, 13);

    if (persist) {
      await user.save();
    }

    return user;
  }

  async getOrganizationManagers(
    organization: OrganizationDocument,
    pagination: PaginationRequest,
  ): Promise<PaginationResponseDto<GetUserResponseDto>> {
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
            { organization: organization._id },
            { 'user_roles.kind': RoleOrganization.name },
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

    const [{ paginatedResult, totalResult }] = await this.userModel.aggregate([
      ...query,
      {
        $facet: {
          paginatedResult: [{ $skip: skip }, { $limit: limit }],
          totalResult: [{ $count: 'total' }],
        },
      },
    ]);

    const userDtos = paginatedResult.map((user) => UserMapper.toGetDto(user));

    return PaginationHelper.of(
      pagination,
      totalResult[0]?.total || 0,
      userDtos,
    );
  }

  async getDeskManagers(
    desk: DeskDocument,
    pagination: PaginationRequest,
  ): Promise<PaginationResponseDto<GetUserResponseDto>> {
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
            { organization: desk.organization },
            { 'user_roles.kind': RoleDesk.name },
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

    const [{ paginatedResult, totalResult }] = await this.userModel.aggregate([
      ...query,
      {
        $facet: {
          paginatedResult: [{ $skip: skip }, { $limit: limit }],
          totalResult: [{ $count: 'total' }],
        },
      },
    ]);

    const userDtos = paginatedResult.map((user) => UserMapper.toGetDto(user));

    return PaginationHelper.of(
      pagination,
      totalResult[0]?.total || 0,
      userDtos,
    );
  }
}
