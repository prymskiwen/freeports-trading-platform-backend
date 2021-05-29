import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/schema/user/user.schema';
import {
  Organization,
  OrganizationDocument,
} from 'src/schema/organization/organization.schema';
import { Desk, DeskDocument } from 'src/schema/desk/desk.schema';
import {
  RoleOrganization,
  RoleOrganizationDocument,
} from 'src/schema/role/role-organization.schema';
import { CreateRoleOrganizationRequestDto } from './dto/create-role-organization-request.dto';
import { RoleDesk, RoleDeskDocument } from 'src/schema/role/role-desk.schema';
import { UserService } from '../user/user.service';
import { CreateUserRequestDto } from '../user/dto/create-user-request.dto';
import { CreateUserResponseDto } from '../user/dto/create-user-response.dto';
import { UserMapper } from '../user/mapper/user.mapper';
import { CreateRoleOrganizationResponseDto } from './dto/create-role-organization-response.dto';
import { RoleService } from '../role/role.service';
import { CreateOrganizationRequestDto } from './dto/create-organization-request.dto';
import { UpdateOrganizationRequestDto } from './dto/update-organization-request.dto';
import { PaginationRequest } from 'src/pagination/pagination-request.interface';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(RoleOrganization.name)
    private roleOrganizationModel: Model<RoleOrganizationDocument>,
    @InjectModel(RoleDesk.name)
    private roleDeskModel: Model<RoleDeskDocument>,
    @InjectModel(Desk.name)
    private deskModel: Model<DeskDocument>,
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
    private userService: UserService,
    private roleService: RoleService,
  ) {}

  async getById(id: string): Promise<OrganizationDocument> {
    return await this.organizationModel.findById(id).exec();
  }

  async create(
    request: CreateOrganizationRequestDto,
    persist = true,
  ): Promise<OrganizationDocument> {
    const organization = new this.organizationModel();

    organization.details = {
      name: request.name,
      street: request.street,
      street2: request.street2,
      zip: request.zip,
      city: request.city,
      country: request.country,
    };

    organization.commissionRatio = {
      organization: request.сommission,
    };

    if (persist) {
      await organization.save();
    }

    return organization;
  }

  async update(
    organization: OrganizationDocument,
    request: UpdateOrganizationRequestDto,
    persist = true,
  ): Promise<OrganizationDocument> {
    organization.details = {
      name: request.name,
      street: request.street,
      street2: request.street2,
      zip: request.zip,
      city: request.city,
      country: request.country,
    };

    organization.commissionRatio = {
      organization: request.сommission,
    };

    if (persist) {
      await organization.save();
    }

    return organization;
  }

  async getOrganizationsPaginated(
    pagination: PaginationRequest,
  ): Promise<any[]> {
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

    return await this.organizationModel.aggregate([
      ...query,
      {
        $facet: {
          paginatedResult: [{ $skip: skip }, { $limit: limit }],
          totalResult: [{ $count: 'total' }],
        },
      },
    ]);
  }

  async createDeskManager(
    id: string,
    request: CreateUserRequestDto,
    userCurrent: UserDocument,
  ): Promise<CreateUserResponseDto> {
    const desk = await this.deskModel.findById(id).exec();

    if (!desk) {
      throw new NotFoundException();
    }

    const roleDefault = await this.roleService.getRoleDeskDefault(desk);
    const user = await this.userService.create(request, false);
    user.organization = desk.organization;
    user.roles.push({
      role: roleDefault,
      assignedAt: new Date(),
      assignedBy: userCurrent,
    });

    await user.save();

    return UserMapper.toCreateDto(user);
  }

  async createRole(
    id: string,
    request: CreateRoleOrganizationRequestDto,
    user: UserDocument,
  ): Promise<CreateRoleOrganizationResponseDto> {
    const role = new this.roleOrganizationModel();
    const organization = await this.organizationModel.findById(id).exec();

    if (!organization) {
      throw new NotFoundException();
    }

    role.organization = organization;
    role.owner = user;
    role.permissions = request.permissions;
    await role.save();

    return {
      id: role._id,
    };
  }
}
