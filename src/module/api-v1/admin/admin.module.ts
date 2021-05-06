import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schema/user/user.schema';
import { IsUniqueInDbConstraint } from 'src/validation/is-unique-in-db.validation';
import {
  Organization,
  OrganizationSchema,
} from 'src/schema/organization/organization.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Organization.name, schema: OrganizationSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService, IsUniqueInDbConstraint],
})
export class AdminModule {}
