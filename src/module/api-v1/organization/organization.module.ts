import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schema/user/user.schema';
import { IsUniqueInDbConstraint } from 'src/validation/is-unique-in-db.validation';
import { Desk, DeskSchema } from 'src/schema/desk/desk.schema';
import {
  Organization,
  OrganizationSchema,
} from 'src/schema/organization/organization.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Desk.name, schema: DeskSchema },
      { name: Organization.name, schema: OrganizationSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService, IsUniqueInDbConstraint],
})
export class OrganizationModule {}
