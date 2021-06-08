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
  RoleDeskMulti,
  RoleDeskMultiSchema,
} from 'src/schema/role/role-desk-multi.schema';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { OrganizationModule } from '../organization/organization.module';
import { DeskModule } from '../desk/desk.module';
import { PermissionController } from './permission.controller';

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
            name: RoleDeskMulti.name,
            schema: RoleDeskMultiSchema,
          },
          { name: RoleDesk.name, schema: RoleDeskSchema },
        ],
      },
    ]),
    forwardRef(() => DeskModule),
    forwardRef(() => OrganizationModule),
  ],
  controllers: [RoleController, PermissionController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
