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
          { name: RoleDesk.name, schema: RoleDeskSchema },
        ],
      },
    ]),
  ],
  exports: [MongooseModule],
})
export class RoleModule {}
