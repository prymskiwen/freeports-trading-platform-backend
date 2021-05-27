import { Module } from '@nestjs/common';
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
  ],
  providers: [RoleService],
  exports: [MongooseModule, RoleService],
})
export class RoleModule {}
