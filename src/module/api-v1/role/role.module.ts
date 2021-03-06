import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from 'src/schema/role/role.schema';
import {
  RoleClearer,
  RoleClearerSchema,
} from 'src/schema/role/role-clearer.schema';
import {
  RoleOrganization,
  RoleOrganizationSchema,
} from 'src/schema/role/role-organization.schema';
import { RoleDesk, RoleDeskSchema } from 'src/schema/role/role-desk.schema';
import {
  RoleMultidesk,
  RoleMultideskSchema,
} from 'src/schema/role/role-multidesk.schema';
import { RoleService } from './role.service';
import { RoleMultideskController } from './role-multidesk.controller';
import { OrganizationModule } from '../organization/organization.module';
import { DeskModule } from '../desk/desk.module';
import { PermissionController } from './permission.controller';
import { UserModule } from '../user/user.module';
import { RoleClearerController } from './role-clearer.controller';
import { RoleOrganizationController } from './role-organization.controller';
import { RoleDeskController } from './role-desk.controller';
import { RoleClearerAssignController } from './role-clearer-assign.controller';
import { RoleOrganizationAssignController } from './role-organization-assign.controller';
import { RoleMultideskAssignController } from './role-multidesk-assign.controller';
import { RoleDeskAssignController } from './role-desk-assign.controller';
import { RoleDeskFromOrganizationController } from './role-desk-from-organization.controller';
import { RoleDeskFromOrganizationAssignController } from './role-desk-from-organization-assign.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Role.name,
        schema: RoleSchema,
        discriminators: [
          { name: RoleClearer.name, schema: RoleClearerSchema },
          {
            name: RoleOrganization.name,
            schema: RoleOrganizationSchema,
          },
          {
            name: RoleMultidesk.name,
            schema: RoleMultideskSchema,
          },
          { name: RoleDesk.name, schema: RoleDeskSchema },
        ],
      },
    ]),
    forwardRef(() => DeskModule),
    forwardRef(() => OrganizationModule),
    forwardRef(() => UserModule),
  ],
  controllers: [
    RoleClearerController,
    RoleClearerAssignController,
    RoleOrganizationController,
    RoleOrganizationAssignController,
    RoleMultideskController,
    RoleMultideskAssignController,
    RoleDeskController,
    RoleDeskAssignController,
    RoleDeskFromOrganizationController,
    RoleDeskFromOrganizationAssignController,
    PermissionController,
  ],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
