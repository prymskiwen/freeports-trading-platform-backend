import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/schema/user/user.schema';
import {
  Organization,
  OrganizationDocument,
} from 'src/schema/organization/organization.schema';
import { CreateOrganizationRequestDto } from './dto/create-organization-request.dto';
import { CreateOrganizationResponseDto } from './dto/create-organization-response.dto';
import { CreateOrganizationManagerRequestDto } from './dto/create-organization-manager-request.dto';
import { CreateOrganizationManagerResponseDto } from './dto/create-organization-manager-response.dto';
import { UpdateOrganizationRequestDto } from './dto/update-organization-request.dto';
import { OrganizationMapper } from './mapper/organization.mapper';
import { GetOrganizationResponseDto } from './dto/get-organization-response.dto';
import { UpdateOrganizationManagerRequestDto } from './dto/update-organization-manager-request.dto';
import { UpdateOrganizationResponseDto } from './dto/update-organization-response.dto';
import { ManagerMapper } from './mapper/manager.mapper';
import { GetOrganizationManagerResponseDto } from './dto/get-organization-manager-response.dto';
import { PaginationRequest } from 'src/pagination/pagination-request.interface';
import { PaginationResponseDto } from 'src/pagination/pagination-response.dto';
import { PaginationHelper } from 'src/pagination/pagination.helper';
import { CreateOrganizationAccountRequestDto } from './dto/create-organization-account-request.dto';
import { CreateOrganizationAccountResponseDto } from './dto/create-organization-account-response.dto';
import { Account, AccountDocument } from 'src/schema/account/account.schema';
import { AccountMapper } from './mapper/account.mapper';
import { DeleteOrganizationAccountResponseDto } from './dto/delete-organization-account-response.dto';
import * as bcrypt from 'bcrypt';
import {
  RoleOrganization,
  RoleOrganizationDocument,
} from 'src/schema/role/role-organization.schema';
import { PermissionOrganization } from 'src/schema/role/enum/permission.enum';

@Injectable()
export class ClearerService {
  constructor(
    @InjectModel(RoleOrganization.name)
    private roleClearerModel: Model<RoleOrganizationDocument>,
    @InjectModel(RoleOrganization.name)
    private roleOrganizationModel: Model<RoleOrganizationDocument>,
    @InjectModel(Account.name)
    private accountModel: Model<AccountDocument>,
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async createOrganization(
    request: CreateOrganizationRequestDto,
    user: UserDocument,
  ): Promise<CreateOrganizationResponseDto> {
    const organization = new this.organizationModel();

    await OrganizationMapper.toCreateDocument(organization, request).save();

    const role = new this.roleOrganizationModel();

    if (!organization) {
      throw new NotFoundException();
    }

    role.name = '_default';
    role.organization = organization;
    role.owner = user;
    role.permissions.push(PermissionOrganization.Default);
    await role.save();

    return OrganizationMapper.toCreateDto(organization);
  }

  async updateOrganization(
    id: string,
    request: UpdateOrganizationRequestDto,
  ): Promise<UpdateOrganizationResponseDto> {
    const organization = await this.organizationModel.findById(id).exec();

    if (!organization) {
      throw new NotFoundException();
    }

    await OrganizationMapper.toUpdateDocument(organization, request).save();

    return OrganizationMapper.toUpdateDto(organization);
  }

  async getOrganizations(
    pagination: PaginationRequest,
  ): Promise<PaginationResponseDto<GetOrganizationResponseDto>> {
    const {
      skip,
      limit,
      order,
      params: { search },
    } = pagination;

    const query: any[] = [];

    if (search) {
      query.push({
        $match: {
          'details.name': { $regex: '.*' + search + '.*', $options: 'i' },
        },
      });
    }
    if (Object.keys(order).length) {
      query.push({ $sort: order });
    }

    const [
      { paginatedResult, totalResult },
    ] = await this.organizationModel.aggregate([
      ...query,
      {
        $facet: {
          paginatedResult: [{ $skip: skip }, { $limit: limit }],
          totalResult: [{ $count: 'total' }],
        },
      },
    ]);

    const organizationDtos = paginatedResult.map((organization) =>
      OrganizationMapper.toGetDto(organization),
    );

    return PaginationHelper.of(
      pagination,
      totalResult[0]?.total || 0,
      organizationDtos,
    );
  }

  async createOrganizationManager(
    id: string,
    request: CreateOrganizationManagerRequestDto,
  ): Promise<CreateOrganizationManagerResponseDto> {
    let manager = new this.userModel();
    const organization = await this.organizationModel.findById(id).exec();

    if (!organization) {
      throw new NotFoundException();
    }

    manager = ManagerMapper.toCreateDocument(manager, request);
    manager.organization = organization;
    manager.personal.password = await bcrypt.hash(
      manager.personal.password,
      13,
    );

    const roleDefault = await this.roleOrganizationModel
      .findOne({ organization: organization, name: '_default' })
      .exec();
    manager.roles.push(roleDefault);
    await manager.save();

    return ManagerMapper.toCreateDto(manager);
  }

  async updateOrganizationManager(
    id: string,
    request: UpdateOrganizationManagerRequestDto,
  ): Promise<CreateOrganizationManagerResponseDto> {
    const manager = await this.userModel.findById(id).exec();

    if (!manager) {
      throw new NotFoundException();
    }

    await ManagerMapper.toUpdateDocument(manager, request).save();

    return ManagerMapper.toUpdateDto(manager);
  }

  async getOrganizationManagers(
    id: string,
    pagination: PaginationRequest,
  ): Promise<PaginationResponseDto<GetOrganizationManagerResponseDto>> {
    const organization = await this.organizationModel.findById(id).exec();

    if (!organization) {
      throw new NotFoundException();
    }

    const {
      skip,
      limit,
      order,
      params: { search },
    } = pagination;

    const query: any[] = [
      {
        $match: { organization: Types.ObjectId(organization.id) },
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

    const managerDtos = paginatedResult.map((manager) =>
      ManagerMapper.toGetDto(manager),
    );

    return PaginationHelper.of(
      pagination,
      totalResult[0]?.total || 0,
      managerDtos,
    );
  }

  async createAccount(
    id: string,
    request: CreateOrganizationAccountRequestDto,
    user: UserDocument,
  ): Promise<CreateOrganizationAccountResponseDto> {
    let account = new this.accountModel();
    const organization = await this.organizationModel.findById(id).exec();

    if (!organization) {
      throw new NotFoundException();
    }

    account = AccountMapper.toCreateDocument(account, request);
    account.owner = user;
    await account.save();

    organization.clearing.push({
      currency: request.currency,
      account: account,
    });
    await organization.save();

    return AccountMapper.toCreateDto(account);
  }

  async deleteAccount(
    organizationId: string,
    accountId: string,
  ): Promise<DeleteOrganizationAccountResponseDto> {
    const account = await this.accountModel.findById(accountId).exec();
    const organization = await this.organizationModel
      .findById(organizationId)
      .exec();

    if (!account || !organization) {
      throw new NotFoundException();
    }

    await account.remove();
    await this.organizationModel.updateOne(
      { _id: Types.ObjectId(organization.id) },
      { $pull: { clearing: { account: Types.ObjectId(account.id) } } },
    );

    return AccountMapper.toDeleteDto(account);
  }
}
