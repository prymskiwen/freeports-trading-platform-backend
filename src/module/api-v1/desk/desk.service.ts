import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Desk, DeskDocument } from 'src/schema/desk/desk.schema';
import { CreateDeskRequestDto } from './dto/create-desk-request.dto';
import { OrganizationDocument } from 'src/schema/organization/organization.schema';
import { UpdateDeskRequestDto } from './dto/update-desk-request.dto';
import { PaginationRequest } from 'src/pagination/pagination-request.interface';
import { UserDocument } from 'src/schema/user/user.schema';
import { RoleDesk } from 'src/schema/role/role-desk.schema';
import { RoleMultidesk } from 'src/schema/role/role-multidesk.schema';
import { RoleOrganization } from 'src/schema/role/role-organization.schema';
import { PermissionOrganization } from 'src/schema/role/permission.helper';

@Injectable()
export class DeskService {
  constructor(
    @InjectModel(Desk.name)
    private deskModel: Model<DeskDocument>,
  ) {}

  hydrate(desk: any): DeskDocument {
    return this.deskModel.hydrate(desk);
  }

  async getById(id: string): Promise<DeskDocument> {
    return await this.deskModel.findById(id).exec();
  }

  async create(
    organization: OrganizationDocument,
    request: CreateDeskRequestDto,
    persist = true,
  ): Promise<DeskDocument> {
    const desk = new this.deskModel();

    desk.name = request.name;
    desk.organization = organization;
    desk.createdAt = new Date();

    if (persist) {
      await desk.save();
    }

    return desk;
  }

  async update(
    desk: DeskDocument,
    request: UpdateDeskRequestDto,
    persist = true,
  ): Promise<DeskDocument> {
    Object.keys(request).forEach((key) => {
      desk[key] = request[key];
    });

    await desk.save();

    if (persist) {
      await desk.save();
    }

    return desk;
  }

  async getDesksPaginated(
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
          organization: organization._id,
        },
      },
    ];

    if (search) {
      query.push({
        $match: {
          name: { $regex: '.*' + search + '.*', $options: 'i' },
        },
      });
    }
    if (Object.keys(order).length) {
      query.push({ $sort: order });
    }

    return await this.deskModel.aggregate([
      ...query,
      {
        $facet: {
          paginatedResult: [{ $skip: skip }, { $limit: limit }],
          totalResult: [{ $count: 'total' }],
        },
      },
    ]);
  }

  async getMyDeskList(user: UserDocument): Promise<DeskDocument[]> {
    const organization = user.organization as OrganizationDocument;

    await user.populate('roles.role').execPopulate();

    const hasPermission = user.roles.some((role) => {
      // if role is not disabled
      if (role.role.disabled) {
        return false;
      }

      // if role kind is organization role
      if (role.role.kind !== RoleOrganization.name) {
        return false;
      }

      // and organization is the same the user belongs to
      if (!organization.equals(role.role['organization'])) {
        return false;
      }

      // and role has permission to read desks
      return role.role.permissions.includes(PermissionOrganization.deskRead);
    });

    // we have access to any desk within organization
    if (hasPermission) {
      return await this.deskModel
        .find({ organization: organization._id })
        .exec();
    }

    // if we have no access to all desks check what we realted to by desk or multidesk roles
    const deskIds = user.roles.reduce((prev, role) => {
      if (role.role.disabled) {
        return prev;
      }

      if (role.role.kind === RoleDesk.name) {
        return prev.concat(role.role['desk']);
      }

      if (role.role.kind === RoleMultidesk.name) {
        return prev.concat(role.effectiveDesks);
      }

      return prev;
    }, []);

    return await this.deskModel.find({ _id: { $in: deskIds } }).exec();
  }
}
