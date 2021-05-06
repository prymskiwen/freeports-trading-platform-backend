import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRoles } from 'src/schema/user/user.schema';
import {
  Organization,
  OrganizationDocument,
} from 'src/schema/organization/organization.schema';
import { Desk, DeskDocument } from 'src/schema/desk/desk.schema';
import { CreateDeskRequestDto } from './dto/create-desk-request.dto';
import { CreateDeskResponseDto } from './dto/create-desk-response.dto';
import { CreatePermissionManagerRequestDto } from './dto/create-permission-manager-request.dto';
import { CreatePermissionManagerResponseDto } from './dto/create-permission-manager-response.dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Desk.name)
    private deskModel: Model<DeskDocument>,
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  // dummy
  private encrypt(st: string): string {
    st = '#@$#%';

    return st;
  }

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

  async createDeskPermissionManager(
    deskId: string,
    createRequest: CreatePermissionManagerRequestDto,
  ): Promise<CreatePermissionManagerResponseDto> {
    const manager = new this.userModel();
    const desk = await this.deskModel.findById(deskId).exec();

    if (!desk) {
      throw new NotFoundException();
    }

    manager.organization = desk.organization;
    manager.personal.email = createRequest.email;
    manager.personal.nickname = createRequest.nickname;
    manager.personal.password = this.encrypt(createRequest.password);
    manager.roles.push(UserRoles.permissions_manager);
    await manager.save();

    return {
      id: manager._id,
    };
  }
}