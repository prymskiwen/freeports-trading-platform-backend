import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Desk, DeskSchema } from 'src/schema/desk/desk.schema';
import {
  Organization,
  OrganizationSchema,
} from 'src/schema/organization/organization.schema';
import { RoleModule } from '../role/role.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Desk.name, schema: DeskSchema },
      { name: Organization.name, schema: OrganizationSchema },
    ]),
    RoleModule,
    UserModule,
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService],
})
export class OrganizationModule {}
