import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/schema/user/user.schema';
import {
  Organization,
  OrganizationDocument,
} from 'src/schema/organization/organization.schema';
import { Desk, DeskDocument } from 'src/schema/desk/desk.schema';
import { CreateDeskRequestDto } from './dto/create-desk-request.dto';
import { CreateDeskResponseDto } from './dto/create-desk-response.dto';
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
  ) {}

  async createDesk(
    organizationId: string,
    createRequest: CreateDeskRequestDto,
  ): Promise<CreateDeskResponseDto> {
    const desk = new this.deskModel();
    const organization = await this.organizationModel
      .findById(organizationId)
      .exec();

    if (!organization) {
      throw new NotFoundException();
    }

    desk.name = createRequest.name;
    desk.organization = organization;
    await desk.save();

    return {
      id: desk._id,
    };
  }

  async createDeskManager(
    id: string,
    request: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    const desk = await this.deskModel.findById(id).exec();

    if (!desk) {
      throw new NotFoundException();
    }

    const user = await this.userService.create(request, false);
    user.organization = desk.organization;

    const roleDefault = await this.roleDeskModel
      .findOne({ desk: desk, name: '_default' })
      .exec();
    user.roles.push(roleDefault);
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
