import { forwardRef, Module } from '@nestjs/common';
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
import { IsUniqueInDbConstraint } from 'src/validation/is-unique-in-db.validation';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Desk.name, schema: DeskSchema },
      { name: Organization.name, schema: OrganizationSchema },
    ]),
    forwardRef(() => UserModule),
    RoleModule,
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService, IsUniqueInDbConstraint],
  exports: [OrganizationService],
})
export class OrganizationModule {}
